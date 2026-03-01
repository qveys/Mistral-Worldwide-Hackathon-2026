import { Router } from 'express';
import { z } from 'zod';
import { BedrockService, BedrockValidationExhaustedError } from '../services/bedrock.js';
import { buildRevisePrompt } from '../prompts/revise.js';
import { saveProject } from '../services/storage.js';
import { DEMO_REVISED_ROADMAP } from '../mocks/demoRoadmap.js';
import { roadmapSchema } from '../lib/schema.js';
import { hasCycle, topologicalSort } from '../lib/dependencyGraph.js';
import { validateDependencyIntegrity, validateTimelineConstraints } from '../lib/validation.js';
import { HttpError } from '../lib/httpError.js';
import { logRouteError } from '../lib/logger.js';

const router = Router();
const bedrockService = new BedrockService();
const DEMO_MODE = process.env.DEMO_MODE === 'true';

const ReviseRequestSchema = z.object({
  projectId: z.string().regex(/^[A-Za-z0-9_-]{1,64}$/, 'Invalid projectId format'),
  userId: z.string().uuid(),
  instruction: z.string().min(1, 'Instruction is required'),
  roadmap: roadmapSchema,
});

const ReviseResponseSchema = roadmapSchema;

router.post('/', async (req, res) => {
  try {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      res.json(ReviseResponseSchema.parse(DEMO_REVISED_ROADMAP));
      return;
    }

    const { projectId, userId, instruction, roadmap } = ReviseRequestSchema.parse(req.body);

    const prompt = buildRevisePrompt(roadmap, instruction);

    const revisedRoadmap = await bedrockService.invokeModelWithRetry(
      prompt,
      'reviseRoadmap',
      (body) => ReviseResponseSchema.parse(body)
    );

    const tasks = revisedRoadmap.roadmap.map((task) => ({
      id: task.id,
      dependsOn: task.dependsOn,
      priority: task.priority,
    }));

    validateDependencyIntegrity(tasks);
    if (hasCycle(tasks)) {
      throw new HttpError('Dependency graph contains a cycle', 400);
    }
    topologicalSort(tasks);
    validateTimelineConstraints(tasks);

    await saveProject(projectId, {
      userId,
      roadmap: revisedRoadmap.roadmap,
    });

    res.json(revisedRoadmap);
  } catch (error) {
    logRouteError('POST /api/revise', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request or response', details: error.errors });
    } else if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else if (error instanceof BedrockValidationExhaustedError) {
      res.status(502).json({
        error: 'Upstream model returned invalid format after retries',
        attempts: error.attempts,
        details: error.lastZodError.errors,
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;

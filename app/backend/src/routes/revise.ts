import { Router } from 'express';
import { z } from 'zod';
import { BedrockService, BedrockValidationExhaustedError } from '../services/bedrock.js';
import { buildRevisePrompt } from '../prompts/revise.js';
import { saveProject } from '../services/storage.js';
import { DEMO_REVISED_ROADMAP } from '../mocks/demoRoadmap.js';
import { logRouteError } from '../lib/logger.js';

const router = Router();
const bedrockService = new BedrockService();
const DEMO_MODE = process.env.DEMO_MODE === 'true';

const RoadmapItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number().min(1).max(5),
  dependencies: z.array(z.string()).optional()
});

const ReviseRequestSchema = z.object({
  projectId: z.string().regex(/^[A-Za-z0-9_-]+$/, 'Invalid projectId format'),
  instruction: z.string().min(1, 'Instruction is required'),
  roadmap: z.object({
    roadmap: z.array(RoadmapItemSchema)
  })
});

const ReviseResponseSchema = z.object({
  roadmap: z.array(RoadmapItemSchema)
});

router.post('/revise', async (req, res) => {
  try {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      res.json(DEMO_REVISED_ROADMAP);
      return;
    }

    const { projectId, instruction, roadmap } = ReviseRequestSchema.parse(req.body);

    const prompt = buildRevisePrompt(roadmap, instruction);

    const revisedRoadmap = await bedrockService.invokeModelWithRetry(
      prompt,
      'reviseRoadmap',
      (body) => ReviseResponseSchema.parse(body)
    );

    await saveProject(projectId, revisedRoadmap);

    res.json(revisedRoadmap);
  } catch (error) {
    logRouteError('POST /api/revise', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid request or response', details: error.errors });
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

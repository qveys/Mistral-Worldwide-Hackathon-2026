import { Router } from 'express';
import { z } from 'zod';
import { BedrockService } from '../services/bedrock.js';
import { buildRevisePrompt } from '../prompts/revise.js';
import { saveProject } from '../services/storage.js';
import { DEMO_REVISED_ROADMAP } from '../mocks/demoRoadmap.js';
import { isValidProjectId, sanitizeProjectId } from '../lib/projectId.js';

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

const ReviseResponseSchema = z.object({
  roadmap: z.array(RoadmapItemSchema)
});

const ReviseRequestSchema = z.object({
  projectId: z.string().min(1).refine(isValidProjectId, 'Invalid project id'),
  instruction: z.string().min(1, 'Instruction is required'),
  roadmap: ReviseResponseSchema
});

const BedrockOutputSchema = z.object({
  outputs: z.array(z.object({ text: z.string() })).min(1)
});

function parseReviseModelResponse(rawResponse: unknown): z.infer<typeof ReviseResponseSchema> {
  const directParsed = ReviseResponseSchema.safeParse(rawResponse);
  if (directParsed.success) {
    return directParsed.data;
  }

  const bedrockOutput = BedrockOutputSchema.parse(rawResponse);
  const firstText = bedrockOutput.outputs[0]?.text;
  if (!firstText) {
    throw new Error('Missing Bedrock output text');
  }

  let parsedTextPayload: unknown;
  try {
    parsedTextPayload = JSON.parse(firstText);
  } catch {
    throw new Error('Invalid JSON in Bedrock output text');
  }

  return ReviseResponseSchema.parse(parsedTextPayload);
}

router.post('/', async (req, res) => {
  try {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      res.json({ roadmap: DEMO_REVISED_ROADMAP.revisedRoadmap });
      return;
    }

    const { projectId, instruction, roadmap } = ReviseRequestSchema.parse(req.body);

    const prompt = buildRevisePrompt(roadmap, instruction);

    const rawResponse = await bedrockService.invokeModel(prompt);

    const revisedRoadmap = parseReviseModelResponse(rawResponse);

    await saveProject(sanitizeProjectId(projectId), revisedRoadmap);

    res.json(revisedRoadmap);
  } catch (error) {
    console.error('Revise endpoint error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request or response", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  }
});

export default router;

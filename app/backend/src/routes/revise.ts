import { Router } from 'express';
import { z } from 'zod';
import { BedrockService } from '../services/bedrock.js';
import { buildRevisePrompt } from '../prompts/revise.js';
import { saveProject } from '../services/storage.js';

const router = Router();
const bedrockService = new BedrockService();

const RoadmapItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number().min(1).max(5),
  dependencies: z.array(z.string()).optional()
});

const ReviseRequestSchema = z.object({
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  instruction: z.string().min(1, "Instruction is required"),
  roadmap: z.object({
    roadmap: z.array(RoadmapItemSchema)
  })
});

const ReviseResponseSchema = z.object({
  roadmap: z.array(RoadmapItemSchema)
});

router.post('/', async (req, res) => {
  try {
    const { projectId, userId, instruction, roadmap } = ReviseRequestSchema.parse(req.body);

    const prompt = buildRevisePrompt(roadmap, instruction);

    const rawResponse = await bedrockService.invokeModel(prompt);

    const revisedRoadmap = ReviseResponseSchema.parse(rawResponse);

    await saveProject(projectId, {
      userId,
      roadmap: revisedRoadmap.roadmap
    });

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

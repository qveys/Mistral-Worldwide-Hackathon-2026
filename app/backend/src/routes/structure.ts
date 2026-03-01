import { Router } from 'express';
import { z } from 'zod';
import { BedrockService, BedrockValidationExhaustedError } from '../services/bedrock.js';
import { DEMO_ROADMAP } from '../mocks/demoRoadmap.js';
import { HttpError } from '../lib/httpError.js';

const router = Router();
const bedrockService = new BedrockService();
const DEMO_MODE = process.env.DEMO_MODE === 'true';

const StructureRequestSchema = z.object({
  transcript: z.string().min(10, 'Transcript too short'),
  userId: z.string().uuid(),
  sessionId: z.string().uuid(),
});

const StructureResponseSchema = z.object({
  roadmap: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      priority: z.number().min(1).max(5),
      dependsOn: z.array(z.string()).default([]),
    })
  ),
  metadata: z.object({
    processingTimeMs: z.number(),
    modelUsed: z.string(),
    confidenceScore: z.number().min(0).max(1),
  }),
});

router.post('/', async (req, res) => {
  try {
    if (DEMO_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      res.json(DEMO_ROADMAP);
      return;
    }

    const validatedRequest = StructureRequestSchema.parse(req.body);

    const startTime = Date.now();
    const roadmapData = await bedrockService.generateRoadmap(validatedRequest.transcript);
    const processingTimeMs = Date.now() - startTime;

    const response = {
      ...roadmapData,
      metadata: {
        ...roadmapData.metadata,
        processingTimeMs,
      },
    };

    const validatedResponse = StructureResponseSchema.parse(response);

    res.json(validatedResponse);
  } catch (error) {
    console.error('Structure endpoint error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request", details: error.issues });
    } else {
      res.status(500).json({ error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }
});

export default router;

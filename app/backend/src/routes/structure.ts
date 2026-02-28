import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { BedrockService } from '../services/bedrock.js';
import { StorageService } from '../services/storage.js';
import { RoadmapResponseSchema } from '../schemas/roadmap.js';

const router = Router();
const bedrockService = new BedrockService();
const storageService = new StorageService();

// Request schema for structure endpoint
const StructureRequestSchema = z.object({
  transcript: z.string().min(10, "Transcript too short"),
  userId: z.string().uuid(),
  sessionId: z.string().uuid()
});

router.post('/', async (req, res) => {
  try {
    // Validate request
    const validatedRequest = StructureRequestSchema.parse(req.body);
    
    // Call Bedrock service to generate roadmap
    const startTime = Date.now();
    const roadmapData = await bedrockService.generateRoadmap(
      validatedRequest.transcript,
      validatedRequest.userId
    );
    const processingTimeMs = Date.now() - startTime;
    
    // Enhance response with processing metadata
    const response = {
      ...roadmapData,
      metadata: {
        ...roadmapData.metadata,
        processingTimeMs
      }
    };
    
    // Validate response before sending
    const validatedResponse = RoadmapResponseSchema.parse(response);

    // Persist the project so it can be retrieved later via GET /api/project/:id
    const projectId = uuidv4();
    await storageService.saveProject({
      id: projectId,
      userId: validatedRequest.userId,
      roadmap: validatedResponse.roadmap,
      metadata: validatedResponse.metadata
    });

    res.json({ projectId, ...validatedResponse });
  } catch (error) {
    console.error('Structure endpoint error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  }
});

export default router;
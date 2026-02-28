import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Request schema for revise endpoint
const ReviseRequestSchema = z.object({
  roadmapId: z.string().uuid(),
  revisionInstructions: z.string().min(10, "Revision instructions too short"),
  userId: z.string().uuid()
});

// Response schema for revise endpoint
const ReviseResponseSchema = z.object({
  revisedRoadmap: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.number().min(1).max(5),
    status: z.enum(["unchanged", "modified", "removed", "added"]),
    dependencies: z.array(z.string()).optional()
  })),
  changesSummary: z.object({
    itemsModified: z.number(),
    itemsAdded: z.number(),
    itemsRemoved: z.number(),
    confidenceScore: z.number().min(0).max(1)
  })
});

router.post('/revise', (req, res) => {
  try {
    // Validate request
    const validatedRequest = ReviseRequestSchema.parse(req.body);
    
    // TODO: Implement Bedrock integration for revision
    const mockResponse = {
      revisedRoadmap: [
        {
          id: "task-1",
          title: "Implement core API",
          description: "Build Express routes and validation with Zod",
          priority: 1,
          status: "modified",
          dependencies: []
        }
      ],
      changesSummary: {
        itemsModified: 1,
        itemsAdded: 0,
        itemsRemoved: 0,
        confidenceScore: 0.92
      }
    };
    
    // Validate response before sending
    const validatedResponse = ReviseResponseSchema.parse(mockResponse);
    
    res.json(validatedResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

export default router;
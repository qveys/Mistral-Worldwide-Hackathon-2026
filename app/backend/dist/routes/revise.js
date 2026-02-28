import { Router } from 'express';
import { z } from 'zod';
import { BedrockService } from '../services/bedrock.js';
const router = Router();
const bedrockService = new BedrockService();
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
router.post('/revise', async (req, res) => {
    try {
        // Validate request
        const validatedRequest = ReviseRequestSchema.parse(req.body);
        // Call Bedrock service to generate revision
        const startTime = Date.now();
        const revisionData = await bedrockService.generateRevision(validatedRequest.roadmapId, validatedRequest.revisionInstructions);
        const processingTimeMs = Date.now() - startTime;
        // Enhance response with processing metadata
        const response = {
            ...revisionData,
            changesSummary: {
                ...revisionData.changesSummary,
                processingTimeMs
            }
        };
        // Validate response before sending
        const validatedResponse = ReviseResponseSchema.parse(response);
        res.json(validatedResponse);
    }
    catch (error) {
        console.error('Revise endpoint error:', error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ error: "Invalid request", details: error.errors });
        }
        else {
            res.status(500).json({ error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" });
        }
    }
});
export default router;
//# sourceMappingURL=revise.js.map
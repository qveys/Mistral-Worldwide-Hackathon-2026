import { Router } from 'express';
import { z } from 'zod';
import { BedrockService } from '../services/bedrock.js';
import { hasCycle, topologicalSort, validateReferentialIntegrity } from '../lib/graph.js';

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
    dependsOn: z.array(z.string()).default([])
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
    const revisionData = await bedrockService.generateRevision(
      validatedRequest.roadmapId,
      validatedRequest.revisionInstructions
    );
    const processingTimeMs = Date.now() - startTime;

    // Enhance response with processing metadata
    const response = {
      ...revisionData,
      changesSummary: {
        ...revisionData.changesSummary,
        processingTimeMs
      }
    };

    // Validate response schema
    const validatedResponse = ReviseResponseSchema.parse(response);

    // Validate referential integrity
    const integrityResult = validateReferentialIntegrity(
      validatedResponse.revisedRoadmap.map(t => ({ id: t.id, dependsOn: t.dependsOn }))
    );
    if (!integrityResult.valid) {
      res.status(400).json({ error: "Referential integrity violation", details: integrityResult.errors });
      return;
    }

    // Build adjacency list and check for cycles
    const adjacencyList = new Map<string, string[]>();
    for (const task of validatedResponse.revisedRoadmap) {
      adjacencyList.set(task.id, task.dependsOn);
    }

    if (hasCycle(adjacencyList)) {
      res.status(400).json({ error: "Circular dependency detected in revised roadmap" });
      return;
    }

    // Re-order using topological sort
    const sortedIds = topologicalSort(adjacencyList);
    if (!sortedIds) {
      res.status(400).json({ error: "Unable to resolve dependency order" });
      return;
    }

    const taskMap = new Map(validatedResponse.revisedRoadmap.map(t => [t.id, t]));
    const sortedRoadmap = sortedIds
      .filter(id => taskMap.has(id))
      .map(id => taskMap.get(id)!);

    res.json({
      revisedRoadmap: sortedRoadmap,
      changesSummary: validatedResponse.changesSummary
    });
  } catch (error) {
    console.error('Revise endpoint error:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid request", details: error.errors });
    } else {
      res.status(500).json({ error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" });
    }
  }
});

export default router;

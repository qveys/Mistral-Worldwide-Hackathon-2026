import { z } from 'zod';

// Shared Task schema — used by StorageService, BedrockService, and route validators
export const TaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  priority: z.number().min(1).max(5),
  dependencies: z.array(z.string()).optional()
});

// Shared Roadmap metadata schema
export const RoadmapMetadataSchema = z.object({
  processingTimeMs: z.number(),
  modelUsed: z.string(),
  confidenceScore: z.number().min(0).max(1)
});

// Full roadmap response schema (Bedrock output + /structure response)
export const RoadmapResponseSchema = z.object({
  roadmap: z.array(TaskSchema),
  metadata: RoadmapMetadataSchema
});

// Revised task extends Task with a status field
export const RevisedTaskSchema = TaskSchema.extend({
  status: z.enum(["unchanged", "modified", "removed", "added"])
});

// Full revision response schema (Bedrock output + /revise response)
export const RevisionResponseSchema = z.object({
  revisedRoadmap: z.array(RevisedTaskSchema),
  changesSummary: z.object({
    itemsModified: z.number(),
    itemsAdded: z.number(),
    itemsRemoved: z.number(),
    confidenceScore: z.number().min(0).max(1)
  })
});

export type Task = z.infer<typeof TaskSchema>;
export type RoadmapMetadata = z.infer<typeof RoadmapMetadataSchema>;
export type RoadmapResponse = z.infer<typeof RoadmapResponseSchema>;
export type RevisionResponse = z.infer<typeof RevisionResponseSchema>;

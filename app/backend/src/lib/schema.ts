import { z } from 'zod';

// --- WebSocket events sent from backend → frontend ---

export const TranscriptionDeltaEventSchema = z.object({
    type: z.literal('transcription.text.delta'),
    text: z.string(),
});

export const TranscriptionDoneEventSchema = z.object({
    type: z.literal('transcription.done'),
});

export const TranscriptionErrorEventSchema = z.object({
    type: z.literal('error'),
    error: z.string(),
});

export const TranscriptionWsEventSchema = z.discriminatedUnion('type', [
    TranscriptionDeltaEventSchema,
    TranscriptionDoneEventSchema,
    TranscriptionErrorEventSchema,
]);

// --- Roadmap schemas ---

export const ObjectiveSchema = z.object({
    id: z.string(),
    text: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
});

export const TaskSchema = z.object({
    id: z.string(),
    title: z.string(),
    objectiveId: z.string(),
    status: z.enum(['backlog', 'doing', 'done']),
    estimate: z.enum(['S', 'M', 'L']),
    priority: z.enum(['high', 'medium', 'low']),
    dependsOn: z.array(z.string()).default([]),
});

export const PlanningSlotSchema = z.object({
    taskId: z.string(),
    day: z.string(), // ISO date string e.g. "2026-03-01"
    slot: z.enum(['AM', 'PM']),
    done: z.boolean().default(false),
});

export const PlanningSchema = z.object({
    startDate: z.string(),
    endDate: z.string(),
    slots: z.array(PlanningSlotSchema),
});

export const RevisionEntrySchema = z.object({
    timestamp: z.string(),
    patch: z.string(),
});

export const RoadmapSchema = z.object({
    projectId: z.string(),
    title: z.string(),
    createdAt: z.string(),
    brainDump: z.string(),
    objectives: z.array(ObjectiveSchema).min(1),
    tasks: z.array(TaskSchema).min(1),
    planning: PlanningSchema.optional(),
    revisionHistory: z.array(RevisionEntrySchema).default([]),
});

// --- API input schemas ---

export const StructureInputSchema = z.object({
    text: z.string().min(1, 'Brain dump text is required'),
    includePlanning: z.boolean().default(false),
});

export const ReviseInputSchema = z.object({
    projectId: z.string().min(1),
    instruction: z.string().min(1),
    roadmap: RoadmapSchema,
});

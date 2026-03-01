import { z } from 'zod';

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

// --- Inferred TypeScript types ---

export type Objective = z.infer<typeof ObjectiveSchema>;
export type Task = z.infer<typeof TaskSchema>;
export type PlanningSlot = z.infer<typeof PlanningSlotSchema>;
export type Planning = z.infer<typeof PlanningSchema>;
export type RevisionEntry = z.infer<typeof RevisionEntrySchema>;
export type Roadmap = z.infer<typeof RoadmapSchema>;

// Convenience aliases for frontend/backend
export type TaskStatus = Task['status'];
export type TaskPriority = Task['priority'];
export type TaskEstimate = Task['estimate'];
export type SlotTime = PlanningSlot['slot'];

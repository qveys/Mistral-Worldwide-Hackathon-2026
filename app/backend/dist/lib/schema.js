import { z } from 'zod';
import { RoadmapSchema } from '@echomaps/shared';
// --- Re-export roadmap schemas from shared ---
export { ObjectiveSchema, PlanningSchema, PlanningSlotSchema, RevisionEntrySchema, RoadmapSchema, TaskSchema, } from '@echomaps/shared';
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
//# sourceMappingURL=schema.js.map
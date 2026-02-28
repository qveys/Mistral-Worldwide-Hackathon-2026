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

import type { z } from 'zod';
import type {
    TranscriptionDeltaEventSchema,
    TranscriptionDoneEventSchema,
    TranscriptionErrorEventSchema,
    TranscriptionWsEventSchema,
} from '../lib/schema.js';

// --- Inferred from Zod schemas ---

export type TranscriptionDeltaEvent = z.infer<typeof TranscriptionDeltaEventSchema>;
export type TranscriptionDoneEvent = z.infer<typeof TranscriptionDoneEventSchema>;
export type TranscriptionErrorEvent = z.infer<typeof TranscriptionErrorEventSchema>;
export type TranscriptionWsEvent = z.infer<typeof TranscriptionWsEventSchema>;

// --- Service types ---

export interface VoxtralConfig {
    model: string;
    audioFormat: {
        encoding: string;
        sampleRate: number;
    };
}

export interface TranscribeCallbacks {
    onDelta: (text: string) => void;
    onDone: () => void;
    onError: (error: string) => void;
}

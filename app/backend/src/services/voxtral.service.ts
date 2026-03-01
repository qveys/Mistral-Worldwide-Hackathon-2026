import {
    AudioEncoding,
    RealtimeTranscription,
    type RealtimeTranscriptionError,
    type TranscriptionStreamDone,
    type TranscriptionStreamTextDelta,
} from '@mistralai/mistralai/extra/realtime/index.js';
import { logger } from '../lib/logger.js';
import type { TranscribeCallbacks } from '../types/transcription.js';

const VOXTRAL_MODEL = 'voxtral-mini-transcribe-realtime-2602';
const SAMPLE_RATE = 16000;

function isTextDelta(event: unknown): event is TranscriptionStreamTextDelta {
    return (
        typeof event === 'object' &&
        event !== null &&
        (event as Record<string, unknown>)['type'] === 'transcription.text.delta'
    );
}

function isDone(event: unknown): event is TranscriptionStreamDone {
    return (
        typeof event === 'object' &&
        event !== null &&
        (event as Record<string, unknown>)['type'] === 'transcription.done'
    );
}

function isError(event: unknown): event is RealtimeTranscriptionError {
    return (
        typeof event === 'object' &&
        event !== null &&
        (event as Record<string, unknown>)['type'] === 'error'
    );
}

export class VoxtralService {
    private getApiKey(): string {
        const apiKey = process.env['MISTRAL_API_KEY'];
        if (!apiKey) {
            throw new Error('MISTRAL_API_KEY environment variable is required');
        }
        return apiKey;
    }

    async transcribeStream(
        audioStream: AsyncIterable<Uint8Array>,
        callbacks: TranscribeCallbacks,
    ): Promise<void> {
        const sessionId = crypto.randomUUID();
        logger.info('VoxtralService', 'Starting transcription session', { sessionId });

        const client = new RealtimeTranscription({
            apiKey: this.getApiKey(),
        });

        let deltaCount = 0;
        const startTime = Date.now();

        try {
            for await (const event of client.transcribeStream(audioStream, VOXTRAL_MODEL, {
                audioFormat: {
                    encoding: AudioEncoding.PcmS16le,
                    sampleRate: SAMPLE_RATE,
                },
            })) {
                if (isTextDelta(event)) {
                    deltaCount++;
                    callbacks.onDelta(event.text);
                } else if (isDone(event)) {
                    logger.info('VoxtralService', 'Transcription done', {
                        sessionId,
                        deltaCount,
                        durationMs: Date.now() - startTime,
                    });
                    callbacks.onDone();
                    break;
                } else if (isError(event)) {
                    const errorDetail = event.error;
                    const errorMessage =
                        typeof errorDetail.message === 'string'
                            ? errorDetail.message
                            : JSON.stringify(errorDetail.message);
                    logger.error('VoxtralService', 'Transcription error', {
                        sessionId,
                        error: errorMessage,
                    });
                    callbacks.onError(errorMessage);
                    break;
                }
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger.error('VoxtralService', 'Unexpected error during transcription', {
                sessionId,
                error: message,
            });
            callbacks.onError(message);
        } finally {
            logger.info('VoxtralService', 'Session closed', {
                sessionId,
                durationMs: Date.now() - startTime,
            });
        }
    }
}

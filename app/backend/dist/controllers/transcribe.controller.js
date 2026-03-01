import { logger } from '../lib/logger.js';
import { TranscriptionWsEventSchema } from '../lib/schema.js';
import { VoxtralService } from '../services/voxtral.service.js';
/**
 * Bridge between a client WebSocket (binary audio in, JSON events out)
 * and the VoxtralService (AsyncGenerator<Uint8Array> in, callbacks out).
 */
export class TranscribeController {
    voxtralService;
    constructor() {
        this.voxtralService = new VoxtralService();
    }
    handleConnection(ws) {
        const connectionId = crypto.randomUUID();
        logger.info('TranscribeController', 'Client connected', { connectionId });
        // --- Build an AsyncIterable from incoming WS binary messages ---
        let resolveChunk = null;
        let streamClosed = false;
        const audioStream = {
            [Symbol.asyncIterator]() {
                return {
                    next() {
                        if (streamClosed) {
                            return Promise.resolve({ value: undefined, done: true });
                        }
                        return new Promise((resolve) => {
                            resolveChunk = resolve;
                        });
                    },
                    return() {
                        streamClosed = true;
                        resolveChunk?.({ value: undefined, done: true });
                        return Promise.resolve({ value: undefined, done: true });
                    },
                };
            },
        };
        // --- WS message handler: push binary chunks into the iterator ---
        ws.on('message', (data, isBinary) => {
            if (!isBinary) {
                // Ignore non-binary messages (e.g. text pings)
                return;
            }
            let chunk;
            if (Buffer.isBuffer(data)) {
                chunk = new Uint8Array(data);
            }
            else if (data instanceof ArrayBuffer) {
                chunk = new Uint8Array(data);
            }
            else {
                chunk = new Uint8Array(Buffer.concat(data));
            }
            if (resolveChunk) {
                const resolve = resolveChunk;
                resolveChunk = null;
                resolve({ value: chunk, done: false });
            }
        });
        ws.on('close', () => {
            logger.info('TranscribeController', 'Client disconnected', { connectionId });
            streamClosed = true;
            resolveChunk?.({ value: undefined, done: true });
        });
        ws.on('error', (err) => {
            logger.error('TranscribeController', 'WebSocket error', {
                connectionId,
                error: err.message,
            });
            streamClosed = true;
            resolveChunk?.({ value: undefined, done: true });
        });
        // --- Helper: validate & send JSON event to client ---
        const sendEvent = (event) => {
            if (ws.readyState !== ws.OPEN)
                return;
            const parsed = TranscriptionWsEventSchema.safeParse(event);
            if (!parsed.success) {
                logger.error('TranscribeController', 'Invalid outgoing event', {
                    connectionId,
                    event,
                    zodError: parsed.error.message,
                });
                return;
            }
            ws.send(JSON.stringify(parsed.data));
        };
        // --- Start streaming transcription ---
        this.voxtralService
            .transcribeStream(audioStream, {
            onDelta: (text) => {
                sendEvent({ type: 'transcription.text.delta', text });
            },
            onDone: () => {
                sendEvent({ type: 'transcription.done' });
                ws.close(1000, 'Transcription complete');
            },
            onError: (error) => {
                sendEvent({ type: 'error', error });
                ws.close(1011, 'Transcription error');
            },
        })
            .catch((err) => {
            const message = err instanceof Error ? err.message : String(err);
            logger.error('TranscribeController', 'Unhandled transcription error', {
                connectionId,
                error: message,
            });
            sendEvent({ type: 'error', error: message });
            ws.close(1011, 'Internal error');
        });
    }
}
//# sourceMappingURL=transcribe.controller.js.map
import type { WebSocket } from 'ws';
/**
 * Bridge between a client WebSocket (binary audio in, JSON events out)
 * and the VoxtralService (AsyncGenerator<Uint8Array> in, callbacks out).
 */
export declare class TranscribeController {
    private readonly voxtralService;
    constructor();
    handleConnection(ws: WebSocket): void;
}
//# sourceMappingURL=transcribe.controller.d.ts.map
import { EventEmitter } from 'events';
import type { Server as HttpServer } from 'http';
/**
 * Voxstral WebSocket Service for real-time voice transcription
 * This service handles WebSocket connections for voice input and provides transcription events
 */
export declare class VoxstralService extends EventEmitter {
    private wss;
    private server;
    private activeConnections;
    private transcriptionSessions;
    constructor(server: HttpServer);
    private handleMessage;
    private startTranscriptionSession;
    private processAudioData;
    private simulateVoxstralTranscription;
    private endTranscriptionSession;
    private cleanupConnection;
    getActiveSessionCount(): number;
    getActiveConnectionCount(): number;
    /**
     * Broadcast message to all connected clients
     */
    broadcast(message: unknown): void;
}
//# sourceMappingURL=voxstral.d.ts.map
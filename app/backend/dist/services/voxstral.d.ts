import { EventEmitter } from 'events';
/**
 * Voxstral WebSocket Service for real-time voice transcription
 * This service handles WebSocket connections for voice input and provides transcription events
 */
export declare class VoxstralService extends EventEmitter {
    private wss;
    private activeConnections;
    private transcriptionSessions;
    constructor(server: any);
    private handleMessage;
    private startTranscriptionSession;
    private processAudioData;
    private simulateVoxstralTranscription;
    private endTranscriptionSession;
    private cleanupConnection;
    /**
     * Get active session count
     */
    getActiveSessionCount(): number;
    /**
     * Get active connection count
     */
    getActiveConnectionCount(): number;
    /**
     * Broadcast message to all connected clients
     */
    broadcast(message: any): void;
}
//# sourceMappingURL=voxstral.d.ts.map
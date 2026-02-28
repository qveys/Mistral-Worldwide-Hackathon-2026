import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
const WS = require('ws');
/**
 * Voxstral WebSocket Service for real-time voice transcription
 * This service handles WebSocket connections for voice input and provides transcription events
 */
export class VoxstralService extends EventEmitter {
    wss;
    activeConnections;
    transcriptionSessions;
    constructor(server) {
        super();
        this.activeConnections = new Map();
        this.transcriptionSessions = new Map();
        // Initialize WebSocket server
        this.wss = new WS.Server({ server });
        this.wss.on('connection', (ws) => {
            const connectionId = uuidv4();
            this.activeConnections.set(connectionId, ws);
            console.log(`New Voxstral connection: ${connectionId}`);
            ws.on('message', (message) => {
                this.handleMessage(connectionId, message);
            });
            ws.on('close', () => {
                this.cleanupConnection(connectionId);
            });
            ws.on('error', (error) => {
                console.error(`Voxstral connection error: ${connectionId}`, error);
                this.cleanupConnection(connectionId);
            });
            // Send connection acknowledgment
            ws.send(JSON.stringify({
                type: 'connection_ack',
                connectionId,
                timestamp: Date.now()
            }));
        });
        console.log('Voxstral WebSocket service initialized');
    }
    handleMessage(connectionId, message) {
        try {
            const data = JSON.parse(message);
            switch (data.type) {
                case 'start_transcription':
                    this.startTranscriptionSession(connectionId, data.userId);
                    break;
                case 'audio_data':
                    this.processAudioData(connectionId, data.audio);
                    break;
                case 'end_transcription':
                    this.endTranscriptionSession(connectionId);
                    break;
                default:
                    console.warn(`Unknown message type: ${data.type}`);
            }
        }
        catch (error) {
            console.error('Error processing Voxstral message:', error);
        }
    }
    startTranscriptionSession(connectionId, userId) {
        const ws = this.activeConnections.get(connectionId);
        if (!ws)
            return;
        const sessionId = uuidv4();
        this.transcriptionSessions.set(sessionId, {
            connectionId,
            userId,
            sessionId,
            transcript: '',
            startTime: Date.now()
        });
        console.log(`Started transcription session: ${sessionId} for user: ${userId}`);
        ws.send(JSON.stringify({
            type: 'transcription_started',
            sessionId,
            timestamp: Date.now()
        }));
    }
    processAudioData(connectionId, audioData) {
        // Find the active session for this connection
        const session = Array.from(this.transcriptionSessions.values()).find(s => s.connectionId === connectionId);
        if (!session) {
            console.warn(`No active session for connection: ${connectionId}`);
            return;
        }
        // TODO: Implement actual Voxstral audio processing
        // For now, we'll simulate transcription
        const simulatedTranscript = this.simulateVoxstralTranscription(audioData);
        // Update the session transcript
        session.transcript += simulatedTranscript + ' ';
        // Emit transcription event
        this.emit('transcription_update', {
            sessionId: session.sessionId,
            userId: session.userId,
            transcript: session.transcript.trim(),
            isFinal: false,
            timestamp: Date.now()
        });
        // Send interim result to client
        const ws = this.activeConnections.get(connectionId);
        if (ws) {
            ws.send(JSON.stringify({
                type: 'transcription_update',
                sessionId: session.sessionId,
                transcript: session.transcript.trim(),
                isFinal: false,
                timestamp: Date.now()
            }));
        }
    }
    simulateVoxstralTranscription(audioData) {
        // Simulate Voxstral transcription based on audio data length
        // In a real implementation, this would call the Voxstral API
        const audioLength = audioData.length;
        // Simple simulation: return placeholder text based on audio length
        if (audioLength < 100)
            return '';
        if (audioLength < 500)
            return 'build ';
        if (audioLength < 1000)
            return 'backend ';
        if (audioLength < 2000)
            return 'with Express ';
        return 'and TypeScript ';
    }
    endTranscriptionSession(connectionId) {
        const session = Array.from(this.transcriptionSessions.values()).find(s => s.connectionId === connectionId);
        if (!session) {
            console.warn(`No active session for connection: ${connectionId}`);
            return;
        }
        console.log(`Ending transcription session: ${session.sessionId}`);
        // Emit final transcription event
        this.emit('transcription_complete', {
            sessionId: session.sessionId,
            userId: session.userId,
            transcript: session.transcript.trim(),
            isFinal: true,
            timestamp: Date.now(),
            durationMs: Date.now() - session.startTime
        });
        // Send final result to client
        const ws = this.activeConnections.get(connectionId);
        if (ws) {
            ws.send(JSON.stringify({
                type: 'transcription_complete',
                sessionId: session.sessionId,
                transcript: session.transcript.trim(),
                isFinal: true,
                durationMs: Date.now() - session.startTime,
                timestamp: Date.now()
            }));
        }
        // Clean up the session
        this.transcriptionSessions.delete(session.sessionId);
    }
    cleanupConnection(connectionId) {
        console.log(`Cleaning up connection: ${connectionId}`);
        // Clean up any active sessions for this connection
        const sessionsToClean = Array.from(this.transcriptionSessions.entries())
            .filter(([_, session]) => session.connectionId === connectionId)
            .map(([sessionId]) => sessionId);
        sessionsToClean.forEach(sessionId => {
            this.transcriptionSessions.delete(sessionId);
        });
        this.activeConnections.delete(connectionId);
    }
    /**
     * Get active session count
     */
    getActiveSessionCount() {
        return this.transcriptionSessions.size;
    }
    /**
     * Get active connection count
     */
    getActiveConnectionCount() {
        return this.activeConnections.size;
    }
    /**
     * Broadcast message to all connected clients
     */
    broadcast(message) {
        const payload = JSON.stringify(message);
        this.activeConnections.forEach((ws) => {
            if (ws.readyState === WS.OPEN) {
                ws.send(payload);
            }
        });
    }
}
//# sourceMappingURL=voxstral.js.map
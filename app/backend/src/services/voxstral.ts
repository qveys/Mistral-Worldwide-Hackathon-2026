import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import type { Server as HttpServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';

/**
 * Voxstral WebSocket Service for real-time voice transcription
 * This service handles WebSocket connections for voice input and provides transcription events
 */
export class VoxstralService extends EventEmitter {
  private wss: WebSocketServer;
  private activeConnections: Map<string, WebSocket>;
  private transcriptionSessions: Map<string, {
    connectionId: string;
    userId: string;
    sessionId: string;
    transcript: string;
    startTime: number;
  }>;

  constructor(server: HttpServer) {
    super();
    this.server = server;
    this.activeConnections = new Map();
    this.transcriptionSessions = new Map();
    
    // Initialize WebSocket server
    this.wss = new WebSocketServer({ server });
    
    this.wss.on('connection', (ws: WebSocket) => {
      const connectionId = uuidv4();
      this.activeConnections.set(connectionId, ws);
      
      console.log(`New Voxstral connection: ${connectionId}`);
      
      ws.on('message', (message) => {
        this.handleMessage(connectionId, message.toString());
      });

      ws.on('close', () => {
        this.handleDisconnect(connectionId);
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
  }

  private handleDisconnect(connectionId: string) {
    this.log('info', 'WebSocket disconnected, cleaning up server state', { connectionId });
    this.cleanupConnection(connectionId);
    this.emit('disconnected', { connectionId });
  }

  private handleMessage(connectionId: string, message: string) {
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
          this.log('warn', 'Unknown message type', { type: data.type });
      }
    } catch (error) {
      this.log('error', 'Error processing Voxstral message', { error: String(error) });
    }
  }

  private startTranscriptionSession(connectionId: string, userId: string) {
    const ws = this.activeConnections.get(connectionId);
    if (!ws) return;

    const sessionId = uuidv4();
    this.transcriptionSessions.set(sessionId, {
      connectionId,
      userId,
      sessionId,
      transcript: '',
      startTime: Date.now()
    });

    this.log('info', 'Started transcription session', { sessionId, userId });

    ws.send(JSON.stringify({
      type: 'transcription_started',
      sessionId,
      timestamp: Date.now()
    }));
  }

  private processAudioData(connectionId: string, audioData: string) {
    const session = Array.from(this.transcriptionSessions.values()).find(
      s => s.connectionId === connectionId
    );

    if (!session) {
      this.log('warn', 'No active session for connection', { connectionId });
      return;
    }

    // TODO: Implement actual Voxstral audio processing
    const simulatedTranscript = this.simulateVoxstralTranscription(audioData);

    session.transcript += simulatedTranscript + ' ';

    this.emit('transcription_update', {
      sessionId: session.sessionId,
      userId: session.userId,
      transcript: session.transcript.trim(),
      isFinal: false,
      timestamp: Date.now()
    });

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

  private simulateVoxstralTranscription(audioData: string): string {
    const audioLength = audioData.length;

    if (audioLength < 100) return '';
    if (audioLength < 500) return 'build ';
    if (audioLength < 1000) return 'backend ';
    if (audioLength < 2000) return 'with Express ';
    return 'and TypeScript ';
  }

  private endTranscriptionSession(connectionId: string) {
    const session = Array.from(this.transcriptionSessions.values()).find(
      s => s.connectionId === connectionId
    );

    if (!session) {
      this.log('warn', 'No active session for connection', { connectionId });
      return;
    }

    this.log('info', 'Ending transcription session', { sessionId: session.sessionId });

    this.emit('transcription_complete', {
      sessionId: session.sessionId,
      userId: session.userId,
      transcript: session.transcript.trim(),
      isFinal: true,
      timestamp: Date.now(),
      durationMs: Date.now() - session.startTime
    });

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

    this.transcriptionSessions.delete(session.sessionId);
  }

  private cleanupConnection(connectionId: string) {
    this.log('info', 'Cleaning up connection', { connectionId });

    const sessionsToClean = Array.from(this.transcriptionSessions.entries())
      .filter(([_, session]) => session.connectionId === connectionId)
      .map(([sessionId]) => sessionId);

    sessionsToClean.forEach(sessionId => {
      this.transcriptionSessions.delete(sessionId);
    });

    this.activeConnections.delete(connectionId);
  }

  getActiveSessionCount(): number {
    return this.transcriptionSessions.size;
  }

  getActiveConnectionCount(): number {
    return this.activeConnections.size;
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcast(message: unknown) {
    const payload = JSON.stringify(message);
    this.activeConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(payload);
      }
    });
  }
}

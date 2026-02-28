import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
const WS = require('ws');

const MAX_RECONNECT_ATTEMPTS = 3;
const BASE_RECONNECT_DELAY_MS = 1000;

/**
 * Voxstral WebSocket Service for real-time voice transcription
 * This service handles WebSocket connections for voice input and provides transcription events
 */
export class VoxstralService extends EventEmitter {
  private wss: any;
  private server: any;
  private activeConnections: Map<string, any>;
  private reconnectAttempts: Map<string, number>;
  private reconnectTimers: Map<string, ReturnType<typeof setTimeout>>;
  private transcriptionSessions: Map<string, {
    connectionId: string;
    userId: string;
    sessionId: string;
    transcript: string;
    startTime: number;
  }>;

  constructor(server: any) {
    super();
    this.server = server;
    this.activeConnections = new Map();
    this.reconnectAttempts = new Map();
    this.reconnectTimers = new Map();
    this.transcriptionSessions = new Map();

    this.initWebSocketServer();

    this.log('info', 'Voxstral WebSocket service initialized');
  }

  private log(level: string, message: string, extra: Record<string, unknown> = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: 'voxstral',
      message,
      ...extra,
    };
    if (level === 'error') {
      console.error(JSON.stringify(entry));
    } else {
      console.log(JSON.stringify(entry));
    }
  }

  private initWebSocketServer() {
    this.wss = new WS.Server({ server: this.server });

    this.wss.on('connection', (ws: WebSocket) => {
      const connectionId = uuidv4();
      this.activeConnections.set(connectionId, ws);
      this.reconnectAttempts.set(connectionId, 0);

      this.log('info', 'New Voxstral connection', { connectionId });

      ws.on('message', (message: string) => {
        this.handleMessage(connectionId, message);
      });

      ws.on('close', () => {
        this.handleDisconnect(connectionId);
      });

      ws.on('error', (error: any) => {
        this.log('error', 'Voxstral connection error', { connectionId, error: String(error) });
        this.handleDisconnect(connectionId);
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
    const attempt = (this.reconnectAttempts.get(connectionId) ?? 0) + 1;
    this.reconnectAttempts.set(connectionId, attempt);

    if (attempt > MAX_RECONNECT_ATTEMPTS) {
      this.log('error', 'Reconnection failed after max attempts', { connectionId, attempts: MAX_RECONNECT_ATTEMPTS });
      this.emit('reconnection_failed', { connectionId });
      this.cleanupConnection(connectionId);
      return;
    }

    const delayMs = BASE_RECONNECT_DELAY_MS * Math.pow(2, attempt - 1); // 1s → 2s → 4s
    this.log('info', 'Attempting WebSocket reconnection', { connectionId, attempt, delayMs });
    this.emit('reconnecting', { connectionId, attempt });

    const timer = setTimeout(() => {
      this.reconnectTimers.delete(connectionId);
      try {
        const addr = this.server.address();
        if (!addr) {
          throw new Error('Server address unavailable');
        }
        const host = typeof addr === 'string' ? addr : `ws://localhost:${addr.port}`;
        const newWs = new WS(host);

        newWs.on('open', () => {
          this.log('info', 'WebSocket reconnected successfully', { connectionId, attempt });
          this.activeConnections.set(connectionId, newWs);
          this.reconnectAttempts.set(connectionId, 0);

          newWs.on('message', (message: string) => {
            this.handleMessage(connectionId, message);
          });

          newWs.on('close', () => {
            this.handleDisconnect(connectionId);
          });

          newWs.on('error', (error: any) => {
            this.log('error', 'Voxstral reconnected socket error', { connectionId, error: String(error) });
            this.handleDisconnect(connectionId);
          });
        });

        newWs.on('error', () => {
          this.log('error', 'Reconnection attempt failed', { connectionId, attempt });
          this.handleDisconnect(connectionId);
        });
      } catch (err) {
        this.log('error', 'Reconnection attempt threw', { connectionId, attempt, error: String(err) });
        this.handleDisconnect(connectionId);
      }
    }, delayMs);

    this.reconnectTimers.set(connectionId, timer);
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

    const timer = this.reconnectTimers.get(connectionId);
    if (timer) {
      clearTimeout(timer);
      this.reconnectTimers.delete(connectionId);
    }

    const sessionsToClean = Array.from(this.transcriptionSessions.entries())
      .filter(([_, session]) => session.connectionId === connectionId)
      .map(([sessionId]) => sessionId);

    sessionsToClean.forEach(sessionId => {
      this.transcriptionSessions.delete(sessionId);
    });

    this.activeConnections.delete(connectionId);
    this.reconnectAttempts.delete(connectionId);
  }

  getActiveSessionCount(): number {
    return this.transcriptionSessions.size;
  }

  getActiveConnectionCount(): number {
    return this.activeConnections.size;
  }

  broadcast(message: any) {
    const payload = JSON.stringify(message);
    this.activeConnections.forEach((ws: any) => {
      if (ws.readyState === WS.OPEN) {
        ws.send(payload);
      }
    });
  }
}

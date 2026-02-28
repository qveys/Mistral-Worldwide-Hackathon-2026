import type { Express } from 'express';
import type { WebSocketServer } from 'ws';
import { setupTranscribeRoute } from './transcribe.route.js';

export function registerRoutes(app: Express, wss: WebSocketServer): void {
    // WebSocket routes
    setupTranscribeRoute(wss);

    //  REST routes
}

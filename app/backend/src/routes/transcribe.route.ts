import type { WebSocketServer } from 'ws';
import { TranscribeController } from '../controllers/transcribe.controller.js';
import { logger } from '../lib/logger.js';

export function setupTranscribeRoute(wss: WebSocketServer): void {
    const controller = new TranscribeController();

    wss.on('connection', (ws, req) => {
        logger.info('TranscribeRoute', 'New WS connection', {
            url: req.url,
            remoteAddress: req.socket.remoteAddress,
        });

        controller.handleConnection(ws);
    });
}

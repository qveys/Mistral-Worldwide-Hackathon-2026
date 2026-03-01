import { TranscribeController } from '../controllers/transcribe.controller.js';
import { logger } from '../lib/logger.js';
export function setupTranscribeRoute(wss) {
    const controller = new TranscribeController();
    wss.on('connection', (ws, req) => {
        logger.info('TranscribeRoute', 'New WS connection', {
            url: req.url,
            remoteAddress: req.socket.remoteAddress,
        });
        controller.handleConnection(ws);
    });
}
//# sourceMappingURL=transcribe.route.js.map
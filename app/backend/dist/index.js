import cors from 'cors';
import dotenv from 'dotenv';
import express, {} from 'express';
import http from 'node:http';
import { WebSocketServer } from 'ws';
import { logger } from './lib/logger.js';
import { registerRoutes } from './routes/index.js';
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const corsOrigin = process.env['CORS_ORIGIN'] || 'http://localhost:3000';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());
app.get('/health', (_req, res) => {
    res.json({ status: 'OK' });
});
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/transcribe' });
registerRoutes(app, wss);
server.listen(port, () => {
    logger.info('Server', `Running at http://localhost:${port}`, { port, corsOrigin });
    logger.info('Server', `WebSocket available at ws://localhost:${port}/ws/transcribe`);
});
//# sourceMappingURL=index.js.map
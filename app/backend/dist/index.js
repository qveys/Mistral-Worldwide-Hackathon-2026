import cors from 'cors';
import dotenv from 'dotenv';
import express, {} from 'express';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { createRequire } from 'module';
import healthRouter from './routes/health.js';
import structureRouter from './routes/structure.js';
import reviseRouter from './routes/revise.js';
import { VoxstralService } from './services/voxstral.js';
dotenv.config();
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
const startTime = Date.now();
const app = express();
const port = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());
// Rate limiting: 10 requests per minute per IP on /api/structure and /api/revise
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: true,
    handler: (_req, res) => {
        res.status(429).json({
            error: 'TooManyRequests',
            message: 'Too many requests from this IP, please retry later.',
        });
    },
});
app.use('/api/structure', apiLimiter);
app.use('/api/revise', apiLimiter);
// Health check route
app.use('/health', healthRouter({ version, startTime }));
// API routes
app.use('/api/structure', structureRouter);
app.use('/api/revise', reviseRouter);
// Create HTTP server and integrate Voxstral WebSocket service
const server = createServer(app);
const voxstralService = new VoxstralService(server);
// Handle Voxstral transcription events
voxstralService.on('transcription_update', (data) => {
    console.log(`Transcription update: ${data.transcript.substring(0, 50)}...`);
});
voxstralService.on('transcription_complete', (data) => {
    console.log(`Transcription complete (${data.durationMs}ms): ${data.transcript.substring(0, 100)}...`);
    // Here you could automatically call the /structure endpoint with the transcript
});
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`WebSocket server running at ws://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(`- GET /health`);
    console.log(`- POST /api/structure`);
    console.log(`- POST /api/revise`);
    console.log(`- WS / (Voxstral WebSocket)`);
});
//# sourceMappingURL=index.js.map
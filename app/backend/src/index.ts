import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import rateLimit from 'express-rate-limit';
import healthRouter from './routes/health.js';
import structureRouter from './routes/structure.js';
import reviseRouter from './routes/revise.js';
import { VoxstralService } from './services/voxstral.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rate limiter: max 10 requests per minute per IP for API routes
const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too Many Requests', message: 'Rate limit exceeded. Max 10 requests per minute.' }
});

// Health check endpoint
app.use('/health', healthRouter);

// API routes (rate limited)
app.use('/api/structure', apiLimiter, structureRouter);
app.use('/api/revise', apiLimiter, reviseRouter);

// Create HTTP server and integrate Voxstral WebSocket service
const server = createServer(app);
const voxstralService = new VoxstralService(server);

// Handle Voxstral transcription events
voxstralService.on('transcription_update', (data: any) => {
  console.log(`Transcription update: ${data.transcript.substring(0, 50)}...`);
});

voxstralService.on('transcription_complete', (data: any) => {
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

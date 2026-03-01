import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import { createServer } from 'http';
import structureRouter from './routes/structure.js';
import reviseRouter from './routes/revise.js';
import projectRouter from './routes/project.js';
import templatesRouter from './routes/templates.js';
import clarifyRouter from './routes/clarify.js';
import { VoxstralService } from './services/voxstral.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString(), demoMode: process.env.DEMO_MODE === 'true' });
});

// API routes
app.use('/api/structure', structureRouter);
app.use('/api/revise', reviseRouter);
app.use('/api', projectRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/clarify', clarifyRouter);

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
  console.log('Available endpoints:');
  console.log('- GET /health');
  console.log('- POST /api/structure');
  console.log('- POST /api/revise');
  console.log('- GET /api/project/:id');
  console.log('- GET  /api/templates');
  console.log('- GET  /api/templates/:slug');
  console.log('- POST /api/clarify');
  console.log('- WS / (Voxstral WebSocket)');
});

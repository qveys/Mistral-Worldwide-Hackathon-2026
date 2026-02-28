import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';
import structureRouter from './routes/structure';
import reviseRouter from './routes/revise';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/structure', structureRouter);
app.use('/api/revise', reviseRouter);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Available endpoints:`);
    console.log(`- GET /health`);
    console.log(`- POST /api/structure`);
    console.log(`- POST /api/revise`);
});

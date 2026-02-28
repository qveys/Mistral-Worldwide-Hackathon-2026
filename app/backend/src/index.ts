import cors from 'cors';
import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'OK' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

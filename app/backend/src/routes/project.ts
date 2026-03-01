import { Router } from 'express';
import { z } from 'zod';
import { getProject } from '../services/storage.js';

const router = Router();
const projectIdSchema = z.string().regex(/^[A-Za-z0-9_-]+$/);

router.get('/:id', async (req, res) => {
  const parsedId = projectIdSchema.safeParse(req.params.id);
  if (!parsedId.success) {
    res.status(400).json({ error: 'Invalid project id' });
    return;
  }

  try {
    const roadmap = await getProject(parsedId.data);
    if (!roadmap) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ roadmap });
  } catch (error) {
    console.error('Project endpoint error:', error);
    const responseBody: { error: string; message?: string } = {
      error: 'Internal server error',
    };
    if (error instanceof Error) {
      responseBody.message = error.message;
    }
    res.status(500).json(responseBody);
  }
});

export default router;

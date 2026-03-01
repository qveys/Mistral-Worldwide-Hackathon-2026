import { Router } from 'express';
import { z } from 'zod';
import { getProject } from '../services/storage.js';

const router = Router();

const ProjectSchema = z.object({
  userId: z.string().uuid(),
  roadmap: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.number().min(1).max(5),
    dependencies: z.array(z.string()).optional()
  }))
});

router.get('/project/:id', async (req, res) => {
  try {
    const idValidation = z.string().uuid().safeParse(req.params.id);
    if (!idValidation.success) {
      res.status(400).json({ error: 'Invalid project id format' });
      return;
    }

    const requesterUserId = z.string().uuid().safeParse(req.header('x-user-id'));
    if (!requesterUserId.success) {
      res.status(401).json({ error: 'Missing or invalid x-user-id header' });
      return;
    }

    const project = await getProject(idValidation.data);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const parsedProject = ProjectSchema.safeParse(project);
    if (!parsedProject.success) {
      res.status(500).json({ error: 'Invalid stored project format' });
      return;
    }

    if (parsedProject.data.userId !== requesterUserId.data) {
      res.status(403).json({ error: 'Forbidden: project does not belong to user' });
      return;
    }

    res.json(parsedProject.data);
  } catch (error) {
    console.error('Project endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

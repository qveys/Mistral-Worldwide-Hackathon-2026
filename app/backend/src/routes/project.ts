import { Router } from 'express';
import { z } from 'zod';
import { getProject } from '../services/storage.js';
import { assertValidProjectId } from '../lib/projectId.js';
import { HttpError } from '../lib/httpError.js';
import { logRouteError } from '../lib/logger.js';

const router = Router();

const StoredProjectSchema = z.object({
  userId: z.string().uuid(),
  roadmap: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    priority: z.number().min(1).max(5),
    dependsOn: z.array(z.string()).default([]),
  })),
});

router.get('/project/:id', async (req, res) => {
  try {
    const projectId = assertValidProjectId(req.params.id);
    const requesterUserId = z.string().uuid().safeParse(req.header('x-user-id'));
    if (!requesterUserId.success) {
      res.status(401).json({ error: 'Missing or invalid x-user-id header' });
      return;
    }

    const project = await getProject(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const parsed = StoredProjectSchema.safeParse(project);
    if (!parsed.success) {
      res.status(500).json({ error: 'Invalid stored project format' });
      return;
    }

    if (parsed.data.userId !== requesterUserId.data) {
      res.status(403).json({ error: 'Forbidden: project does not belong to user' });
      return;
    }

    res.json(parsed.data);
  } catch (error) {
    logRouteError('GET /api/project/:id', error);
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

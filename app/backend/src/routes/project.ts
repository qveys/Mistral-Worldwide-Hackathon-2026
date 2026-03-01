import { Router } from 'express';
import { getProject } from '../services/storage.js';
import { assertValidProjectId } from '../lib/projectId.js';
import { HttpError } from '../lib/httpError.js';
import { logRouteError } from '../lib/logger.js';

const router = Router();

router.get('/project/:id', async (req, res) => {
  try {
    const projectId = assertValidProjectId(req.params.id);
    const project = await getProject(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
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

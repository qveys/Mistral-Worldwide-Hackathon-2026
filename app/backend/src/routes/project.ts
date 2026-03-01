import { Router } from 'express';
import { getProject } from '../services/storage.js';
import { isValidProjectId } from '../lib/projectId.js';

const router = Router();

router.get('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!isValidProjectId(projectId)) {
      res.status(400).json({ error: 'Invalid project id' });
      return;
    }

    const project = await getProject(projectId);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (error) {
    console.error('Project endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

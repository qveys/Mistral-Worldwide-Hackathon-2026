import { Router } from 'express';
import { getProject } from '../services/storage.js';

const router = Router();

router.get('/project/:id', async (req, res) => {
  try {
    const roadmap = await getProject(req.params.id);
    if (!roadmap) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ roadmap });
  } catch (error) {
    console.error('Project endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

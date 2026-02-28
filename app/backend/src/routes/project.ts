import { Router } from 'express';
import { mockRoadmap } from '../lib/mockData.js';

const router = Router();

// GET /api/project/:id - Read-only project view (no auth required)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  // In a real implementation, this would fetch from a database
  // For now, return mock data for any valid-looking ID
  if (!id || id.length < 1) {
    res.status(400).json({ error: "Invalid project ID" });
    return;
  }

  // Return mock data (in production, query database)
  res.json({
    id,
    ...mockRoadmap,
    sharedAt: new Date().toISOString(),
    readOnly: true
  });
});

export default router;

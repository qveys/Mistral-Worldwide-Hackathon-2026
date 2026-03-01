import { Router } from 'express';
import { mockRoadmap } from '../lib/mockData.js';

const router = Router();
const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// GET /api/project/:id - Read-only project view (no auth required)
router.get('/:id', (req, res) => {
  const { id } = req.params;

  if (!UUID_V4_PATTERN.test(id)) {
    res.status(400).json({ error: "Invalid project ID" });
    return;
  }

  // Stub implementation until persistent project storage is wired.
  res.json({
    id,
    ...mockRoadmap,
    sharedAt: new Date().toISOString(),
    readOnly: true,
    isStub: true
  });
});

export default router;

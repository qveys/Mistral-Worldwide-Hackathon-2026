import { Router } from 'express';
import { z } from 'zod';
import { StorageService } from '../services/storage.js';

const router = Router();
const storageService = new StorageService();

// GET /api/project/:id — return a project by ID or 404
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    const idValidation = z.string().uuid().safeParse(id);
    if (!idValidation.success) {
      res.status(400).json({ error: "Invalid project ID format — must be a UUID" });
      return;
    }

    const project = await storageService.getProject(id);

    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error('Project GET endpoint error:', error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// GET /api/project — list projects for a user (optional userId query param)
router.get('/', async (req, res) => {
  try {
    const userIdQuery = req.query.userId;
    const userIdValidation = z.string().uuid().safeParse(userIdQuery);

    if (!userIdValidation.success) {
      res.status(400).json({ error: "Missing or invalid userId query parameter — must be a UUID" });
      return;
    }

    const projects = await storageService.listProjects(userIdValidation.data);
    res.json({ projects });
  } catch (error) {
    console.error('Project list endpoint error:', error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;

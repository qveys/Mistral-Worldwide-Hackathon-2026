import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/project/:id', requireAuth, projectController);

export { router as projectRouter };

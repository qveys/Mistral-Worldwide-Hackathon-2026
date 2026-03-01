import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';

const router = Router();

router.get('/project/:id', projectController);

export { router as projectRouter };

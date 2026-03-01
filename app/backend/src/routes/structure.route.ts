import { Router } from 'express';
import { structureController } from '../controllers/structure.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/structure', requireAuth, structureController);

export { router as structureRouter };

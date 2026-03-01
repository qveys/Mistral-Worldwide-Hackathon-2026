import { Router } from 'express';
import { structureController } from '../controllers/structure.controller.js';
const router = Router();
router.post('/structure', structureController);
export { router as structureRouter };
//# sourceMappingURL=structure.route.js.map
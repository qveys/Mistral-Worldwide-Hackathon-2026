import { Router } from 'express';
import { getProject } from '../services/storage.js';
import { logRouteError } from '../lib/logger.js';
const router = Router();
router.get('/project/:id', async (req, res) => {
    try {
        const project = await getProject(req.params.id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(project);
    }
    catch (error) {
        logRouteError('GET /api/project/:id', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=project.js.map
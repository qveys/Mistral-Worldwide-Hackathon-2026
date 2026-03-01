import { mockRoadmap, mockRevision, mockClarify } from '../lib/mockData.js';
const DEMO_MODE = process.env.DEMO_MODE === 'true';
export function demoModeMiddleware(req, res, next) {
    if (!DEMO_MODE) {
        next();
        return;
    }
    const path = req.path;
    const method = req.method;
    if (method === 'POST' && path === '/api/structure') {
        setTimeout(() => {
            res.json(mockRoadmap);
        }, 800);
        return;
    }
    if (method === 'POST' && path === '/api/revise') {
        setTimeout(() => {
            res.json(mockRevision);
        }, 600);
        return;
    }
    if (method === 'POST' && path === '/api/clarify') {
        setTimeout(() => {
            res.json(mockClarify);
        }, 400);
        return;
    }
    next();
}
export { DEMO_MODE };
//# sourceMappingURL=demoMode.js.map
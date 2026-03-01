import { Router } from 'express';
export default function createHealthRouter({ version, startTime }) {
    const router = Router();
    router.get('/', (_req, res) => {
        res.json({
            status: 'ok',
            version,
            uptime: Math.floor((Date.now() - startTime) / 1000),
            timestamp: new Date().toISOString(),
        });
    });
    return router;
}
//# sourceMappingURL=health.js.map
import { Router } from 'express';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');
const router = Router();
router.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        version,
        uptime: process.uptime()
    });
});
export default router;
//# sourceMappingURL=health.js.map
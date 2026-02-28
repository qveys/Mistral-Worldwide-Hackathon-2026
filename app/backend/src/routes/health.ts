import { Router, type Request, type Response } from 'express';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { version } = require('../../package.json') as { version: string };

const router = Router();

router.get('/', (_req: Request, res: Response) => {
    res.json({
        status: 'ok',
        version,
        uptime: process.uptime()
    });
});

export default router;

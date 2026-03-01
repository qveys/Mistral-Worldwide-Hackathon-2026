import { Router } from 'express';

type HealthRouterOptions = {
  version: string;
  startTime: number;
};

export default function createHealthRouter({ version, startTime }: HealthRouterOptions) {
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

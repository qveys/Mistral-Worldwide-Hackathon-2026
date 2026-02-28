import type { Request, Response, NextFunction } from 'express';
import { mockRoadmap, mockRevision, mockClarify } from '../lib/mockData.js';

const DEMO_MODE = process.env.DEMO_MODE === 'true';

export function demoModeMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (!DEMO_MODE) {
    next();
    return;
  }

  const path = req.path;
  const method = req.method;

  // Mock structure endpoint
  if (method === 'POST' && path.includes('/structure')) {
    // Simulate processing delay
    setTimeout(() => {
      res.json(mockRoadmap);
    }, 800);
    return;
  }

  // Mock revise endpoint
  if (method === 'POST' && path.includes('/revise')) {
    setTimeout(() => {
      res.json(mockRevision);
    }, 600);
    return;
  }

  // Mock clarify endpoint
  if (method === 'POST' && path.includes('/clarify')) {
    setTimeout(() => {
      res.json(mockClarify);
    }, 400);
    return;
  }

  next();
}

export { DEMO_MODE };

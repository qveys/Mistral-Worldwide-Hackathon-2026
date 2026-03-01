import type { Request, Response, NextFunction } from 'express';
/**
 * Middleware that verifies the Authorization: Bearer <token> JWT and sets req.userId (and req.user).
 * Responds with 401 if missing or invalid.
 */
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map
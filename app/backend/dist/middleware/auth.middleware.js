import jwt from 'jsonwebtoken';
import { logger } from '../lib/logger.js';
const JWT_SECRET = process.env['JWT_SECRET'] || 'dev-secret-change-in-production';
/**
 * Middleware that verifies the Authorization: Bearer <token> JWT and sets req.userId (and req.user).
 * Responds with 401 if missing or invalid.
 */
export function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : null;
    if (!token) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.user = { id: decoded.userId, email: decoded.email };
        next();
    }
    catch {
        logger.warn('AuthMiddleware', 'Invalid or expired token');
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=auth.middleware.js.map
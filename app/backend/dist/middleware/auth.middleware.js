import jwt from 'jsonwebtoken';
import { getRequiredEnv } from '../lib/env.js';
import { logger } from '../lib/logger.js';
const JWT_SECRET = getRequiredEnv('JWT_SECRET', 'AuthMiddleware');
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function isJwtPayload(payload) {
    if (typeof payload !== 'object' || payload === null) {
        return false;
    }
    const claims = payload;
    return (typeof claims['userId'] === 'string' &&
        UUID_REGEX.test(claims['userId']) &&
        typeof claims['email'] === 'string' &&
        claims['email'].trim().length > 0);
}
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
        if (!isJwtPayload(decoded)) {
            logger.warn('AuthMiddleware', 'JWT payload is missing required claims');
            res.status(401).json({ error: 'Invalid token payload' });
            return;
        }
        req.userId = decoded.userId;
        req.user = { id: decoded.userId, email: decoded.email };
        next();
    }
    catch (error) {
        logger.warn('AuthMiddleware', 'Invalid or expired token', {
            error: error instanceof Error ? error.message : String(error),
        });
        res.status(401).json({ error: 'Invalid or expired token' });
    }
}
//# sourceMappingURL=auth.middleware.js.map
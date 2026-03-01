import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../lib/logger.js';
const LOCAL_DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(LOCAL_DATA_DIR, 'users.json');
const USERS_CACHE_TTL_MS = 30_000;
let cachedEmails = null;
let cacheLoadedAt = 0;
function readUsersFromDisk() {
    if (!fs.existsSync(USERS_FILE)) {
        logger.warn('AuthController', 'users.json not found', { path: USERS_FILE });
        return null;
    }
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
        throw new Error('users.json has invalid format');
    }
    return parsed
        .filter((entry) => typeof entry === 'string')
        .map((entry) => entry.toLowerCase());
}
function getCachedUsers() {
    const now = Date.now();
    if (cachedEmails && now - cacheLoadedAt < USERS_CACHE_TTL_MS) {
        return cachedEmails;
    }
    const users = readUsersFromDisk();
    if (!users) {
        cachedEmails = null;
        cacheLoadedAt = now;
        return null;
    }
    cachedEmails = users;
    cacheLoadedAt = now;
    return users;
}
/**
 * POST /auth/login
 * Validates that the given email exists in data/users.json (case-insensitive).
 */
export async function loginController(req, res) {
    const email = req.body.email;
    if (typeof email !== 'string' || !email.trim()) {
        res.status(400).json({ success: false, error: 'email required' });
        return;
    }
    const normalized = email.trim().toLowerCase();
    try {
        const emails = getCachedUsers();
        if (!emails) {
            res.status(500).json({ success: false, error: 'users configuration not found' });
            return;
        }
        const found = emails.some((e) => e === normalized);
        if (found) {
            res.status(200).json({ success: true });
        }
        else {
            res.status(401).json({ success: false });
        }
    }
    catch (error) {
        logger.error('AuthController', 'Failed to read users.json', {
            error: error instanceof Error ? error.message : String(error),
            path: USERS_FILE,
        });
        res.status(500).json({ success: false, error: 'users configuration invalid' });
    }
}
//# sourceMappingURL=auth.controller.js.map
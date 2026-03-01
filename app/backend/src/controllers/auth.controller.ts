import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { getRequiredEnv } from '../lib/env.js';
import { logger } from '../lib/logger.js';

const LOCAL_DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(LOCAL_DATA_DIR, 'users.json');
const USERS_CACHE_TTL_MS = 30_000;
const JWT_SECRET = getRequiredEnv('JWT_SECRET', 'AuthController');
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';

export interface User {
    id: string;
    email: string;
}

let cachedUsers: User[] | null = null;
let cacheLoadedAt = 0;

function isUserEntry(entry: unknown): entry is User {
    return (
        typeof entry === 'object' &&
        entry !== null &&
        'id' in entry &&
        'email' in entry &&
        typeof (entry as User).id === 'string' &&
        typeof (entry as User).email === 'string'
    );
}

function readUsersFromDisk(): User[] | null {
    if (!fs.existsSync(USERS_FILE)) {
        logger.warn('AuthController', 'users.json not found', { path: USERS_FILE });
        return null;
    }

    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
        throw new Error('users.json has invalid format');
    }

    const users: User[] = [];
    let needsMigration = false;

    for (const entry of parsed) {
        if (isUserEntry(entry)) {
            users.push({
                id: entry.id,
                email: entry.email.toLowerCase(),
            });
        } else if (typeof entry === 'string') {
            needsMigration = true;
            users.push({
                id: crypto.randomUUID(),
                email: entry.trim().toLowerCase(),
            });
        }
    }

    if (needsMigration && users.length > 0) {
        try {
            if (!fs.existsSync(LOCAL_DATA_DIR)) {
                fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
            }
            fs.writeFileSync(
                USERS_FILE,
                JSON.stringify(users.map((u) => ({ id: u.id, email: u.email })), null, 2),
                'utf-8'
            );
            logger.info('AuthController', 'Migrated users.json to id/email format');
        } catch (err) {
            logger.error('AuthController', 'Failed to write migrated users.json', {
                error: err instanceof Error ? err.message : String(err),
            });
        }
    }

    return users.length > 0 ? users : null;
}

function getCachedUsers(): User[] | null {
    const now = Date.now();
    if (cachedUsers && now - cacheLoadedAt < USERS_CACHE_TTL_MS) {
        return cachedUsers;
    }

    const users = readUsersFromDisk();
    cachedUsers = users;
    cacheLoadedAt = now;
    return users;
}

/**
 * POST /auth/login
 * Validates that the given email exists in data/users.json (case-insensitive).
 * On success returns userId and a JWT for use on protected routes.
 */
export async function loginController(req: Request, res: Response): Promise<void> {
    const email = (req.body as { email?: string }).email;
    if (typeof email !== 'string' || !email.trim()) {
        res.status(400).json({ success: false, error: 'email required' });
        return;
    }

    const normalized = email.trim().toLowerCase();
    try {
        const users = getCachedUsers();
        if (!users) {
            res.status(500).json({ success: false, error: 'users configuration not found' });
            return;
        }

        const user = users.find((u) => u.email === normalized);
        if (user) {
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET as jwt.Secret,
                { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
            );
            res.status(200).json({
                success: true,
                userId: user.id,
                token,
            });
        } else {
            res.status(401).json({ success: false });
        }
    } catch (error) {
        logger.error('AuthController', 'Failed to read users.json', {
            error: error instanceof Error ? error.message : String(error),
            path: USERS_FILE,
        });
        res.status(500).json({ success: false, error: 'users configuration invalid' });
    }
}

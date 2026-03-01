import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from '../lib/logger.js';

const LOCAL_DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(LOCAL_DATA_DIR, 'users.json');

/**
 * POST /auth/login
 * Validates that the given email exists in data/users.json (case-insensitive).
 */
export async function loginController(req: Request, res: Response): Promise<void> {
    const email = (req.body as { email?: string }).email;
    if (typeof email !== 'string' || !email.trim()) {
        res.status(400).json({ success: false, error: 'email required' });
        return;
    }

    const normalized = email.trim().toLowerCase();
    let emails: string[];

    try {
        if (!fs.existsSync(USERS_FILE)) {
            logger.warn('AuthController', 'users.json not found', { path: USERS_FILE });
            res.status(401).json({ success: false });
            return;
        }
        const raw = fs.readFileSync(USERS_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            res.status(500).json({ success: false });
            return;
        }
        emails = parsed.map((e: unknown) => (typeof e === 'string' ? e.toLowerCase() : ''));
    } catch (err) {
        logger.error('AuthController', 'Failed to read users.json', {
            error: err instanceof Error ? err.message : String(err),
        });
        res.status(500).json({ success: false });
        return;
    }

    const found = emails.some((e) => e === normalized);
    if (found) {
        res.status(200).json({ success: true });
    } else {
        res.status(401).json({ success: false });
    }
}

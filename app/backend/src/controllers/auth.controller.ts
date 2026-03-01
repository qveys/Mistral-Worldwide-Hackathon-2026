import type { Request, Response } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { logger } from '../lib/logger.js';

const LOCAL_DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(LOCAL_DATA_DIR, 'users.json');
const USERS_CACHE_TTL_MS = 30_000;
const JWT_SECRET = getRequiredEnv('JWT_SECRET', 'AuthController');
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '7d';

export interface UserEntry {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
}

let cachedEmails: string[] | null = null;
let cacheLoadedAt = 0;

function normalizeEntry(entry: unknown): string | null {
    if (typeof entry === 'string' && entry.trim()) return entry.trim().toLowerCase();
    if (entry && typeof entry === 'object' && 'email' in entry && typeof (entry as UserEntry).email === 'string') {
        return (entry as UserEntry).email.trim().toLowerCase();
    }
    return null;
}

function readRawUsers(): UserEntry[] {
    if (!fs.existsSync(USERS_FILE)) {
        logger.warn('AuthController', 'users.json not found', { path: USERS_FILE });
        return [];
    }

    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed: unknown = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
        throw new Error('users.json has invalid format');
    }

    return parsed
        .filter((entry: unknown) => normalizeEntry(entry) != null)
        .map((entry: unknown): UserEntry => {
            const email = normalizeEntry(entry)!;
            const existingId =
                entry && typeof entry === 'object' && 'id' in entry && typeof (entry as Record<string, unknown>).id === 'string'
                    ? (entry as Record<string, unknown>).id as string
                    : crypto.randomUUID();
            if (entry && typeof entry === 'object' && 'email' in entry) {
                const o = entry as Record<string, unknown>;
                return {
                    id: existingId,
                    email,
                    firstName: typeof o.firstName === 'string' ? o.firstName : '',
                    lastName: typeof o.lastName === 'string' ? o.lastName : '',
                    password: typeof o.password === 'string' ? o.password : '',
                };
            }
            return { id: existingId, email, firstName: '', lastName: '', password: '' };
        });
}

function readUsersFromDisk(): string[] | null {
    try {
        const entries = readRawUsers();
        return entries.length > 0 ? entries.map((e) => e.email) : null;
    } catch {
        return null;
    }
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

function invalidateCache(): void {
    cachedEmails = null;
    cacheLoadedAt = 0;
}

function writeUsers(entries: UserEntry[]): void {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(entries, null, 2), 'utf-8');
    invalidateCache();
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

/**
 * POST /auth/register
 * Appends a new user (nom, prénom, email, password) to data/users.json.
 */
export async function registerController(req: Request, res: Response): Promise<void> {
    const body = req.body as { email?: string; firstName?: string; lastName?: string; password?: string };
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
    const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email) {
        res.status(400).json({ success: false, error: 'email required' });
        return;
    }

    const normalized = email.toLowerCase();
    try {
        const entries = readRawUsers();
        if (entries.some((e) => e.email.toLowerCase() === normalized)) {
            res.status(409).json({ success: false, error: 'email already registered' });
            return;
        }
        entries.push({ id: crypto.randomUUID(), email: normalized, firstName, lastName, password });
        writeUsers(entries);
        res.status(201).json({ success: true });
    } catch (error) {
        logger.error('AuthController', 'Failed to register user', {
            error: error instanceof Error ? error.message : String(error),
            path: USERS_FILE,
        });
        res.status(500).json({ success: false, error: 'registration failed' });
    }
}

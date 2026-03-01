import type { Request, Response } from 'express';
export interface User {
    id: string;
    email: string;
}
/**
 * POST /auth/login
 * Validates that the given email exists in data/users.json (case-insensitive).
 * On success returns userId and a JWT for use on protected routes.
 */
export declare function loginController(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map
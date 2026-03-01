import { Router } from 'express';
import { z } from 'zod';
import { loginController, registerController } from '../controllers/auth.controller.js';

const router = Router();
const LoginBodySchema = z.object({ email: z.string().min(1) });
const RegisterBodySchema = z.object({
    email: z.string().min(1),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    password: z.string().optional(),
});

router.post('/auth/login', (req, res, next) => {
    const parsed = LoginBodySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ success: false, error: 'email required' });
        return;
    }
    req.body = parsed.data;
    void loginController(req, res).catch(next);
});

router.post('/auth/register', (req, res, next) => {
    const parsed = RegisterBodySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ success: false, error: 'invalid body' });
        return;
    }
    req.body = parsed.data;
    void registerController(req, res).catch(next);
});

export { router as authRouter };

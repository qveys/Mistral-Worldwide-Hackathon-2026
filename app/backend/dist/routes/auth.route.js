import { Router } from 'express';
import { z } from 'zod';
import { loginController } from '../controllers/auth.controller.js';
const router = Router();
const LoginBodySchema = z.object({ email: z.string().min(1) });
router.post('/auth/login', (req, res, next) => {
    const parsed = LoginBodySchema.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ success: false, error: 'email required' });
        return;
    }
    req.body = parsed.data;
    void loginController(req, res).catch(next);
});
export { router as authRouter };
//# sourceMappingURL=auth.route.js.map
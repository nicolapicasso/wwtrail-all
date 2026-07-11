import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema';

const router = Router();

// Rutas públicas con rate limiting
router.post('/register', authRateLimiter, validate(registerSchema), AuthController.register);
router.post('/login', authRateLimiter, validate(loginSchema), AuthController.login);
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);
router.post('/logout', AuthController.logout);

// Rutas protegidas (requieren autenticación)
router.get('/me', authenticate, AuthController.me);
router.get('/profile', authenticate, AuthController.getProfile); // Alias de /me
router.post('/logout-all', authenticate, AuthController.logoutAll);

export default router;

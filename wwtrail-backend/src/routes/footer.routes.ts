// src/routes/footer.routes.ts
import { Router } from 'express';
import FooterController from '../controllers/footer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

/**
 * Public routes
 */
router.get('/public', FooterController.getPublicFooter);

/**
 * Admin routes
 */
router.get('/', authenticate, requireRole([UserRole.ADMIN]), FooterController.getFooter);
router.put('/', authenticate, requireRole([UserRole.ADMIN]), FooterController.updateFooter);

export default router;

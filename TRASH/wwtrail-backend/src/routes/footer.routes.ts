// src/routes/footer.routes.ts
import { Router } from 'express';
import FooterController from '../controllers/footer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

/**
 * Public routes
 */
router.get('/public', FooterController.getPublicFooter);

/**
 * Admin routes
 */
router.get('/', authenticate, authorize('ADMIN'), FooterController.getFooter);
router.put('/', authenticate, authorize('ADMIN'), FooterController.updateFooter);

export default router;

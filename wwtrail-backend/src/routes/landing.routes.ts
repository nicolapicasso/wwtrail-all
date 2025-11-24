// src/routes/landing.routes.ts
import { Router } from 'express';
import LandingController from '../controllers/landing.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { UserRole } from '@prisma/client';
import { validate } from '../middleware/validate.middleware';
import {
  createLandingSchema,
  updateLandingSchema,
  getLandingsSchema,
  translateLandingSchema,
} from '../schemas/landing.schema';

const router = Router();

/**
 * Public routes
 */
router.get('/slug/:slug', LandingController.getLandingBySlug);

/**
 * Admin-only routes
 */
router.get(
  '/',
  authenticate,
  requireRole([UserRole.ADMIN]),
  validate(getLandingsSchema),
  LandingController.getAllLandings
);

router.get(
  '/:id',
  authenticate,
  requireRole([UserRole.ADMIN]),
  LandingController.getLandingById
);

router.post(
  '/',
  authenticate,
  requireRole([UserRole.ADMIN]),
  validate(createLandingSchema),
  LandingController.createLanding
);

router.put(
  '/:id',
  authenticate,
  requireRole([UserRole.ADMIN]),
  validate(updateLandingSchema),
  LandingController.updateLanding
);

router.delete(
  '/:id',
  authenticate,
  requireRole([UserRole.ADMIN]),
  LandingController.deleteLanding
);

router.post(
  '/:id/translate',
  authenticate,
  requireRole([UserRole.ADMIN]),
  validate(translateLandingSchema),
  LandingController.translateLanding
);

export default router;

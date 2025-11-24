// src/routes/landing.routes.ts
import { Router } from 'express';
import LandingController from '../controllers/landing.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
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
  authorize('ADMIN'),
  validate(getLandingsSchema),
  LandingController.getAllLandings
);

router.get(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  LandingController.getLandingById
);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(createLandingSchema),
  LandingController.createLanding
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateLandingSchema),
  LandingController.updateLanding
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  LandingController.deleteLanding
);

router.post(
  '/:id/translate',
  authenticate,
  authorize('ADMIN'),
  validate(translateLandingSchema),
  LandingController.translateLanding
);

export default router;

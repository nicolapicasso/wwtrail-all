// src/routes/favorites.routes.ts

import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { competitionIdParamSchema } from '../schemas/favorites.schema';
import { FavoritesController } from '../controllers/favorites.controller';

const router = Router();

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================

// Get all user's favorites
// GET /api/v2/favorites
router.get('/', authenticate, FavoritesController.getUserFavorites);

// Check if competition is favorited
// GET /api/v2/favorites/check/:competitionId
router.get(
  '/check/:competitionId',
  authenticate,
  validate(competitionIdParamSchema),
  FavoritesController.checkFavorite
);

// Add competition to favorites
// POST /api/v2/favorites/:competitionId
router.post(
  '/:competitionId',
  authenticate,
  validate(competitionIdParamSchema),
  FavoritesController.addFavorite
);

// Remove competition from favorites
// DELETE /api/v2/favorites/:competitionId
router.delete(
  '/:competitionId',
  authenticate,
  validate(competitionIdParamSchema),
  FavoritesController.removeFavorite
);

export default router;

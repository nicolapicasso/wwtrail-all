import { Router } from 'express';
import { CompetitionController } from '../controllers/competition.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { competitionEditionsRouter } from './edition.routes';
import { validate } from '../middlewares/validate.middleware';
import {
  createCompetitionSchema,
  updateCompetitionSchema,
  competitionIdSchema,
  competitionSlugSchema,
  eventIdSchema,
  reorderCompetitionsSchema,
} from '../schemas/competition.schema';

const router = Router();

/**
 * RUTAS ANIDADAS BAJO EVENTOS
 * Estas rutas se montan en: /api/v2/events/:eventId/competitions
 */

// GET /api/v2/events/:eventId/competitions - Listar competiciones de un evento
export const eventCompetitionsRouter = Router({ mergeParams: true });

eventCompetitionsRouter.get(
  '/',
  validate(eventIdSchema),
  CompetitionController.getByEvent
);

// POST /api/v2/events/:eventId/competitions - Crear competición
eventCompetitionsRouter.post(
  '/',
  authenticate,
  validate(createCompetitionSchema),
  CompetitionController.create
);

// POST /api/v2/events/:eventId/competitions/reorder - Reordenar
eventCompetitionsRouter.post(
  '/reorder',
  authenticate,
  validate(reorderCompetitionsSchema),
  CompetitionController.reorder
);

/**
 * RUTAS DIRECTAS DE COMPETICIONES
 * Estas rutas se montan en: /api/v2/competitions
 */

// ✅ NUEVO: GET /api/v2/competitions - Listar todas las competiciones
router.get(
  '/',
  CompetitionController.getAll
);

// GET /api/v2/competitions/slug/:slug - Por slug (antes de /:id)
router.get(
  '/slug/:slug',
  validate(competitionSlugSchema),
  CompetitionController.getBySlug
);

// GET /api/v2/competitions/:id - Por ID
router.get(
  '/:id',
  validate(competitionIdSchema),
  CompetitionController.getById
);

// PUT /api/v2/competitions/:id - Actualizar
router.put(
  '/:id',
  authenticate,
  validate(updateCompetitionSchema),
  CompetitionController.update
);

// PATCH /api/v2/competitions/:id - Actualizar parcial (alias)
router.patch(
  '/:id',
  authenticate,
  validate(updateCompetitionSchema),
  CompetitionController.update
);

// PATCH /api/v2/competitions/:id/toggle - Activar/desactivar
router.patch(
  '/:id/toggle',
  authenticate,
  validate(competitionIdSchema),
  CompetitionController.toggleActive
);

// DELETE /api/v2/competitions/:id - Eliminar
router.delete(
  '/:id',
  authenticate,
  validate(competitionIdSchema),
  CompetitionController.delete
);


// /api/v2/competitions/:competitionId/editions/*
router.use('/:competitionId/editions', competitionEditionsRouter);

export default router;
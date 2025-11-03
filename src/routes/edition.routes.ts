import { Router } from 'express';
import { EditionController } from '../controllers/edition.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createEditionSchema,
  updateEditionSchema,
  editionIdSchema,
  editionSlugSchema,
  competitionIdSchema,
  editionByYearSchema,
  createBulkEditionsSchema,
} from '../schemas/edition.schema';

const router = Router();

/**
 * RUTAS ANIDADAS BAJO COMPETICIONES
 * Montadas en: /api/v2/competitions/:competitionId/editions
 */
export const competitionEditionsRouter = Router({ mergeParams: true });

// GET /api/v2/competitions/:competitionId/editions - Listar ediciones
competitionEditionsRouter.get(
  '/',
  validate(competitionIdSchema),
  EditionController.getByCompetition
);

// POST /api/v2/competitions/:competitionId/editions - Crear edición
competitionEditionsRouter.post(
  '/',
  authenticate,
  validate(createEditionSchema),
  EditionController.create
);

// POST /api/v2/competitions/:competitionId/editions/bulk - Crear múltiples
competitionEditionsRouter.post(
  '/bulk',
  authenticate,
  validate(createBulkEditionsSchema),
  EditionController.createBulk
);

// GET /api/v2/competitions/:competitionId/editions/:year - Por año
competitionEditionsRouter.get(
  '/:year',
  validate(editionByYearSchema),
  EditionController.getByYear
);

/**
 * RUTAS DIRECTAS DE EDICIONES
 * Montadas en: /api/v2/editions
 */

// GET /api/v2/editions/slug/:slug - Por slug (antes de /:id)
router.get(
  '/slug/:slug',
  validate(editionSlugSchema),
  EditionController.getBySlug
);

// GET /api/v2/editions/:id/full - Con herencia de datos
router.get(
  '/:id/full',
  validate(editionIdSchema),
  EditionController.getWithInheritance
);

// GET /api/v2/editions/:id/stats - Estadísticas
router.get(
  '/:id/stats',
  validate(editionIdSchema),
  EditionController.getStats
);

// GET /api/v2/editions/:id - Por ID
router.get(
  '/:id',
  validate(editionIdSchema),
  EditionController.getById
);

// PUT /api/v2/editions/:id - Actualizar
router.put(
  '/:id',
  authenticate,
  validate(updateEditionSchema),
  EditionController.update
);

// PATCH /api/v2/editions/:id - Actualizar parcial (alias)
router.patch(
  '/:id',
  authenticate,
  validate(updateEditionSchema),
  EditionController.update
);

// PATCH /api/v2/editions/:id/toggle - Activar/desactivar
router.patch(
  '/:id/toggle',
  authenticate,
  validate(editionIdSchema),
  EditionController.toggleActive
);

// DELETE /api/v2/editions/:id - Eliminar
router.delete(
  '/:id',
  authenticate,
  validate(editionIdSchema),
  EditionController.delete
);

export default router;

import { Router } from 'express';
import { CompetitionController } from '../controllers/competition.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import {
  createCompetitionSchema,
  updateCompetitionSchema,
  getCompetitionsSchema,
  competitionIdSchema,
  competitionSlugSchema,
  searchCompetitionsSchema,
  nearbyCompetitionsSchema,
  featuredCompetitionsSchema,
  upcomingCompetitionsSchema,
  competitionsByCountrySchema,
} from '../schemas/competition.schema';

const router = Router();

// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros dinámicos
// para evitar que Express las confunda con :id

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Búsquedas especiales (deben ir primero)
router.get('/search', validate(searchCompetitionsSchema), CompetitionController.search);
router.get('/nearby', validate(nearbyCompetitionsSchema), CompetitionController.getNearby);
router.get('/featured', validate(featuredCompetitionsSchema), CompetitionController.getFeatured);
router.get('/upcoming', validate(upcomingCompetitionsSchema), CompetitionController.getUpcoming);

// Por país
router.get('/country/:country', validate(competitionsByCountrySchema), CompetitionController.getByCountry);

// Por slug (debe ir antes de /:id)
router.get('/slug/:slug', validate(competitionSlugSchema), CompetitionController.getBySlug);

// Lista general
router.get('/', validate(getCompetitionsSchema), CompetitionController.getAll);

// Por ID (debe ir casi al final de las GET)
router.get('/:id/stats', validate(competitionIdSchema), CompetitionController.getStats);
router.get('/:id', validate(competitionIdSchema), CompetitionController.getById);

// ============================================
// RUTAS PROTEGIDAS (ORGANIZER y ADMIN)
// ============================================

// Crear competición
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(createCompetitionSchema),
  CompetitionController.create
);

// Actualizar competición (solo organizador o admin)
router.put(
  '/:id',
  authenticate,
  validate(competitionIdSchema),
  validate(updateCompetitionSchema),
  CompetitionController.update
);

// También soportar PATCH para actualizaciones parciales
router.patch(
  '/:id',
  authenticate,
  validate(competitionIdSchema),
  validate(updateCompetitionSchema),
  CompetitionController.update
);

// Eliminar competición (solo organizador o admin)
router.delete(
  '/:id',
  authenticate,
  validate(competitionIdSchema),
  CompetitionController.delete
);

export default router;

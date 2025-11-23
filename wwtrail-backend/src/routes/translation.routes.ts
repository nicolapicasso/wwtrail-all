import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { TranslationController } from '../controllers/translation.controller';
import { BulkTranslationController } from '../controllers/bulkTranslation.controller';

const router = Router();

// ============================================
// RUTAS PÚBLICAS - Obtener traducciones
// ============================================

// Obtener traducciones de una competición
router.get('/competition/:competitionId', TranslationController.getCompetitionTranslations);

// Obtener traducciones de un post
router.get('/post/:postId', TranslationController.getPostTranslations);

// ============================================
// RUTAS PROTEGIDAS (ADMIN) - Traducciones masivas
// ============================================

// Generar traducciones masivas para un tipo de entidad
router.post(
  '/bulk/generate',
  authenticate,
  authorize('ADMIN'),
  BulkTranslationController.generateBulkTranslations
);

// Obtener estado de traducciones
router.get(
  '/bulk/status',
  authenticate,
  authorize('ADMIN'),
  BulkTranslationController.getTranslationStatus
);

// ============================================
// RUTAS PROTEGIDAS (ORGANIZER y ADMIN)
// ============================================

// Traducción automática genérica con IA
router.post(
  '/auto-translate',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  TranslationController.autoTranslate
);

// Auto-traducir competición específica
router.post(
  '/competition/:competitionId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  TranslationController.autoTranslateCompetition
);

// Auto-traducir post específico
router.post(
  '/post/:postId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  TranslationController.autoTranslatePost
);

// Auto-traducir evento específico
router.post(
  '/event/:eventId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  TranslationController.autoTranslateEvent
);

// Auto-traducir servicio específico
router.post(
  '/service/:serviceId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  TranslationController.autoTranslateService
);

// Auto-traducir serie especial
router.post(
  '/special-series/:specialSeriesId',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  TranslationController.autoTranslateSpecialSeries
);

export default router;

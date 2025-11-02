import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createTranslationSchema,
  updateTranslationSchema,
  autoTranslateSchema,
  getTranslationsSchema,
  updateTranslationStatusSchema,
  translationIdSchema,
} from '../schemas/translation.schema';

const router = Router();

// Nota: TranslationController debe ser creado para estas rutas
// import { TranslationController } from '../controllers/translation.controller';

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Obtener traducciones de una competición
// router.get('/competition/:competitionId', validate(getTranslationsSchema), TranslationController.getByCompetition);

// Obtener traducción por ID
// router.get('/:id', validate(translationIdSchema), TranslationController.getById);

// ============================================
// RUTAS PROTEGIDAS (ORGANIZER y ADMIN)
// ============================================

// Traducción automática con IA (solo organizador o admin)
// router.post('/auto-translate', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(autoTranslateSchema), TranslationController.autoTranslate);

// Crear traducción manual (organizador o admin)
// router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(createTranslationSchema), TranslationController.create);

// Actualizar traducción (organizador o admin)
// router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(translationIdSchema), validate(updateTranslationSchema), TranslationController.update);
// router.patch('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(translationIdSchema), validate(updateTranslationSchema), TranslationController.update);

// Actualizar estado de traducción (admin)
// router.patch('/:id/status', authenticate, authorize('ADMIN'), validate(translationIdSchema), validate(updateTranslationStatusSchema), TranslationController.updateStatus);

// Eliminar traducción (admin)
// router.delete('/:id', authenticate, authorize('ADMIN'), validate(translationIdSchema), TranslationController.delete);

// TODO: Crear TranslationController y descomentar estas rutas

export default router;

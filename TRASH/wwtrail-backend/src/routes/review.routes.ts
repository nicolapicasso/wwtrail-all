import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewsSchema,
  reviewIdSchema,
} from '../schemas/review.schema';

const router = Router();

// Nota: ReviewController debe ser creado para estas rutas
// import { ReviewController } from '../controllers/review.controller';

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Obtener reviews de una competición
// router.get('/competition/:competitionId', validate(getReviewsSchema), ReviewController.getByCompetition);

// Obtener review por ID
// router.get('/:id', validate(reviewIdSchema), ReviewController.getById);

// ============================================
// RUTAS PROTEGIDAS
// ============================================

// Crear review (requiere autenticación)
// router.post('/', authenticate, validate(createReviewSchema), ReviewController.create);

// Actualizar propia review
// router.put('/:id', authenticate, validate(reviewIdSchema), validate(updateReviewSchema), ReviewController.update);
// router.patch('/:id', authenticate, validate(reviewIdSchema), validate(updateReviewSchema), ReviewController.update);

// Eliminar propia review
// router.delete('/:id', authenticate, validate(reviewIdSchema), ReviewController.delete);

// TODO: Crear ReviewController y descomentar estas rutas

export default router;

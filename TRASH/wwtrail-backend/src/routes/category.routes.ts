import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';

const router = Router();

// Nota: CategoryController debe ser creado para estas rutas
// Nota: Los schemas para categorías deben ser creados
// import { CategoryController } from '../controllers/category.controller';
// import { createCategorySchema, updateCategorySchema, categoryIdSchema } from '../schemas/category.schema';

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Listar categorías de una competición
// router.get('/competition/:competitionId', CategoryController.getByCompetition);

// Obtener categoría por ID
// router.get('/:id', CategoryController.getById);

// ============================================
// RUTAS PROTEGIDAS (ORGANIZER y ADMIN)
// ============================================

// Crear categoría para una competición
// router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(createCategorySchema), CategoryController.create);

// Actualizar categoría
// router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(updateCategorySchema), CategoryController.update);
// router.patch('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(updateCategorySchema), CategoryController.update);

// Eliminar categoría
// router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), CategoryController.delete);

// TODO: Crear CategoryController, schemas y descomentar estas rutas

export default router;

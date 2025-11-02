import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createResultSchema,
  updateResultSchema,
  getResultsSchema,
  resultIdSchema,
  importResultsSchema,
} from '../schemas/result.schema';

const router = Router();

// Nota: ResultController debe ser creado para estas rutas
// import { ResultController } from '../controllers/result.controller';

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Listar resultados (con filtros: por competición, categoría, participante, etc.)
// router.get('/', validate(getResultsSchema), ResultController.getAll);

// Obtener resultado por ID
// router.get('/:id', validate(resultIdSchema), ResultController.getById);

// ============================================
// RUTAS PROTEGIDAS (ORGANIZER y ADMIN)
// ============================================

// Crear resultado individual
// router.post('/', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(createResultSchema), ResultController.create);

// Importar múltiples resultados (bulk import desde CSV)
// router.post('/import', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(importResultsSchema), ResultController.importResults);

// Actualizar resultado
// router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(resultIdSchema), validate(updateResultSchema), ResultController.update);
// router.patch('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(resultIdSchema), validate(updateResultSchema), ResultController.update);

// Eliminar resultado
// router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(resultIdSchema), ResultController.delete);

// TODO: Crear ResultController y descomentar estas rutas

export default router;

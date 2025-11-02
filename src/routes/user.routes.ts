import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { userIdSchema, updateUserSchema, changePasswordSchema, getUsersSchema } from '../schemas/user.schema';

const router = Router();

// Nota: UserController debe ser creado para estas rutas
// import { UserController } from '../controllers/user.controller';

// ============================================
// RUTAS PROTEGIDAS
// ============================================

// Obtener todos los usuarios (solo ADMIN)
// router.get('/', authenticate, authorize('ADMIN'), validate(getUsersSchema), UserController.getAll);

// Obtener perfil de usuario por ID
// router.get('/:id', authenticate, validate(userIdSchema), UserController.getById);

// Actualizar perfil de usuario (propio o admin)
// router.put('/:id', authenticate, validate(userIdSchema), validate(updateUserSchema), UserController.update);
// router.patch('/:id', authenticate, validate(userIdSchema), validate(updateUserSchema), UserController.update);

// Cambiar contraseña (propia)
// router.post('/:id/change-password', authenticate, validate(userIdSchema), validate(changePasswordSchema), UserController.changePassword);

// Obtener competiciones del usuario
// router.get('/:id/competitions', authenticate, validate(userIdSchema), UserController.getCompetitions);

// Obtener resultados del usuario
// router.get('/:id/results', authenticate, validate(userIdSchema), UserController.getResults);

// Obtener favoritos del usuario
// router.get('/:id/favorites', authenticate, validate(userIdSchema), UserController.getFavorites);

// Eliminar usuario (admin o propio)
// router.delete('/:id', authenticate, validate(userIdSchema), UserController.delete);

// TODO: Crear UserController y descomentar estas rutas

export default router;

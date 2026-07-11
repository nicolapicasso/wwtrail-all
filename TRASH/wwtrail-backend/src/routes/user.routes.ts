import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  updateUserSchema,
  changePasswordSchema,
  usernameSchema,
  getPublicUsersSchema,
} from '../schemas/user.schema';
import {
  userEditionSchema,
  editionIdParamSchema,
} from '../schemas/userEdition.schema';
import { UserController } from '../controllers/user.controller';
import { UserEditionController } from '../controllers/userEdition.controller';

const router = Router();

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Listar usuarios públicos con filtros
// GET /api/v2/users
router.get('/', validate(getPublicUsersSchema), UserController.getPublicUsers);

// Obtener perfil público por username
// GET /api/v2/users/profile/:username
router.get('/profile/:username', validate(usernameSchema), UserController.getPublicProfile);

// Obtener insiders públicos con configuración
// GET /api/v2/users/insiders
router.get('/insiders', UserController.getPublicInsiders);

// ============================================
// RUTAS PROTEGIDAS (Autenticado)
// ============================================

// Obtener perfil propio
// GET /api/v2/users/me
router.get('/me', authenticate, UserController.getOwnProfile);

// Actualizar perfil propio
// PUT /api/v2/users/me
router.put('/me', authenticate, validate(updateUserSchema), UserController.updateOwnProfile);

// PATCH /api/v2/users/me (alias)
router.patch('/me', authenticate, validate(updateUserSchema), UserController.updateOwnProfile);

// Cambiar contraseña
// POST /api/v2/users/me/change-password
router.post(
  '/me/change-password',
  authenticate,
  validate(changePasswordSchema),
  UserController.changePassword
);

// Obtener participaciones propias
// GET /api/v2/users/me/participations
router.get('/me/participations', authenticate, UserController.getOwnParticipations);

// ============================================
// RUTAS DE PARTICIPACIONES
// ============================================

// Obtener participación en una edición específica
// GET /api/v2/users/me/participations/:editionId
router.get(
  '/me/participations/:editionId',
  authenticate,
  validate(editionIdParamSchema),
  UserEditionController.getParticipation
);

// Crear o actualizar participación en una edición
// POST /api/v2/users/me/participations/:editionId
router.post(
  '/me/participations/:editionId',
  authenticate,
  validate(editionIdParamSchema),
  validate(userEditionSchema),
  UserEditionController.upsertParticipation
);

// PUT /api/v2/users/me/participations/:editionId (alias)
router.put(
  '/me/participations/:editionId',
  authenticate,
  validate(editionIdParamSchema),
  validate(userEditionSchema),
  UserEditionController.upsertParticipation
);

// Eliminar participación
// DELETE /api/v2/users/me/participations/:editionId
router.delete(
  '/me/participations/:editionId',
  authenticate,
  validate(editionIdParamSchema),
  UserEditionController.deleteParticipation
);

export default router;

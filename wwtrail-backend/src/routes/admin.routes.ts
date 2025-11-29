// src/routes/admin.routes.ts

import { Router, Request, Response, NextFunction } from 'express';
import CompetitionAdminController from '../controllers/competition-admin.controller';
import AdminController from '../controllers/admin.controller';
import { importController } from '../controllers/import.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin, requireOrganizer } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';

// Schemas de Competition Admin
import {
  approveCompetitionSchema,
  rejectCompetitionSchema,
  updateStatusSchema,
  getPendingCompetitionsSchema,
  getOrganizerCompetitionsSchema,
} from '../schemas/competition-admin.schema';

// Schemas de Admin General
import {
  getUsersSchema,
  getUserByIdSchema,
  updateUserRoleSchema,
  toggleUserStatusSchema,
  deleteUserSchema,
  getUserStatsSchema,
} from '../schemas/admin.schema';

const router = Router();

// ============================================
// RUTAS ADMIN - ESTADÍSTICAS GENERALES
// ============================================

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Obtener estadísticas generales del dashboard admin
 * @access  Admin
 */
router.get(
  '/admin/stats',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.getStats(req, res, next)
);

/**
 * @route   GET /api/v1/admin/stats/comprehensive
 * @desc    Obtener estadísticas completas del portal
 * @access  Admin
 */
router.get(
  '/admin/stats/comprehensive',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.getComprehensiveStats(req, res, next)
);

// ============================================
// RUTAS ADMIN - GESTIÓN DE USUARIOS
// ============================================

/**
 * @route   GET /api/v1/admin/users
 * @desc    Listar usuarios con filtros y paginación
 * @access  Admin
 */
router.get(
  '/admin/users',
  authenticate,
  requireAdmin,
  validate(getUsersSchema),
  (req: Request, res: Response, next: NextFunction) => AdminController.getUsers(req, res, next)
);

/**
 * @route   GET /api/v1/admin/users/:id
 * @desc    Obtener un usuario por ID con información detallada
 * @access  Admin
 */
router.get(
  '/admin/users/:id',
  authenticate,
  requireAdmin,
  validate(getUserByIdSchema),
  (req: Request, res: Response, next: NextFunction) => AdminController.getUserById(req, res, next)
);

/**
 * @route   GET /api/v1/admin/users/:id/stats
 * @desc    Obtener estadísticas de un usuario específico
 * @access  Admin
 */
router.get(
  '/admin/users/:id/stats',
  authenticate,
  requireAdmin,
  validate(getUserStatsSchema),
  (req: Request, res: Response, next: NextFunction) => AdminController.getUserStats(req, res, next)
);

/**
 * @route   PATCH /api/v1/admin/users/:id/role
 * @desc    Cambiar el rol de un usuario
 * @access  Admin
 */
router.patch(
  '/admin/users/:id/role',
  authenticate,
  requireAdmin,
  validate(updateUserRoleSchema),
  (req: Request, res: Response, next: NextFunction) => AdminController.updateUserRole(req, res, next)
);

/**
 * @route   PATCH /api/v1/admin/users/:id/toggle-status
 * @desc    Activar/Desactivar un usuario
 * @access  Admin
 */
router.patch(
  '/admin/users/:id/toggle-status',
  authenticate,
  requireAdmin,
  validate(toggleUserStatusSchema),
  (req: Request, res: Response, next: NextFunction) => AdminController.toggleUserStatus(req, res, next)
);

/**
 * @route   PATCH /api/v1/admin/users/:id
 * @desc    Actualizar datos de un usuario
 * @access  Admin
 */
router.patch(
  '/admin/users/:id',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.updateUser(req, res, next)
);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Eliminar un usuario
 * @access  Admin
 */
router.delete(
  '/admin/users/:id',
  authenticate,
  requireAdmin,
  validate(deleteUserSchema),
  (req: Request, res: Response, next: NextFunction) => AdminController.deleteUser(req, res, next)
);

/**
 * @route   POST /api/v1/admin/users
 * @desc    Crear un nuevo usuario
 * @access  Admin
 */
router.post(
  '/admin/users',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.createUser(req, res, next)
);

/**
 * @route   PATCH /api/v1/admin/users/:id/toggle-insider
 * @desc    Toggle insider status for a user
 * @access  Admin
 */
router.patch(
  '/admin/users/:id/toggle-insider',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.toggleInsiderStatus(req, res, next)
);

/**
 * @route   PATCH /api/v1/admin/users/:id/toggle-public
 * @desc    Toggle public status for a user
 * @access  Admin
 */
router.patch(
  '/admin/users/:id/toggle-public',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.togglePublicStatus(req, res, next)
);

// ============================================
// RUTAS ADMIN - INSIDERS
// ============================================

/**
 * @route   GET /api/v1/admin/insiders
 * @desc    Get all insiders with stats
 * @access  Admin
 */
router.get(
  '/admin/insiders',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.getInsiders(req, res, next)
);

/**
 * @route   GET /api/v1/admin/insiders/config
 * @desc    Get insider config (badge, intro texts)
 * @access  Admin
 */
router.get(
  '/admin/insiders/config',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.getInsiderConfig(req, res, next)
);

/**
 * @route   PUT /api/v1/admin/insiders/config
 * @desc    Update insider config
 * @access  Admin
 */
router.put(
  '/admin/insiders/config',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.updateInsiderConfig(req, res, next)
);

// ============================================
// RUTAS ADMIN - CONTENIDO PENDIENTE DE REVISIÓN
// ============================================

/**
 * @route   GET /api/v1/admin/pending/count
 * @desc    Obtener contadores de contenido pendiente (para badge)
 * @access  Admin
 */
router.get(
  '/admin/pending/count',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.getPendingContentCounts(req, res, next)
);

/**
 * @route   GET /api/v1/admin/pending
 * @desc    Obtener listado de todo el contenido pendiente de revisión
 * @access  Admin
 */
router.get(
  '/admin/pending',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => AdminController.getPendingContent(req, res, next)
);

// ============================================
// RUTAS ADMIN - GESTIÓN DE COMPETICIONES
// ============================================

/**
 * @route   GET /api/v1/admin/competitions/pending
 * @desc    Obtener competiciones pendientes de aprobación
 * @access  Admin
 */
router.get(
  '/admin/competitions/pending',
  authenticate,
  requireAdmin,
  validate(getPendingCompetitionsSchema),
  CompetitionAdminController.getPendingCompetitions
);

/**
 * @route   POST /api/v1/admin/competitions/:id/approve
 * @desc    Aprobar una competición
 * @access  Admin
 */
router.post(
  '/admin/competitions/:id/approve',
  authenticate,
  requireAdmin,
  validate(approveCompetitionSchema),
  CompetitionAdminController.approveCompetition
);

/**
 * @route   POST /api/v1/admin/competitions/:id/reject
 * @desc    Rechazar una competición
 * @access  Admin
 */
router.post(
  '/admin/competitions/:id/reject',
  authenticate,
  requireAdmin,
  validate(rejectCompetitionSchema),
  CompetitionAdminController.rejectCompetition
);

/**
 * @route   PATCH /api/v1/admin/competitions/:id/status
 * @desc    Cambiar status de una competición
 * @access  Admin
 */
router.patch(
  '/admin/competitions/:id/status',
  authenticate,
  requireAdmin,
  validate(updateStatusSchema),
  CompetitionAdminController.updateStatus
);

// ============================================
// RUTAS ORGANIZADOR - ORGANIZER y ADMIN
// ============================================

/**
 * @route   GET /api/v1/organizer/competitions
 * @desc    Obtener mis competiciones (como organizador)
 * @access  Organizer, Admin
 */
router.get(
  '/organizer/competitions',
  authenticate,
  requireOrganizer,
  validate(getOrganizerCompetitionsSchema),
  CompetitionAdminController.getMyCompetitions
);

// ============================================
// RUTAS ADMIN - IMPORTACIÓN DE DATOS
// ============================================

/**
 * @route   GET /api/v1/admin/import/stats
 * @desc    Get import statistics
 * @access  Admin
 */
router.get(
  '/admin/import/stats',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.getStats(req, res, next)
);

/**
 * @route   POST /api/v1/admin/import/terrain-types
 * @desc    Ensure all terrain types exist
 * @access  Admin
 */
router.post(
  '/admin/import/terrain-types',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.ensureTerrainTypes(req, res, next)
);

/**
 * @route   POST /api/v1/admin/import/organizers
 * @desc    Import organizers
 * @access  Admin
 */
router.post(
  '/admin/import/organizers',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.importOrganizers(req, res, next)
);

/**
 * @route   POST /api/v1/admin/import/series
 * @desc    Import special series
 * @access  Admin
 */
router.post(
  '/admin/import/series',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.importSeries(req, res, next)
);

/**
 * @route   POST /api/v1/admin/import/events
 * @desc    Import events
 * @access  Admin
 */
router.post(
  '/admin/import/events',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.importEvents(req, res, next)
);

/**
 * @route   POST /api/v1/admin/import/competitions
 * @desc    Import competitions
 * @access  Admin
 */
router.post(
  '/admin/import/competitions',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.importCompetitions(req, res, next)
);

/**
 * @route   POST /api/v1/admin/import/full
 * @desc    Full import (organizers + series + events + competitions)
 * @access  Admin
 */
router.post(
  '/admin/import/full',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.importFull(req, res, next)
);

// ============================================
// RUTAS ADMIN - ELIMINACIÓN MASIVA DE DATOS
// ============================================

/**
 * @route   DELETE /api/v1/admin/import/competitions
 * @desc    Delete all competitions
 * @access  Admin
 */
router.delete(
  '/admin/import/competitions',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.deleteAllCompetitions(req, res, next)
);

/**
 * @route   DELETE /api/v1/admin/import/events
 * @desc    Delete all events (and competitions)
 * @access  Admin
 */
router.delete(
  '/admin/import/events',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.deleteAllEvents(req, res, next)
);

/**
 * @route   DELETE /api/v1/admin/import/series
 * @desc    Delete all special series
 * @access  Admin
 */
router.delete(
  '/admin/import/series',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.deleteAllSeries(req, res, next)
);

/**
 * @route   DELETE /api/v1/admin/import/organizers
 * @desc    Delete all organizers
 * @access  Admin
 */
router.delete(
  '/admin/import/organizers',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.deleteAllOrganizers(req, res, next)
);

/**
 * @route   DELETE /api/v1/admin/import/editions
 * @desc    Delete all editions
 * @access  Admin
 */
router.delete(
  '/admin/import/editions',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.deleteAllEditions(req, res, next)
);

/**
 * @route   DELETE /api/v1/admin/import/all
 * @desc    Delete all imported data (full reset)
 * @access  Admin
 */
router.delete(
  '/admin/import/all',
  authenticate,
  requireAdmin,
  (req: Request, res: Response, next: NextFunction) => importController.deleteAllImportedData(req, res, next)
);

export default router;

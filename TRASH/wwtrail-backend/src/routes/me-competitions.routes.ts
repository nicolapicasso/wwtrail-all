import { Router } from 'express';
import { MeCompetitionsController } from '../controllers/me-competitions.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 */
router.use(authenticate);

/**
 * GET /api/v1/me/competitions/stats
 * Obtener estadísticas del usuario
 * NOTA: Esta debe ir ANTES de /:competitionId para evitar conflictos
 */
router.get('/stats', MeCompetitionsController.getMyStats);

/**
 * GET /api/v1/me/competitions
 * Obtener todas las competiciones marcadas
 */
router.get('/', MeCompetitionsController.getMyCompetitions);

/**
 * POST /api/v1/me/competitions/:competitionId/mark
 * Marcar una competición
 */
router.post('/:competitionId/mark', MeCompetitionsController.markCompetition);

/**
 * DELETE /api/v1/me/competitions/:competitionId/unmark
 * Desmarcar una competición
 */
router.delete('/:competitionId/unmark', MeCompetitionsController.unmarkCompetition);

/**
 * PUT /api/v1/me/competitions/:competitionId/status
 * Actualizar estado de una competición marcada
 */
router.put('/:competitionId/status', MeCompetitionsController.updateStatus);

/**
 * GET /api/v1/me/competitions/:competitionId/status
 * Obtener estado de una competición específica
 */
router.get('/:competitionId/status', MeCompetitionsController.getStatus);

export default router;

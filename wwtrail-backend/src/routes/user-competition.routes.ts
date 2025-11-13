import { Router } from 'express';
import { UserCompetitionController } from '../controllers/user-competition.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * Todas las rutas requieren autenticación
 */
router.use(authenticate);

/**
 * POST /api/v1/user-competitions
 * Marcar una competición
 */
router.post('/', UserCompetitionController.markCompetition);

/**
 * GET /api/v1/user-competitions
 * Obtener todas las competiciones marcadas por el usuario
 */
router.get('/', UserCompetitionController.getUserCompetitions);

/**
 * GET /api/v1/user-competitions/stats
 * Obtener estadísticas del usuario
 */
router.get('/stats', UserCompetitionController.getUserStats);

/**
 * GET /api/v1/user-competitions/competition/:competitionId
 * Obtener estado de una competición específica
 */
router.get('/competition/:competitionId', UserCompetitionController.getCompetitionStatus);

/**
 * PUT /api/v1/user-competitions/:id
 * Actualizar una competición marcada
 */
router.put('/:id', UserCompetitionController.updateStatus);

/**
 * DELETE /api/v1/user-competitions/:id
 * Desmarcar una competición
 */
router.delete('/:id', UserCompetitionController.unmarkCompetition);

export default router;
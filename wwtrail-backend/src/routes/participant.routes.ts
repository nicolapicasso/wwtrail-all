import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createParticipantSchema,
  updateParticipantSchema,
  getParticipantsSchema,
  participantIdSchema,
} from '../schemas/participant.schema';

const router = Router();

// Nota: ParticipantController debe ser creado para estas rutas
// import { ParticipantController } from '../controllers/participant.controller';

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Listar participantes (con filtros)
// router.get('/', validate(getParticipantsSchema), ParticipantController.getAll);

// Obtener participante por ID
// router.get('/:id', validate(participantIdSchema), ParticipantController.getById);

// ============================================
// RUTAS PROTEGIDAS
// ============================================

// Registrar participante (usuario autenticado o organizador)
// router.post('/', authenticate, validate(createParticipantSchema), ParticipantController.create);

// Actualizar participante (organizador o admin)
// router.put('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(participantIdSchema), validate(updateParticipantSchema), ParticipantController.update);
// router.patch('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(participantIdSchema), validate(updateParticipantSchema), ParticipantController.update);

// Eliminar participante (organizador o admin)
// router.delete('/:id', authenticate, authorize('ORGANIZER', 'ADMIN'), validate(participantIdSchema), ParticipantController.delete);

// TODO: Crear ParticipantController y descomentar estas rutas

export default router;

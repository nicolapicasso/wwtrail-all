import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import { checkEventOwnership } from '../middlewares/ownership.middleware';
import {
  createEventSchema,
  updateEventSchema,
  getEventsSchema,
  eventIdSchema,
  eventSlugSchema,
  searchEventsSchema,
  nearbyEventsSchema,
  featuredEventsSchema,
  eventsByCountrySchema,
} from '../schemas/event.schema';
import { eventCompetitionsRouter } from './competition.routes';

const router = Router();

// ============================================
// IMPORTANTE: ORDEN DE LAS RUTAS
// ============================================
// Las rutas más específicas DEBEN ir primero
// para evitar que sean capturadas por /:id
// ============================================

// ===================================
// RUTAS PÚBLICAS (sin autenticación)
// ===================================

// Búsqueda full-text
router.get(
  '/search',
  validate(searchEventsSchema),
  EventController.search
);

// Búsqueda geoespacial
router.get(
  '/nearby',
  validate(nearbyEventsSchema),
  EventController.getNearby
);

// Eventos destacados
router.get(
  '/featured',
  validate(featuredEventsSchema),
  EventController.getFeatured
);

// Por país
router.get(
  '/country/:country',
  validate(eventsByCountrySchema),
  EventController.getByCountry
);

// Por slug (antes de /:id)
router.get(
  '/slug/:slug',
  validate(eventSlugSchema),
  EventController.getBySlug
);

// ===================================
// RUTAS PROTEGIDAS - USUARIOS
// ===================================

// Mis eventos (ORGANIZER ve solo suyos, ADMIN ve todos)
router.get(
  '/my-events',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  EventController.getMyEvents
);

// Mis estadísticas
router.get(
  '/my-stats',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  EventController.getMyStats
);

// ===================================
// RUTAS PROTEGIDAS - SOLO ADMIN
// ===================================

// Eventos pendientes de aprobación
router.get(
  '/pending',
  authenticate,
  authorize('ADMIN'),
  EventController.getPendingEvents
);

// Aprobar evento
router.post(
  '/:id/approve',
  authenticate,
  authorize('ADMIN'),
  EventController.approveEvent
);

// Rechazar evento
router.post(
  '/:id/reject',
  authenticate,
  authorize('ADMIN'),
  EventController.rejectEvent
);

// ===================================
// RUTAS PÚBLICAS CON ID
// (Deben ir después de las rutas específicas)
// ===================================

// Listar todos los eventos
router.get(
  '/',
  validate(getEventsSchema),
  EventController.getAll
);

// Estadísticas del evento
router.get(
  '/:id/stats',
  validate(eventIdSchema),
  EventController.getStats
);

// Por ID (DEBE ir al final)
router.get(
  '/:id',
  validate(eventIdSchema),
  EventController.getById
);

// ===================================
// RUTAS PROTEGIDAS - CRUD
// ===================================

// Crear evento (ORGANIZER crea en DRAFT, ADMIN en PUBLISHED)
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(createEventSchema),
  EventController.create
);

// Actualizar evento (solo creador o ADMIN)
router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(updateEventSchema),
  checkEventOwnership,
  EventController.update
);

// Actualizar evento parcial (alias de PUT)
router.patch(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(updateEventSchema),
  checkEventOwnership,
  EventController.update
);

// Eliminar evento (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(eventIdSchema),
  EventController.delete
);

// ===================================
// RUTAS ANIDADAS - COMPETITIONS
// ===================================

// /api/v2/events/:eventId/competitions/*
router.use('/:eventId/competitions', eventCompetitionsRouter);

export default router;
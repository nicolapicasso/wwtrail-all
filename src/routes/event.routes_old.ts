import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
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

/**
 * RUTAS PÚBLICAS (No requieren autenticación)
 */

// GET /api/v2/events/search - Búsqueda full-text
router.get(
  '/search',
  validate(searchEventsSchema),
  EventController.search
);

// GET /api/v2/events/nearby - Búsqueda geoespacial
router.get(
  '/nearby',
  validate(nearbyEventsSchema),
  EventController.getNearby
);

// GET /api/v2/events/featured - Eventos destacados
router.get(
  '/featured',
  validate(featuredEventsSchema),
  EventController.getFeatured
);

// GET /api/v2/events/country/:country - Por país
router.get(
  '/country/:country',
  validate(eventsByCountrySchema),
  EventController.getByCountry
);

// GET /api/v2/events/slug/:slug - Por slug (antes de /:id)
router.get(
  '/slug/:slug',
  validate(eventSlugSchema),
  EventController.getBySlug
);

// GET /api/v2/events - Listar todos
router.get(
  '/',
  validate(getEventsSchema),
  EventController.getAll
);

// GET /api/v2/events/:id/stats - Estadísticas
router.get(
  '/:id/stats',
  validate(eventIdSchema),
  EventController.getStats
);

// GET /api/v2/events/:id - Por ID
router.get(
  '/:id',
  validate(eventIdSchema),
  EventController.getById
);

/**
 * RUTAS PROTEGIDAS (Requieren autenticación)
 */

// POST /api/v2/events - Crear evento (ORGANIZER o ADMIN)
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  validate(createEventSchema),
  EventController.create
);

// PUT /api/v2/events/:id - Actualizar (organizador o ADMIN)
router.put(
  '/:id',
  authenticate,
  validate(updateEventSchema),
  EventController.update
);

// PATCH /api/v2/events/:id - Actualizar parcial (alias de PUT)
router.patch(
  '/:id',
  authenticate,
  validate(updateEventSchema),
  EventController.update
);

// DELETE /api/v2/events/:id - Eliminar (organizador o ADMIN)
router.delete(
  '/:id',
  authenticate,
  validate(eventIdSchema),
  EventController.delete
);

/**
 * RUTAS ANIDADAS - COMPETITIONS
 */

// /api/v2/events/:eventId/competitions/*
router.use('/:eventId/competitions', eventCompetitionsRouter);

export default router;
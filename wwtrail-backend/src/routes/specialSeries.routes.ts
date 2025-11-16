// src/routes/specialSeries.routes.ts - Special Series routes

import { Router } from 'express';
import { SpecialSeriesController } from '../controllers/specialSeries.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// ============================================
// SPECIAL SERIES ROUTES
// ============================================
// Circuitos/Series especiales que agrupan competiciones
// - ADMIN: puede crear/editar/aprobar special series
// - ORGANIZER: puede crear special series (quedan en DRAFT)
// ============================================

// ===================================
// RUTAS PÚBLICAS ESPECÍFICAS
// ===================================

// Check slug availability (público)
router.get('/check-slug/:slug', SpecialSeriesController.checkSlug);

// Get special series by slug (público para PUBLISHED)
router.get('/slug/:slug', SpecialSeriesController.getBySlug);

// ===================================
// RUTAS CON ID + ACCIONES
// ===================================

// Approve special series (solo ADMIN)
router.post(
  '/:id/approve',
  authenticate,
  authorize('ADMIN'),
  SpecialSeriesController.approve
);

// Reject special series (solo ADMIN)
router.post(
  '/:id/reject',
  authenticate,
  authorize('ADMIN'),
  SpecialSeriesController.reject
);

// Update special series (creador o ADMIN)
router.patch(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  SpecialSeriesController.update
);

router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  SpecialSeriesController.update
);

// Delete special series (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  SpecialSeriesController.delete
);

// Get special series by ID (público para PUBLISHED)
router.get('/:id', SpecialSeriesController.getById);

// ===================================
// RUTA RAÍZ - AL FINAL
// ===================================

// GET / - Lista de special series
router.get('/', SpecialSeriesController.getAll);

// POST / - Crear special series (ORGANIZER/ADMIN)
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  SpecialSeriesController.create
);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PÚBLICAS (sin login requerido):
   GET  /special-series                     → Lista (solo PUBLISHED)
   GET  /special-series/check-slug/:slug    → Verificar slug
   GET  /special-series/slug/:slug          → Special series por slug (PUBLISHED)
   GET  /special-series/:id                 → Special series por ID (PUBLISHED)

✅ RUTAS PROTEGIDAS (requieren login):
   POST   /special-series                   → Crear (ORGANIZER/ADMIN)
   PUT    /special-series/:id               → Actualizar (creador/ADMIN)
   PATCH  /special-series/:id               → Actualizar parcial (creador/ADMIN)
   DELETE /special-series/:id               → Eliminar (ADMIN)
   POST   /special-series/:id/approve       → Aprobar (ADMIN)
   POST   /special-series/:id/reject        → Rechazar (ADMIN)

Permisos:
- ADMIN: puede ver DRAFT, crear, editar, aprobar, rechazar, eliminar
- ORGANIZER: puede crear (status DRAFT), editar propios
- Público: puede ver solo PUBLISHED
*/

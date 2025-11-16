// src/routes/organizer.routes.ts - Organizer routes with public/protected separation

import { Router } from 'express';
import { OrganizerController } from '../controllers/organizer.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// ============================================
// ORGANIZER ROUTES
// ============================================
// Entidades organizadoras (clubs, sociedades, etc.)
// - ADMIN: puede crear/editar/aprobar organizadores
// - ORGANIZER: puede crear organizadores (quedan en DRAFT)
// ============================================

// ===================================
// RUTAS PÚBLICAS ESPECÍFICAS
// ===================================

// Check slug availability (público)
router.get('/check-slug/:slug', OrganizerController.checkSlug);

// Get organizer by slug (público para PUBLISHED)
router.get('/slug/:slug', OrganizerController.getBySlug);

// ===================================
// RUTAS CON ID + ACCIONES
// ===================================

// Approve organizer (solo ADMIN)
router.post(
  '/:id/approve',
  authenticate,
  authorize('ADMIN'),
  OrganizerController.approve
);

// Reject organizer (solo ADMIN)
router.post(
  '/:id/reject',
  authenticate,
  authorize('ADMIN'),
  OrganizerController.reject
);

// Update organizer (creador o ADMIN)
router.patch(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  OrganizerController.update
);

router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  OrganizerController.update
);

// Delete organizer (solo ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  OrganizerController.delete
);

// Get organizer by ID (público para PUBLISHED)
router.get('/:id', OrganizerController.getById);

// ===================================
// RUTA RAÍZ - AL FINAL
// ===================================

// GET / - Lista de organizadores
router.get('/', OrganizerController.getAll);

// POST / - Crear organizador (ORGANIZER/ADMIN)
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  OrganizerController.create
);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PÚBLICAS (sin login requerido):
   GET  /organizers                     → Lista (solo PUBLISHED)
   GET  /organizers/check-slug/:slug    → Verificar slug
   GET  /organizers/slug/:slug          → Organizador por slug (PUBLISHED)
   GET  /organizers/:id                 → Organizador por ID (PUBLISHED)

✅ RUTAS PROTEGIDAS (requieren login):
   POST   /organizers                   → Crear (ORGANIZER/ADMIN)
   PUT    /organizers/:id               → Actualizar (creador/ADMIN)
   PATCH  /organizers/:id               → Actualizar parcial (creador/ADMIN)
   DELETE /organizers/:id               → Eliminar (ADMIN)
   POST   /organizers/:id/approve       → Aprobar (ADMIN)
   POST   /organizers/:id/reject        → Rechazar (ADMIN)

Permisos:
- ADMIN: puede ver DRAFT, crear, editar, aprobar, rechazar, eliminar
- ORGANIZER: puede crear (status DRAFT), editar propios
- Público: puede ver solo PUBLISHED
*/

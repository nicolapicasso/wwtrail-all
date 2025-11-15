// src/routes/service.routes.ts - Service routes with proper public/protected separation

import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// ============================================
// ⚠️ ORDEN CRÍTICO DE LAS RUTAS
// ============================================
// 1. Rutas literales específicas (/categories, etc.)
// 2. Rutas protegidas específicas (/organizer/:id)
// 3. Rutas con parámetros (/slug/:slug, /:id)
// 4. Ruta raíz (/) AL FINAL
// ============================================

// ===================================
// PASO 1: RUTAS PÚBLICAS ESPECÍFICAS
// ===================================

router.get('/categories', ServiceController.getCategories);

// ===================================
// PASO 2: RUTAS CON PARÁMETROS SLUG
// ===================================

router.get('/slug/:slug', ServiceController.getBySlug);

// ===================================
// PASO 3: RUTAS PROTEGIDAS CON ID
// ===================================

// Toggle featured status (protegido - solo ADMIN)
router.patch(
  '/:id/featured',
  authenticate,
  authorize('ADMIN'),
  ServiceController.toggleFeatured
);

// Actualizar servicio (protegido - owner o ADMIN)
router.put(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ServiceController.update
);

router.patch(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ServiceController.update
);

// Eliminar servicio (protegido - owner o ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ServiceController.delete
);

// Obtener servicio por ID (público)
router.get('/:id', ServiceController.getById);

// ===================================
// PASO 4: RUTAS DE ORGANIZADOR
// ===================================

// Obtener servicios de un organizador (protegido)
router.get(
  '/organizer/:organizerId',
  authenticate,
  ServiceController.getByOrganizer
);

// ===================================
// PASO 5: RUTA RAÍZ - DEBE IR AL FINAL
// ===================================

// GET / - Lista de servicios (PÚBLICO)
router.get('/', ServiceController.getAll);

// POST / - Crear servicio (PROTEGIDO)
router.post(
  '/',
  authenticate,
  authorize('ORGANIZER', 'ADMIN'),
  ServiceController.create
);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PÚBLICAS (sin login requerido):
   GET  /services                    → Lista paginada con filtros
   GET  /services/categories         → Lista de categorías únicas
   GET  /services/slug/:slug         → Servicio por slug
   GET  /services/:id                → Servicio por ID

✅ RUTAS PROTEGIDAS (requieren login):
   POST   /services                     → Crear servicio (ORGANIZER/ADMIN)
   PUT    /services/:id                 → Actualizar servicio (ORGANIZER/ADMIN + ownership)
   PATCH  /services/:id                 → Actualizar parcial (ORGANIZER/ADMIN + ownership)
   DELETE /services/:id                 → Eliminar servicio (ORGANIZER/ADMIN + ownership)
   PATCH  /services/:id/featured        → Toggle featured (ADMIN)
   GET    /services/organizer/:id       → Servicios de un organizador (ORGANIZER/ADMIN)

Esta configuración permite:
- ✅ Usuarios no registrados pueden explorar servicios
- ✅ SEO puede indexar servicios públicos
- ✅ Usuarios registrados pueden gestionar sus servicios
- ✅ Admins pueden destacar servicios
*/

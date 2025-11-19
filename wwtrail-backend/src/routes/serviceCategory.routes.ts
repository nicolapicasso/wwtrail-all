// src/routes/serviceCategory.routes.ts - Service Category routes

import { Router } from 'express';
import { ServiceCategoryController } from '../controllers/serviceCategory.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';

const router = Router();

// ============================================
// ⚠️ ORDEN CRÍTICO DE LAS RUTAS
// ============================================
// 1. Rutas literales específicas (/with-count, etc.)
// 2. Rutas protegidas específicas
// 3. Rutas con parámetros (/slug/:slug, /:id)
// 4. Ruta raíz (/) AL FINAL
// ============================================

// ===================================
// PASO 1: RUTAS PÚBLICAS ESPECÍFICAS
// ===================================

router.get('/with-count', ServiceCategoryController.getCategoriesWithCount);
router.get('/slug/:slug', ServiceCategoryController.getBySlug);

// ===================================
// PASO 2: RUTAS PROTEGIDAS (ADMIN)
// ===================================

// Crear categoría (ADMIN)
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  ServiceCategoryController.create
);

// Actualizar categoría (ADMIN)
router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  ServiceCategoryController.update
);

// Eliminar categoría (ADMIN)
router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  ServiceCategoryController.delete
);

// ===================================
// PASO 3: RUTAS PÚBLICAS CON ID
// ===================================

router.get('/:id', ServiceCategoryController.getById);

// ===================================
// PASO 4: RUTA RAÍZ - DEBE IR AL FINAL
// ===================================

// GET / - Lista de categorías (PÚBLICO)
router.get('/', ServiceCategoryController.getAll);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PÚBLICAS (sin login requerido):
   GET  /service-categories                → Lista todas las categorías
   GET  /service-categories/with-count     → Lista con conteo de servicios
   GET  /service-categories/:id            → Categoría por ID
   GET  /service-categories/slug/:slug     → Categoría por slug

✅ RUTAS PROTEGIDAS (requieren login de ADMIN):
   POST   /service-categories              → Crear categoría
   PUT    /service-categories/:id          → Actualizar categoría
   DELETE /service-categories/:id          → Eliminar categoría
*/

// src/routes/homeConfiguration.routes.ts - Home Configuration routes

import { Router } from 'express';
import { HomeConfigurationController } from '../controllers/homeConfiguration.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/authorize.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createHomeConfigurationSchema,
  updateHomeConfigurationSchema,
  createHomeBlockSchema,
  updateHomeBlockSchema,
  updateFullHomeConfigSchema,
  reorderBlocksSchema,
} from '../schemas/homeConfiguration.schema';

const router = Router();

// ===================================
// RUTAS PÚBLICAS
// ===================================

/**
 * GET /api/v2/home/config
 * Obtener la configuración activa de la home
 * Público - No requiere autenticación
 */
router.get('/config', HomeConfigurationController.getActive);

// ===================================
// RUTAS ADMIN (requieren AUTH + ADMIN)
// ===================================

/**
 * GET /api/v2/home/config/:id
 * Obtener configuración por ID
 * Requiere: AUTH + ADMIN
 */
router.get(
  '/config/:id',
  authenticate,
  authorize('ADMIN'),
  HomeConfigurationController.getById
);

/**
 * POST /api/v2/home/config
 * Crear nueva configuración
 * Requiere: AUTH + ADMIN
 */
router.post(
  '/config',
  authenticate,
  authorize('ADMIN'),
  validate(createHomeConfigurationSchema),
  HomeConfigurationController.create
);

/**
 * PATCH /api/v2/home/config/:id
 * Actualizar configuración básica (solo hero)
 * Requiere: AUTH + ADMIN
 */
router.patch(
  '/config/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateHomeConfigurationSchema),
  HomeConfigurationController.update
);

/**
 * PUT /api/v2/home/config/:id/full
 * Actualizar configuración completa (hero + bloques)
 * Requiere: AUTH + ADMIN
 */
router.put(
  '/config/:id/full',
  authenticate,
  authorize('ADMIN'),
  validate(updateFullHomeConfigSchema),
  HomeConfigurationController.updateFull
);

/**
 * DELETE /api/v2/home/config/:id
 * Eliminar configuración
 * Requiere: AUTH + ADMIN
 */
router.delete(
  '/config/:id',
  authenticate,
  authorize('ADMIN'),
  HomeConfigurationController.delete
);

/**
 * POST /api/v2/home/config/:id/reorder
 * Reordenar bloques
 * Requiere: AUTH + ADMIN
 */
router.post(
  '/config/:id/reorder',
  authenticate,
  authorize('ADMIN'),
  validate(reorderBlocksSchema),
  HomeConfigurationController.reorderBlocks
);

// ===================================
// BLOQUES INDIVIDUALES (requieren AUTH + ADMIN)
// ===================================

/**
 * POST /api/v2/home/config/:id/blocks
 * Crear nuevo bloque
 * Requiere: AUTH + ADMIN
 */
router.post(
  '/config/:id/blocks',
  authenticate,
  authorize('ADMIN'),
  validate(createHomeBlockSchema),
  HomeConfigurationController.createBlock
);

/**
 * PATCH /api/v2/home/blocks/:blockId
 * Actualizar bloque existente
 * Requiere: AUTH + ADMIN
 */
router.patch(
  '/blocks/:blockId',
  authenticate,
  authorize('ADMIN'),
  validate(updateHomeBlockSchema),
  HomeConfigurationController.updateBlock
);

/**
 * DELETE /api/v2/home/blocks/:blockId
 * Eliminar bloque
 * Requiere: AUTH + ADMIN
 */
router.delete(
  '/blocks/:blockId',
  authenticate,
  authorize('ADMIN'),
  HomeConfigurationController.deleteBlock
);

/**
 * POST /api/v2/home/blocks/:blockId/toggle
 * Cambiar visibilidad de un bloque
 * Requiere: AUTH + ADMIN
 */
router.post(
  '/blocks/:blockId/toggle',
  authenticate,
  authorize('ADMIN'),
  HomeConfigurationController.toggleBlockVisibility
);

export default router;

// ============================================
// 📝 RESUMEN DE RUTAS
// ============================================
/*
✅ RUTAS PÚBLICAS (sin login):
   GET  /home/config                       → Configuración activa de la home

✅ RUTAS PROTEGIDAS (requieren AUTH + ADMIN):
   GET    /home/config/:id                 → Configuración por ID
   POST   /home/config                     → Crear configuración
   PATCH  /home/config/:id                 → Actualizar hero
   PUT    /home/config/:id/full            → Actualizar completo (hero + bloques)
   DELETE /home/config/:id                 → Eliminar configuración
   POST   /home/config/:id/reorder         → Reordenar bloques

   POST   /home/config/:id/blocks          → Crear bloque
   PATCH  /home/blocks/:blockId            → Actualizar bloque
   DELETE /home/blocks/:blockId            → Eliminar bloque
   POST   /home/blocks/:blockId/toggle     → Toggle visibilidad
*/

// src/routes/seo.routes.ts
import express from 'express';
import * as seoController from '../controllers/seo.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/authorize.middleware';

const router = express.Router();

// ==========================================
// RUTAS DE ADMIN (requieren autenticación y rol ADMIN)
// ⚠️ IMPORTANTE: Estas rutas deben ir ANTES de las rutas dinámicas
// ==========================================

// Configuración
router.get('/config', authenticate, requireAdmin, seoController.listConfigs);
router.get('/config/:entityType', authenticate, requireAdmin, seoController.getConfig);
router.post('/config', authenticate, requireAdmin, seoController.upsertConfig);

// Gestión de SEO
router.get('/list/:entityType', authenticate, requireAdmin, seoController.listSEO);
router.post('/generate', authenticate, requireAdmin, seoController.generateSEO);
router.post('/regenerate', authenticate, requireAdmin, seoController.regenerateSEO);
router.put('/:id', authenticate, requireAdmin, seoController.updateSEO);
router.delete('/:id', authenticate, requireAdmin, seoController.deleteSEO);

// ==========================================
// RUTAS PÚBLICAS (para frontend)
// ⚠️ IMPORTANTE: Esta ruta dinámica debe ir AL FINAL
// ==========================================

// Obtener SEO de una entidad específica
router.get('/:entityType/:entityId', seoController.getSEO);

export default router;

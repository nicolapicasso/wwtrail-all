// src/routes/seo.routes.ts
import express from 'express';
import * as seoController from '../controllers/seo.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';

const router = express.Router();

// ==========================================
// RUTAS PÚBLICAS (para frontend)
// ==========================================

// Obtener SEO de una entidad específica
router.get('/:entityType/:entityId', seoController.getSEO);

// ==========================================
// RUTAS DE ADMIN (requieren autenticación y rol ADMIN)
// ==========================================

// Configuración
router.get('/config', authMiddleware, checkRole(['ADMIN']), seoController.listConfigs);
router.get('/config/:entityType', authMiddleware, checkRole(['ADMIN']), seoController.getConfig);
router.post('/config', authMiddleware, checkRole(['ADMIN']), seoController.upsertConfig);

// Gestión de SEO
router.get('/list/:entityType', authMiddleware, checkRole(['ADMIN']), seoController.listSEO);
router.post('/generate', authMiddleware, checkRole(['ADMIN']), seoController.generateSEO);
router.post('/regenerate', authMiddleware, checkRole(['ADMIN']), seoController.regenerateSEO);
router.put('/:id', authMiddleware, checkRole(['ADMIN']), seoController.updateSEO);
router.delete('/:id', authMiddleware, checkRole(['ADMIN']), seoController.deleteSEO);

export default router;

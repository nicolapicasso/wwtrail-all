import { Router } from 'express';
import { ZancadasController } from '../controllers/zancadas.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/authorize.middleware';

const router = Router();

// =============================================
// RUTAS DE USUARIO (requieren autenticación)
// =============================================

// Obtener mi balance de Zancadas
router.get('/balance', authenticate, ZancadasController.getMyBalance);

// Obtener mi historial de transacciones
router.get('/transactions', authenticate, ZancadasController.getMyTransactions);

// Sincronizar mi balance con Omniwallet
router.post('/sync', authenticate, ZancadasController.syncMyBalance);

// =============================================
// RUTAS DE ADMIN (requieren autenticación + rol ADMIN)
// =============================================

// Configuración de Omniwallet
router.get('/admin/config', authenticate, requireAdmin, ZancadasController.getConfig);
router.put('/admin/config', authenticate, requireAdmin, ZancadasController.updateConfig);
router.post('/admin/test-connection', authenticate, requireAdmin, ZancadasController.testConnection);

// Gestión de acciones
router.get('/admin/actions', authenticate, requireAdmin, ZancadasController.getActions);
router.put('/admin/actions/:id', authenticate, requireAdmin, ZancadasController.updateAction);

// Estadísticas
router.get('/admin/stats', authenticate, requireAdmin, ZancadasController.getStats);

// Reintentar sincronizaciones fallidas
router.post('/admin/retry-syncs', authenticate, requireAdmin, ZancadasController.retrySyncs);

// =============================================
// WEBHOOK (público pero validado por firma)
// =============================================

router.post('/webhook', ZancadasController.handleWebhook);

export default router;

import { Request, Response, NextFunction } from 'express';
import { zancadasService } from '../services/zancadas.service';
import { omniwalletService } from '../services/omniwallet.service';
import logger from '../utils/logger';

export class ZancadasController {
  // =============================================
  // USER ENDPOINTS
  // =============================================

  /**
   * GET /api/v2/zancadas/balance
   * Obtiene el balance de Zancadas del usuario autenticado
   */
  static async getMyBalance(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      const balance = await zancadasService.getUserBalance(req.user.id);

      res.status(200).json({
        status: 'success',
        data: {
          zancadas: balance.local,
          omniwalletBalance: balance.omniwallet,
          synced: balance.synced,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/zancadas/transactions
   * Obtiene el historial de transacciones del usuario autenticado
   */
  static async getMyTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;

      const result = await zancadasService.getUserTransactions(req.user.id, page, pageSize);

      res.status(200).json({
        status: 'success',
        data: result.data,
        meta: result.meta,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/zancadas/sync
   * Sincroniza el balance local con Omniwallet
   */
  static async syncMyBalance(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication required',
        });
      }

      await zancadasService.syncBalance(req.user.id);
      const balance = await zancadasService.getUserBalance(req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'Balance synchronized',
        data: {
          zancadas: balance.local,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v2/zancadas/equivalent-competition
   * Obtiene una competición equivalente basada en las zancadas
   */
  static async getEquivalentCompetition(req: Request, res: Response, next: NextFunction) {
    try {
      const zancadas = parseInt(req.query.zancadas as string) || 0;

      if (zancadas <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid zancadas value',
        });
      }

      const competition = await zancadasService.getEquivalentCompetition(zancadas);

      if (!competition) {
        return res.status(404).json({
          status: 'error',
          message: 'No equivalent competition found',
        });
      }

      res.status(200).json({
        status: 'success',
        data: competition,
      });
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // ADMIN ENDPOINTS - CONFIG
  // =============================================

  /**
   * GET /api/v2/admin/zancadas/config
   * Obtiene la configuración de Omniwallet (sin datos sensibles)
   */
  static async getConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const config = await zancadasService.getConfig();

      res.status(200).json({
        status: 'success',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/admin/zancadas/config
   * Actualiza la configuración de Omniwallet
   */
  static async updateConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { subdomain, apiToken, webhookSecret, isEnabled } = req.body;

      await zancadasService.updateConfig({
        subdomain,
        apiToken,
        webhookSecret,
        isEnabled,
      });

      const config = await zancadasService.getConfig();

      res.status(200).json({
        status: 'success',
        message: 'Configuration updated',
        data: config,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/admin/zancadas/test-connection
   * Prueba la conexión con Omniwallet
   */
  static async testConnection(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await omniwalletService.testConnection();

      res.status(200).json({
        status: result.success ? 'success' : 'error',
        message: result.success ? 'Connection successful' : result.error,
        data: { connected: result.success },
      });
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // ADMIN ENDPOINTS - ACTIONS
  // =============================================

  /**
   * GET /api/v2/admin/zancadas/actions
   * Obtiene todas las acciones configuradas
   */
  static async getActions(req: Request, res: Response, next: NextFunction) {
    try {
      const actions = await zancadasService.getAllActions();

      res.status(200).json({
        status: 'success',
        data: actions,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v2/admin/zancadas/actions/:id
   * Actualiza una acción
   */
  static async updateAction(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { points, isEnabled, maxPerDay, maxPerUser, triggerStatuses } = req.body;

      const action = await zancadasService.updateAction(id, {
        points,
        isEnabled,
        maxPerDay,
        maxPerUser,
        triggerStatuses,
      });

      res.status(200).json({
        status: 'success',
        message: 'Action updated',
        data: action,
      });
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // ADMIN ENDPOINTS - STATS
  // =============================================

  /**
   * GET /api/v2/admin/zancadas/stats
   * Obtiene estadísticas generales
   */
  static async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await zancadasService.getStats();

      res.status(200).json({
        status: 'success',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v2/admin/zancadas/retry-syncs
   * Reintenta sincronizar transacciones fallidas
   */
  static async retrySyncs(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await zancadasService.retryFailedSyncs(limit);

      res.status(200).json({
        status: 'success',
        message: `Processed ${result.processed} transactions, ${result.synced} synced`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // =============================================
  // WEBHOOK ENDPOINT
  // =============================================

  /**
   * POST /api/v2/zancadas/webhook
   * Recibe webhooks de Omniwallet
   */
  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-omniwallet-signature'] as string;
      const timestamp = req.headers['x-omniwallet-timestamp'] as string;
      const hookId = req.headers['x-omniwallet-hook-id'] as string;

      if (!signature || !timestamp || !hookId) {
        logger.warn('Webhook missing required headers');
        return res.status(400).json({ error: 'Missing required headers' });
      }

      const body = JSON.stringify(req.body);

      // Verificar firma
      if (!omniwalletService.validateWebhookSignature(body, timestamp, signature)) {
        logger.warn(`Invalid webhook signature for hook ${hookId}`);
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Verificar idempotencia (evitar procesar duplicados)
      const isNew = await omniwalletService.registerWebhook(hookId, req.body.event, req.body);
      if (!isNew) {
        return res.status(200).json({ message: 'Already processed' });
      }

      // Procesar evento según tipo
      const { event, data } = req.body;
      logger.info(`Processing webhook: ${event} (${hookId})`);

      switch (event) {
        case 'points.added':
        case 'points.subtracted':
          // Sincronizar balance del usuario afectado
          if (data?.customer_id) {
            // Buscar usuario por email (customer_id en Omniwallet es el email)
            const { default: prisma } = await import('../config/database');
            const user = await prisma.user.findFirst({
              where: { email: data.customer_id },
            });
            if (user) {
              await zancadasService.syncBalance(user.id);
              logger.info(`Balance synced for user ${user.id} via webhook`);
            }
          }
          break;

        case 'customer.updated':
          // Podríamos actualizar datos del cliente si es necesario
          logger.info(`Customer updated event received: ${data?.customer_id}`);
          break;

        default:
          logger.info(`Unhandled webhook event: ${event}`);
      }

      res.status(200).json({ success: true });
    } catch (error) {
      logger.error(`Webhook processing error: ${error}`);
      next(error);
    }
  }
}

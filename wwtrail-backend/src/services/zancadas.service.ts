import prisma from '../config/database';
import { omniwalletService } from './omniwallet.service';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger';
import { ParticipationStatus } from '@prisma/client';

// =============================================
// INTERFACES
// =============================================

interface GrantZancadasResult {
  success: boolean;
  points?: number;
  totalBalance?: number;
  error?: string;
  alreadyGranted?: boolean;
}

interface UserBalance {
  local: number;
  omniwallet: number | null;
  synced: boolean;
}

interface TransactionWithAction {
  id: string;
  points: number;
  createdAt: Date;
  referenceType: string | null;
  referenceId: string | null;
  omniwalletSynced: boolean;
  action: {
    actionName: string;
    actionCode: string;
  };
}

// =============================================
// ZANCADAS SERVICE
// =============================================

class ZancadasService {
  // =============================================
  // CONFIGURATION
  // =============================================

  /**
   * Verifica si el sistema de Zancadas está habilitado
   */
  async isEnabled(): Promise<boolean> {
    const config = await prisma.zancadasConfig.findFirst();
    return config?.isEnabled ?? false;
  }

  /**
   * Obtiene la configuración actual (sin datos sensibles)
   */
  async getConfig(): Promise<{
    subdomain: string | null;
    hasToken: boolean;
    hasWebhookSecret: boolean;
    isEnabled: boolean;
  } | null> {
    const config = await prisma.zancadasConfig.findFirst();
    if (!config) return null;

    return {
      subdomain: config.omniwalletSubdomain,
      hasToken: !!config.omniwalletApiToken,
      hasWebhookSecret: !!config.omniwalletWebhookSecret,
      isEnabled: config.isEnabled,
    };
  }

  /**
   * Actualiza la configuración de Omniwallet
   */
  async updateConfig(data: {
    subdomain?: string;
    apiToken?: string;
    webhookSecret?: string;
    isEnabled?: boolean;
  }): Promise<void> {
    const existingConfig = await prisma.zancadasConfig.findFirst();

    const updateData: Record<string, unknown> = {};

    if (data.subdomain !== undefined) {
      updateData.omniwalletSubdomain = data.subdomain;
    }
    if (data.apiToken) {
      updateData.omniwalletApiToken = data.apiToken;
    }
    if (data.webhookSecret) {
      updateData.omniwalletWebhookSecret = data.webhookSecret;
    }
    if (data.isEnabled !== undefined) {
      updateData.isEnabled = data.isEnabled;
    }

    if (existingConfig) {
      await prisma.zancadasConfig.update({
        where: { id: existingConfig.id },
        data: updateData,
      });
    } else {
      await prisma.zancadasConfig.create({
        data: {
          omniwalletSubdomain: data.subdomain || null,
          omniwalletApiToken: data.apiToken || null,
          omniwalletWebhookSecret: data.webhookSecret || null,
          isEnabled: data.isEnabled ?? false,
        },
      });
    }

    // Invalidar caché del servicio de Omniwallet
    omniwalletService.invalidateCache();

    logger.info('Zancadas config updated');
  }

  // =============================================
  // ACTIONS MANAGEMENT
  // =============================================

  /**
   * Obtiene una acción por su código
   */
  async getAction(actionCode: string) {
    return prisma.zancadasAction.findUnique({
      where: { actionCode },
    });
  }

  /**
   * Obtiene todas las acciones configuradas
   */
  async getAllActions() {
    return prisma.zancadasAction.findMany({
      orderBy: { actionCode: 'asc' },
    });
  }

  /**
   * Actualiza una acción
   */
  async updateAction(
    id: string,
    data: {
      points?: number;
      isEnabled?: boolean;
      maxPerDay?: number | null;
      maxPerUser?: number | null;
      triggerStatuses?: string[];
    }
  ) {
    return prisma.zancadasAction.update({
      where: { id },
      data: {
        points: data.points,
        isEnabled: data.isEnabled,
        maxPerDay: data.maxPerDay,
        maxPerUser: data.maxPerUser,
        triggerStatuses: data.triggerStatuses,
      },
    });
  }

  // =============================================
  // LIMITS VERIFICATION
  // =============================================

  /**
   * Verifica si un usuario ha alcanzado los límites de una acción
   */
  private async checkLimits(
    userId: string,
    actionId: string,
    maxPerDay: number | null,
    maxPerUser: number | null
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Verificar límite diario
    if (maxPerDay !== null) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCount = await prisma.zancadasTransaction.count({
        where: {
          userId,
          actionId,
          createdAt: { gte: today },
        },
      });

      if (todayCount >= maxPerDay) {
        return { allowed: false, reason: 'Límite diario alcanzado' };
      }
    }

    // Verificar límite total por usuario
    if (maxPerUser !== null) {
      const totalCount = await prisma.zancadasTransaction.count({
        where: { userId, actionId },
      });

      if (totalCount >= maxPerUser) {
        return { allowed: false, reason: 'Límite total alcanzado' };
      }
    }

    return { allowed: true };
  }

  /**
   * Verifica si ya existe una transacción para una referencia específica
   */
  private async hasExistingTransaction(
    userId: string,
    actionId: string,
    referenceType: string,
    referenceId: string
  ): Promise<boolean> {
    const existing = await prisma.zancadasTransaction.findFirst({
      where: {
        userId,
        actionId,
        referenceType,
        referenceId,
      },
    });
    return !!existing;
  }

  // =============================================
  // GRANT ZANCADAS (Core Function)
  // =============================================

  /**
   * Otorga Zancadas a un usuario por una acción
   */
  async grantZancadas(
    userId: string,
    actionCode: string,
    referenceType?: string,
    referenceId?: string
  ): Promise<GrantZancadasResult> {
    // Verificar si está habilitado
    if (!(await this.isEnabled())) {
      return { success: false, error: 'Sistema de Zancadas no habilitado' };
    }

    // Obtener la acción
    const action = await this.getAction(actionCode);
    if (!action) {
      return { success: false, error: `Acción no encontrada: ${actionCode}` };
    }

    if (!action.isEnabled) {
      return { success: false, error: 'Acción deshabilitada' };
    }

    if (action.points <= 0) {
      return { success: false, error: 'Acción sin puntos configurados' };
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Verificar si ya existe transacción para esta referencia
    if (referenceType && referenceId) {
      const exists = await this.hasExistingTransaction(userId, action.id, referenceType, referenceId);
      if (exists) {
        return { success: false, alreadyGranted: true, error: 'Zancadas ya otorgadas para esta acción' };
      }
    }

    // Verificar límites
    const limitsCheck = await this.checkLimits(userId, action.id, action.maxPerDay, action.maxPerUser);
    if (!limitsCheck.allowed) {
      return { success: false, error: limitsCheck.reason };
    }

    // Generar ID único para la transacción
    const externalId = `wwtrail_${actionCode.toLowerCase()}_${uuidv4()}`;

    // Intentar sincronizar con Omniwallet
    let omniwalletSynced = false;
    let omniwalletError: string | null = null;

    if (user.email) {
      try {
        omniwalletSynced = await omniwalletService.addPoints({
          email: user.email,
          points: action.points,
          type: `WWTRAIL - ${action.actionName}`,
          externalId,
          content: {
            action_code: actionCode,
            reference_type: referenceType,
            reference_id: referenceId,
            user_id: userId,
          },
        });
      } catch (error) {
        omniwalletError = error instanceof Error ? error.message : 'Error desconocido';
        logger.error(`Error syncing points to Omniwallet: ${omniwalletError}`);
      }
    }

    // Registrar transacción local
    await prisma.zancadasTransaction.create({
      data: {
        userId,
        actionId: action.id,
        points: action.points,
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        omniwalletSynced,
        omniwalletExternalId: externalId,
        omniwalletError,
      },
    });

    // Actualizar balance local del usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        zancadasBalance: { increment: action.points },
      },
      select: { zancadasBalance: true },
    });

    logger.info(
      `Zancadas granted: ${action.points} points to user ${userId} for ${actionCode} (synced: ${omniwalletSynced})`
    );

    return {
      success: true,
      points: action.points,
      totalBalance: updatedUser.zancadasBalance,
    };
  }

  // =============================================
  // EVENT HOOKS (Para integrar en otros servicios)
  // =============================================

  /**
   * Hook: Cuando un usuario se registra
   */
  async onUserRegistered(
    userId: string,
    userData: { email: string; name: string; lastName?: string }
  ): Promise<void> {
    if (!(await this.isEnabled())) return;

    // Crear/vincular cliente en Omniwallet
    try {
      const omniCustomer = await omniwalletService.createCustomer({
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName,
      });

      if (omniCustomer) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            omniwalletCustomerId: omniCustomer.id,
            omniwalletCardNumber: omniCustomer.attributes.card,
            omniwalletSyncedAt: new Date(),
          },
        });
        logger.info(`User ${userId} linked to Omniwallet: ${omniCustomer.id}`);
      }
    } catch (error) {
      logger.error(`Error creating Omniwallet customer for user ${userId}: ${error}`);
    }

    // Otorgar Zancadas de registro
    await this.grantZancadas(userId, 'REGISTER');
  }

  /**
   * Hook: Cuando un usuario inicia sesión
   */
  async onUserLoggedIn(userId: string): Promise<GrantZancadasResult> {
    return this.grantZancadas(userId, 'LOGIN');
  }

  /**
   * Hook: Cuando un usuario crea una valoración
   */
  async onRatingCreated(userId: string, editionId: string): Promise<GrantZancadasResult> {
    return this.grantZancadas(userId, 'RATING', 'EDITION', editionId);
  }

  /**
   * Hook: Cuando un usuario marca participación en una edición
   */
  async onParticipationMarked(
    userId: string,
    editionId: string,
    status: ParticipationStatus
  ): Promise<GrantZancadasResult> {
    // Obtener la acción de participación
    const action = await this.getAction('PARTICIPATION');
    if (!action || !action.isEnabled) {
      return { success: false, error: 'Acción de participación no disponible' };
    }

    // Verificar si el estado actual activa puntos
    const triggerStatuses = (action.triggerStatuses as string[]) || [];
    if (!triggerStatuses.includes(status)) {
      return { success: false, error: `Estado ${status} no otorga puntos` };
    }

    return this.grantZancadas(userId, 'PARTICIPATION', 'EDITION', editionId);
  }

  // =============================================
  // USER QUERIES
  // =============================================

  /**
   * Obtiene el balance del usuario (local y de Omniwallet)
   */
  async getUserBalance(userId: string): Promise<UserBalance> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { zancadasBalance: true, email: true },
    });

    let omniwalletBalance: number | null = null;
    if (user?.email) {
      try {
        omniwalletBalance = await omniwalletService.getBalance(user.email);
      } catch (error) {
        logger.error(`Error fetching Omniwallet balance for user ${userId}: ${error}`);
      }
    }

    return {
      local: user?.zancadasBalance ?? 0,
      omniwallet: omniwalletBalance,
      synced: omniwalletBalance !== null && user?.zancadasBalance === omniwalletBalance,
    };
  }

  /**
   * Obtiene el historial de transacciones del usuario
   */
  async getUserTransactions(
    userId: string,
    page = 1,
    pageSize = 20
  ): Promise<{
    data: TransactionWithAction[];
    meta: { page: number; pageSize: number; total: number; totalPages: number };
  }> {
    const skip = (page - 1) * pageSize;

    const [transactions, total] = await Promise.all([
      prisma.zancadasTransaction.findMany({
        where: { userId },
        include: {
          action: {
            select: { actionName: true, actionCode: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize,
      }),
      prisma.zancadasTransaction.count({ where: { userId } }),
    ]);

    return {
      data: transactions,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  /**
   * Sincroniza el balance local con Omniwallet
   */
  async syncBalance(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) return;

    try {
      const omniBalance = await omniwalletService.getBalance(user.email);
      if (omniBalance !== null) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            zancadasBalance: omniBalance,
            omniwalletSyncedAt: new Date(),
          },
        });
        logger.info(`Balance synced for user ${userId}: ${omniBalance}`);
      }
    } catch (error) {
      logger.error(`Error syncing balance for user ${userId}: ${error}`);
    }
  }

  // =============================================
  // ADMIN STATISTICS
  // =============================================

  /**
   * Obtiene estadísticas generales de Zancadas
   */
  async getStats(): Promise<{
    totalTransactions: number;
    totalPointsAwarded: number;
    usersWithPoints: number;
    transactionsByAction: { actionCode: string; actionName: string; count: number; points: number }[];
  }> {
    const [totalTransactions, totalPoints, usersWithPoints, actionStats] = await Promise.all([
      prisma.zancadasTransaction.count(),
      prisma.zancadasTransaction.aggregate({
        _sum: { points: true },
      }),
      prisma.user.count({
        where: { zancadasBalance: { gt: 0 } },
      }),
      prisma.zancadasTransaction.groupBy({
        by: ['actionId'],
        _count: { id: true },
        _sum: { points: true },
      }),
    ]);

    // Obtener nombres de acciones
    const actions = await prisma.zancadasAction.findMany({
      select: { id: true, actionCode: true, actionName: true },
    });

    const actionMap = new Map(actions.map((a) => [a.id, a]));

    const transactionsByAction = actionStats.map((stat) => {
      const action = actionMap.get(stat.actionId);
      return {
        actionCode: action?.actionCode || 'UNKNOWN',
        actionName: action?.actionName || 'Desconocida',
        count: stat._count.id,
        points: stat._sum.points || 0,
      };
    });

    return {
      totalTransactions,
      totalPointsAwarded: totalPoints._sum.points || 0,
      usersWithPoints,
      transactionsByAction,
    };
  }

  // =============================================
  // RETRY FAILED SYNCS
  // =============================================

  /**
   * Reintenta sincronizar transacciones fallidas con Omniwallet
   */
  async retryFailedSyncs(limit = 50): Promise<{ processed: number; synced: number }> {
    const failedTransactions = await prisma.zancadasTransaction.findMany({
      where: { omniwalletSynced: false },
      include: {
        user: { select: { email: true } },
        action: { select: { actionName: true, actionCode: true } },
      },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });

    let synced = 0;

    for (const tx of failedTransactions) {
      if (!tx.user.email || !tx.omniwalletExternalId) continue;

      try {
        const success = await omniwalletService.addPoints({
          email: tx.user.email,
          points: tx.points,
          type: `WWTRAIL - ${tx.action.actionName}`,
          externalId: tx.omniwalletExternalId,
          content: {
            action_code: tx.action.actionCode,
            reference_type: tx.referenceType,
            reference_id: tx.referenceId,
            user_id: tx.userId,
            retry: true,
          },
        });

        if (success) {
          await prisma.zancadasTransaction.update({
            where: { id: tx.id },
            data: { omniwalletSynced: true, omniwalletError: null },
          });
          synced++;
        }
      } catch (error) {
        await prisma.zancadasTransaction.update({
          where: { id: tx.id },
          data: { omniwalletError: error instanceof Error ? error.message : 'Retry failed' },
        });
      }
    }

    logger.info(`Retry failed syncs: ${synced}/${failedTransactions.length} synced`);
    return { processed: failedTransactions.length, synced };
  }
}

// Exportar instancia singleton
export const zancadasService = new ZancadasService();

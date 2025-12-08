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
          userName: user.firstName || undefined,
          userLastName: user.lastName || undefined,
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
    recentTransactions: {
      id: string;
      points: number;
      createdAt: Date;
      actionName: string;
      actionCode: string;
      userName: string;
      userEmail: string;
    }[];
  }> {
    const [totalTransactions, totalPoints, usersWithPoints, actionStats, recentTransactions] = await Promise.all([
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
      prisma.zancadasTransaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          action: { select: { actionName: true, actionCode: true } },
          user: { select: { firstName: true, lastName: true, email: true, username: true } },
        },
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
      recentTransactions: recentTransactions.map((tx) => ({
        id: tx.id,
        points: tx.points,
        createdAt: tx.createdAt,
        actionName: tx.action.actionName,
        actionCode: tx.action.actionCode,
        userName: tx.user.firstName
          ? `${tx.user.firstName} ${tx.user.lastName || ''}`.trim()
          : tx.user.username,
        userEmail: tx.user.email,
      })),
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
        user: { select: { email: true, firstName: true, lastName: true } },
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
          userName: tx.user.firstName || undefined,
          userLastName: tx.user.lastName || undefined,
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

  // =============================================
  // EQUIVALENT COMPETITION
  // =============================================

  // Constantes de conversión
  // 1 zancada = 1.5 metros horizontales
  // 1 zancada = 0.3 metros de desnivel vertical
  static readonly METERS_PER_ZANCADA = 1.5;
  static readonly ELEVATION_METERS_PER_ZANCADA = 0.3;
  static readonly SCALE_MULTIPLIER = 10; // Usuario siempre al ~10% de la escala
  static readonly COMPETITIONS_PER_SCALE = 5;

  /**
   * Convierte zancadas a kilómetros
   */
  zancadasToKm(zancadas: number): number {
    return (zancadas * ZancadasService.METERS_PER_ZANCADA) / 1000;
  }

  /**
   * Convierte zancadas a metros de desnivel
   */
  zancadasToElevation(zancadas: number): number {
    return zancadas * ZancadasService.ELEVATION_METERS_PER_ZANCADA;
  }

  /**
   * Encuentra competiciones para mostrar en una escala de progreso
   * La escala es valor_usuario × 10, con 5 competiciones distribuidas
   */
  async getEquivalentCompetitions(zancadas: number): Promise<{
    equivalentKm: number;
    equivalentElevation: number;
    distanceScale: {
      userValue: number;
      maxScale: number;
      userProgress: number;
      competitions: Array<{
        id: string;
        name: string;
        slug: string;
        baseDistance: number;
        baseElevation: number | null;
        position: number; // % en la escala
        isCompleted: boolean;
        event: { slug: string; name: string };
      }>;
    };
    elevationScale: {
      userValue: number;
      maxScale: number;
      userProgress: number;
      competitions: Array<{
        id: string;
        name: string;
        slug: string;
        baseDistance: number;
        baseElevation: number | null;
        position: number;
        isCompleted: boolean;
        event: { slug: string; name: string };
      }>;
    };
  }> {
    const equivalentKm = this.zancadasToKm(zancadas);
    const equivalentElevation = this.zancadasToElevation(zancadas);

    // Calcular escalas (valor × 10, mínimo 10km / 1000m)
    const distanceMaxScale = Math.max(10, equivalentKm * ZancadasService.SCALE_MULTIPLIER);
    const elevationMaxScale = Math.max(1000, equivalentElevation * ZancadasService.SCALE_MULTIPLIER);

    // Buscar competiciones para cada escala
    const distanceCompetitions = await this.findCompetitionsForDistanceScale(distanceMaxScale, equivalentKm);
    const elevationCompetitions = await this.findCompetitionsForElevationScale(elevationMaxScale, equivalentElevation);

    return {
      equivalentKm: Math.round(equivalentKm * 100) / 100,
      equivalentElevation: Math.round(equivalentElevation),
      distanceScale: {
        userValue: Math.round(equivalentKm * 100) / 100,
        maxScale: Math.round(distanceMaxScale * 10) / 10,
        userProgress: Math.round((equivalentKm / distanceMaxScale) * 1000) / 10,
        competitions: distanceCompetitions,
      },
      elevationScale: {
        userValue: Math.round(equivalentElevation),
        maxScale: Math.round(elevationMaxScale),
        userProgress: Math.round((equivalentElevation / elevationMaxScale) * 1000) / 10,
        competitions: elevationCompetitions,
      },
    };
  }

  /**
   * Busca competiciones distribuidas en la escala de distancia
   */
  private async findCompetitionsForDistanceScale(
    maxScale: number,
    userKm: number
  ): Promise<Array<{
    id: string;
    name: string;
    slug: string;
    baseDistance: number;
    baseElevation: number | null;
    position: number;
    isCompleted: boolean;
    event: { slug: string; name: string };
  }>> {
    // Buscar competiciones con distancia dentro de la escala
    const competitions = await prisma.competition.findMany({
      where: {
        baseDistance: { gt: 0, lte: maxScale },
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        baseDistance: true,
        baseElevation: true,
        featured: true,
        event: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
      orderBy: { baseDistance: 'asc' },
    });

    if (competitions.length === 0) return [];

    // Seleccionar 5 competiciones bien distribuidas
    const selected = this.selectDistributedCompetitions(
      competitions,
      ZancadasService.COMPETITIONS_PER_SCALE,
      (c) => c.baseDistance || 0
    );

    return selected.map((comp) => ({
      id: comp.id,
      name: comp.name,
      slug: comp.slug,
      baseDistance: comp.baseDistance || 0,
      baseElevation: comp.baseElevation,
      position: Math.round(((comp.baseDistance || 0) / maxScale) * 1000) / 10,
      isCompleted: userKm >= (comp.baseDistance || 0),
      event: comp.event,
    }));
  }

  /**
   * Busca competiciones distribuidas en la escala de desnivel
   */
  private async findCompetitionsForElevationScale(
    maxScale: number,
    userElevation: number
  ): Promise<Array<{
    id: string;
    name: string;
    slug: string;
    baseDistance: number;
    baseElevation: number | null;
    position: number;
    isCompleted: boolean;
    event: { slug: string; name: string };
  }>> {
    // Buscar competiciones con desnivel dentro de la escala
    const competitions = await prisma.competition.findMany({
      where: {
        baseElevation: { gt: 0, lte: maxScale },
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        baseDistance: true,
        baseElevation: true,
        featured: true,
        event: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
      orderBy: { baseElevation: 'asc' },
    });

    if (competitions.length === 0) return [];

    // Seleccionar 5 competiciones bien distribuidas
    const selected = this.selectDistributedCompetitions(
      competitions,
      ZancadasService.COMPETITIONS_PER_SCALE,
      (c) => c.baseElevation || 0
    );

    return selected.map((comp) => ({
      id: comp.id,
      name: comp.name,
      slug: comp.slug,
      baseDistance: comp.baseDistance || 0,
      baseElevation: comp.baseElevation,
      position: Math.round(((comp.baseElevation || 0) / maxScale) * 1000) / 10,
      isCompleted: userElevation >= (comp.baseElevation || 0),
      event: comp.event,
    }));
  }

  /**
   * Selecciona N competiciones bien distribuidas de una lista ordenada
   * Prioriza featured y busca buena distribución en el rango
   */
  private selectDistributedCompetitions<T extends { featured: boolean }>(
    competitions: T[],
    count: number,
    getValue: (c: T) => number
  ): T[] {
    if (competitions.length <= count) {
      return competitions;
    }

    const selected: T[] = [];
    const minValue = getValue(competitions[0]);
    const maxValue = getValue(competitions[competitions.length - 1]);
    const range = maxValue - minValue;

    // Dividir en segmentos y seleccionar el mejor de cada uno
    for (let i = 0; i < count; i++) {
      const segmentStart = minValue + (range * i) / count;
      const segmentEnd = minValue + (range * (i + 1)) / count;

      // Encontrar competiciones en este segmento
      const inSegment = competitions.filter((c) => {
        const val = getValue(c);
        return val >= segmentStart && val < segmentEnd && !selected.includes(c);
      });

      if (inSegment.length > 0) {
        // Preferir featured, sino el primero del segmento
        const featured = inSegment.find((c) => c.featured);
        selected.push(featured || inSegment[0]);
      } else {
        // Si no hay en el segmento, buscar el más cercano no seleccionado
        const targetValue = (segmentStart + segmentEnd) / 2;
        const closest = competitions
          .filter((c) => !selected.includes(c))
          .sort((a, b) => Math.abs(getValue(a) - targetValue) - Math.abs(getValue(b) - targetValue))[0];
        if (closest) {
          selected.push(closest);
        }
      }
    }

    // Ordenar por valor
    return selected.sort((a, b) => getValue(a) - getValue(b));
  }

  /**
   * Busca la competición más cercana por distancia
   * Si el usuario tiene menos km, busca la más corta como objetivo
   */
  private async findClosestCompetitionByDistance(userKm: number): Promise<{
    id: string;
    name: string;
    slug: string;
    baseDistance: number;
    baseElevation: number | null;
    progress: number;
    event: {
      slug: string;
      name: string;
    };
  } | null> {
    // Buscar competiciones con distancia válida
    const competitions = await prisma.competition.findMany({
      where: {
        baseDistance: { gt: 0 },
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        baseDistance: true,
        baseElevation: true,
        featured: true,
        event: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
      orderBy: { baseDistance: 'asc' },
    });

    if (competitions.length === 0) return null;

    // Encontrar la competición más cercana
    let closest = competitions[0];
    let minDiff = Math.abs((closest.baseDistance || 0) - userKm);

    for (const comp of competitions) {
      const diff = Math.abs((comp.baseDistance || 0) - userKm);
      // Preferir featured si la diferencia es similar (dentro del 20%)
      if (diff < minDiff || (diff <= minDiff * 1.2 && comp.featured && !closest.featured)) {
        closest = comp;
        minDiff = diff;
      }
    }

    // Si el usuario tiene menos que la competición más corta, usar esa como objetivo
    if (userKm < (competitions[0].baseDistance || 0)) {
      closest = competitions[0];
    }

    // Calcular progreso (limitado a 100%)
    const progress = closest.baseDistance
      ? Math.min(100, (userKm / closest.baseDistance) * 100)
      : 0;

    return {
      id: closest.id,
      name: closest.name,
      slug: closest.slug,
      baseDistance: closest.baseDistance,
      baseElevation: closest.baseElevation,
      progress: Math.round(progress * 10) / 10,
      event: closest.event,
    };
  }

  /**
   * Busca la competición más cercana por desnivel
   */
  private async findClosestCompetitionByElevation(userElevation: number): Promise<{
    id: string;
    name: string;
    slug: string;
    baseDistance: number;
    baseElevation: number | null;
    progress: number;
    event: {
      slug: string;
      name: string;
    };
  } | null> {
    // Buscar competiciones con desnivel válido
    const competitions = await prisma.competition.findMany({
      where: {
        baseElevation: { gt: 0 },
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        name: true,
        slug: true,
        baseDistance: true,
        baseElevation: true,
        featured: true,
        event: {
          select: {
            slug: true,
            name: true,
          },
        },
      },
      orderBy: { baseElevation: 'asc' },
    });

    if (competitions.length === 0) return null;

    // Encontrar la competición más cercana por desnivel
    let closest = competitions[0];
    let minDiff = Math.abs((closest.baseElevation || 0) - userElevation);

    for (const comp of competitions) {
      if (!comp.baseElevation) continue;
      const diff = Math.abs(comp.baseElevation - userElevation);
      // Preferir featured si la diferencia es similar (dentro del 20%)
      if (diff < minDiff || (diff <= minDiff * 1.2 && comp.featured && !closest.featured)) {
        closest = comp;
        minDiff = diff;
      }
    }

    // Si el usuario tiene menos que la competición con menos desnivel, usar esa como objetivo
    const lowestElevation = competitions[0];
    if (lowestElevation.baseElevation && userElevation < lowestElevation.baseElevation) {
      closest = lowestElevation;
    }

    // Calcular progreso (limitado a 100%)
    const progress = closest.baseElevation
      ? Math.min(100, (userElevation / closest.baseElevation) * 100)
      : 0;

    return {
      id: closest.id,
      name: closest.name,
      slug: closest.slug,
      baseDistance: closest.baseDistance,
      baseElevation: closest.baseElevation,
      progress: Math.round(progress * 10) / 10,
      event: closest.event,
    };
  }

  /**
   * @deprecated Use getEquivalentCompetitions instead
   * Mantener por compatibilidad - usa la nueva lógica internamente
   */
  async getEquivalentCompetition(zancadas: number): Promise<{
    id: string;
    name: string;
    slug: string;
    baseDistance: number;
    baseElevation: number | null;
    event: {
      slug: string;
      name: string;
    };
  } | null> {
    const result = await this.getEquivalentCompetitions(zancadas);
    return result.byDistance
      ? {
          id: result.byDistance.id,
          name: result.byDistance.name,
          slug: result.byDistance.slug,
          baseDistance: result.byDistance.baseDistance,
          baseElevation: result.byDistance.baseElevation,
          event: result.byDistance.event,
        }
      : null;
  }
}

// Exportar instancia singleton
export const zancadasService = new ZancadasService();

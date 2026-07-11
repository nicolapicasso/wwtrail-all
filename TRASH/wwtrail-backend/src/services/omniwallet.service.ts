import axios, { AxiosInstance, AxiosError } from 'axios';
import crypto from 'crypto';
import prisma from '../config/database';
import logger from '../utils/logger';

// =============================================
// INTERFACES
// =============================================

interface OmniwalletConfig {
  subdomain: string;
  apiToken: string;
  webhookSecret: string;
  baseUrl: string;
}

interface CreateCustomerData {
  email: string;
  name: string;
  lastName?: string;
  phone?: string;
}

interface AddPointsData {
  email: string;
  points: number;
  type: string;
  externalId: string;
  content?: Record<string, unknown>;
  // Datos opcionales del usuario para crear cliente si no existe
  userName?: string;
  userLastName?: string;
}

interface CustomerAttributes {
  name: string;
  last_name: string;
  email: string;
  card: string;
  phone: string;
  points: number;
  level: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerLinks {
  downloadGoogleWallet?: string;
  downloadPassApple?: string;
  downloadPassAndroid?: string;
}

interface CustomerResponse {
  id: string;
  type: string;
  attributes: CustomerAttributes;
  links?: CustomerLinks;
}

interface TransactionAttributes {
  external_id: string;
  order_id: string;
  action: string;
  type: string;
  points: number;
  amount: number | null;
  exchange: number | null;
  total_points: number;
  created_at: string;
}

interface TransactionResponse {
  id: string;
  type: string;
  attributes: TransactionAttributes;
}

// =============================================
// OMNIWALLET SERVICE
// =============================================

class OmniwalletService {
  private client: AxiosInstance | null = null;
  private config: OmniwalletConfig | null = null;
  private configLoaded = false;

  /**
   * Obtiene la configuración de Omniwallet desde la base de datos
   */
  private async getConfig(): Promise<OmniwalletConfig | null> {
    const configRecord = await prisma.zancadasConfig.findFirst();

    if (!configRecord || !configRecord.isEnabled) {
      return null;
    }

    if (!configRecord.omniwalletSubdomain || !configRecord.omniwalletApiToken) {
      logger.warn('Omniwallet config incomplete: missing subdomain or token');
      return null;
    }

    return {
      subdomain: configRecord.omniwalletSubdomain,
      apiToken: configRecord.omniwalletApiToken,
      webhookSecret: configRecord.omniwalletWebhookSecret || '',
      baseUrl: 'https://api.omniwallet.cloud/v1',
    };
  }

  /**
   * Obtiene o crea el cliente HTTP configurado
   */
  private async getClient(): Promise<AxiosInstance | null> {
    // Recargar configuración si no está cargada
    if (!this.configLoaded) {
      const config = await this.getConfig();
      if (!config) {
        this.configLoaded = true;
        return null;
      }

      this.config = config;
      this.client = axios.create({
        baseURL: config.baseUrl,
        timeout: 10000, // 10 segundos
        headers: {
          Accept: 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          Authorization: `Bearer ${config.apiToken}`,
          'X-Omniwallet-Account': config.subdomain,
        },
      });

      this.configLoaded = true;
    }

    return this.client;
  }

  /**
   * Invalida el caché de configuración (llamar cuando se actualiza config)
   */
  invalidateCache(): void {
    this.client = null;
    this.config = null;
    this.configLoaded = false;
    logger.info('Omniwallet config cache invalidated');
  }

  /**
   * Verifica si Omniwallet está habilitado y configurado
   */
  async isEnabled(): Promise<boolean> {
    const client = await this.getClient();
    return client !== null;
  }

  /**
   * Prueba la conexión con Omniwallet
   */
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const client = await this.getClient();
      if (!client) {
        return { success: false, error: 'Omniwallet no está configurado o habilitado' };
      }

      // Intentar obtener settings para verificar conexión
      await client.get('/settings/POINTS_VALUE');
      logger.info('Omniwallet connection test successful');
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
      logger.error(`Omniwallet connection test failed: ${errorMessage}`);
      return { success: false, error: errorMessage };
    }
  }

  // =============================================
  // CUSTOMER OPERATIONS
  // =============================================

  /**
   * Crea un nuevo cliente en Omniwallet
   */
  async createCustomer(data: CreateCustomerData): Promise<CustomerResponse | null> {
    try {
      const client = await this.getClient();
      if (!client) {
        logger.warn('Cannot create customer: Omniwallet not configured');
        return null;
      }

      const response = await client.post('/customers', {
        data: {
          type: 'customers',
          attributes: {
            email: data.email,
            name: data.name,
            last_name: data.lastName || '',
            phone: data.phone || '',
          },
        },
      });

      logger.info(`Omniwallet customer created: ${data.email}`);
      return response.data.data as CustomerResponse;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string; errors?: unknown[] }>;

      // Si el cliente ya existe (409 Conflict), intentar obtenerlo
      if (axiosError.response?.status === 409) {
        logger.info(`Customer already exists in Omniwallet: ${data.email}`);
        return this.getCustomer(data.email);
      }

      logger.error(
        `Error creating Omniwallet customer: ${axiosError.response?.data?.message || axiosError.message}`
      );
      throw error;
    }
  }

  /**
   * Obtiene datos de un cliente por email
   */
  async getCustomer(email: string): Promise<CustomerResponse | null> {
    try {
      const client = await this.getClient();
      if (!client) return null;

      const response = await client.get(`/customers/${encodeURIComponent(email)}`);
      return response.data.data as CustomerResponse;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Obtiene el balance de puntos de un cliente
   */
  async getBalance(email: string): Promise<number | null> {
    const customer = await this.getCustomer(email);
    return customer?.attributes.points ?? null;
  }

  /**
   * Actualiza datos de un cliente
   */
  async updateCustomer(
    email: string,
    data: Partial<{ name: string; lastName: string; phone: string }>
  ): Promise<CustomerResponse | null> {
    try {
      const client = await this.getClient();
      if (!client) return null;

      const response = await client.patch(`/customers/${encodeURIComponent(email)}`, {
        data: {
          type: 'customers',
          id: email,
          attributes: {
            name: data.name,
            last_name: data.lastName,
            phone: data.phone,
          },
        },
      });

      logger.info(`Omniwallet customer updated: ${email}`);
      return response.data.data as CustomerResponse;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      logger.error(
        `Error updating Omniwallet customer: ${axiosError.response?.data?.message || axiosError.message}`
      );
      throw error;
    }
  }

  // =============================================
  // POINTS OPERATIONS
  // =============================================

  /**
   * Suma puntos a un cliente
   * Si el cliente no existe, lo crea automáticamente
   */
  async addPoints(data: AddPointsData): Promise<boolean> {
    try {
      const client = await this.getClient();
      if (!client) {
        logger.warn('Cannot add points: Omniwallet not configured');
        return false;
      }

      // Intentar añadir puntos
      try {
        await client.post(`/customers/${encodeURIComponent(data.email)}/add-points`, {
          points: data.points,
          type: data.type,
          external_id: data.externalId,
          content: data.content || {},
        });

        logger.info(`Omniwallet points added: ${data.points} to ${data.email} (${data.type})`);
        return true;
      } catch (error) {
        const axiosError = error as AxiosError;

        // Si el cliente no existe (404), crearlo y reintentar
        if (axiosError.response?.status === 404) {
          logger.info(`Customer not found in Omniwallet, creating: ${data.email}`);

          // Crear el cliente con datos del usuario si están disponibles
          const customer = await this.createCustomer({
            email: data.email,
            name: data.userName || data.email.split('@')[0],
            lastName: data.userLastName,
          });

          if (!customer) {
            logger.error(`Failed to create customer in Omniwallet: ${data.email}`);
            return false;
          }

          // Reintentar añadir puntos
          await client.post(`/customers/${encodeURIComponent(data.email)}/add-points`, {
            points: data.points,
            type: data.type,
            external_id: data.externalId,
            content: data.content || {},
          });

          logger.info(`Omniwallet points added after creating customer: ${data.points} to ${data.email} (${data.type})`);
          return true;
        }

        throw error;
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      logger.error(
        `Error adding points in Omniwallet: ${axiosError.response?.data?.message || axiosError.message}`
      );
      return false;
    }
  }

  /**
   * Resta puntos a un cliente
   */
  async subtractPoints(data: AddPointsData): Promise<boolean> {
    try {
      const client = await this.getClient();
      if (!client) {
        logger.warn('Cannot subtract points: Omniwallet not configured');
        return false;
      }

      await client.post(`/customers/${encodeURIComponent(data.email)}/subtract-points`, {
        points: data.points,
        type: data.type,
        external_id: data.externalId,
        content: data.content || {},
      });

      logger.info(`Omniwallet points subtracted: ${data.points} from ${data.email} (${data.type})`);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      logger.error(
        `Error subtracting points in Omniwallet: ${axiosError.response?.data?.message || axiosError.message}`
      );
      return false;
    }
  }

  // =============================================
  // TRANSACTIONS
  // =============================================

  /**
   * Obtiene las transacciones de un cliente
   */
  async getTransactions(
    email: string,
    page = 1,
    pageSize = 20
  ): Promise<{ data: TransactionResponse[]; meta: unknown } | null> {
    try {
      const client = await this.getClient();
      if (!client) return null;

      const response = await client.get(`/customers/${encodeURIComponent(email)}/transactions`, {
        params: {
          'page[number]': page,
          'page[size]': pageSize,
          sort: '-created_at',
        },
      });

      return {
        data: response.data.data as TransactionResponse[],
        meta: response.data.meta,
      };
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      logger.error(
        `Error fetching Omniwallet transactions: ${axiosError.response?.data?.message || axiosError.message}`
      );
      return null;
    }
  }

  // =============================================
  // WEBHOOK VALIDATION
  // =============================================

  /**
   * Valida la firma de un webhook de Omniwallet
   */
  validateWebhookSignature(body: string, timestamp: string, signature: string): boolean {
    if (!this.config?.webhookSecret) {
      logger.warn('Cannot validate webhook: no webhook secret configured');
      return false;
    }

    // Verificar que el timestamp no sea muy antiguo (5 minutos de tolerancia)
    const hookTime = parseInt(timestamp, 10);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - hookTime) > 300) {
      logger.warn('Webhook timestamp too old or in future');
      return false;
    }

    // Construir string a firmar
    const stringToSign = `${timestamp}.${body}`;

    // Calcular firma esperada
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(stringToSign)
      .digest('hex');

    // Comparar firmas de forma segura (timing-safe)
    try {
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  }

  /**
   * Registra un webhook recibido para idempotencia
   */
  async registerWebhook(hookId: string, event: string, payload: unknown): Promise<boolean> {
    try {
      // Verificar si ya fue procesado
      const existing = await prisma.zancadasWebhook.findUnique({
        where: { hookId },
      });

      if (existing) {
        logger.info(`Webhook already processed: ${hookId}`);
        return false; // Ya procesado
      }

      // Registrar webhook
      await prisma.zancadasWebhook.create({
        data: {
          hookId,
          event,
          payload: payload as object,
        },
      });

      logger.info(`Webhook registered: ${hookId} (${event})`);
      return true; // Nuevo, procesar
    } catch (error) {
      logger.error(`Error registering webhook: ${error}`);
      return false;
    }
  }
}

// Exportar instancia singleton
export const omniwalletService = new OmniwalletService();

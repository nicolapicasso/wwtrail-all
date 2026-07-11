# WWTRAIL - Integración con Omniwallet (Sistema de Zancadas)
## Especificaciones Técnicas Completas para Claude Code

---

## 📋 RESUMEN EJECUTIVO

### Objetivo
Integrar WWTRAIL con Omniwallet para implementar un sistema de puntos de fidelización llamado "Zancadas" que recompense a los usuarios por sus interacciones en la plataforma.

### Funcionalidades Requeridas
1. ✅ Mostrar balance de Zancadas en el perfil de usuario
2. ✅ Sumar Zancadas al valorar una competición
3. ✅ Sumar Zancadas al marcar una competición como completada
4. ✅ Registrar usuario en Omniwallet al darse de alta en WWTRAIL
5. ✅ Panel de administración para configurar acciones y puntos
6. ✅ Panel de administración para configurar conexión con Omniwallet (token + webhooks)

---

## 🔐 AUTENTICACIÓN OMNIWALLET API

### Base URL
```
https://api.omniwallet.cloud/v1
```

### Headers Requeridos (TODOS los requests)
```http
Accept: application/vnd.api+json
Content-Type: application/vnd.api+json
Authorization: Bearer {API_TOKEN}
X-Omniwallet-Account: {SUBDOMAIN}
```

### Obtención del Token
1. Acceder al panel de administración de Omniwallet
2. Ir a **Integraciones > API Keys**
3. Click en "Crear nuevo token"
4. Guardar el token generado de forma segura

---

## 📡 API OMNIWALLET - ENDPOINTS COMPLETOS

### 🔹 CUSTOMERS (Clientes/Usuarios)

#### 1. Listar Clientes
```http
GET /v1/customers
```

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `page[size]` | integer | Resultados por página (default: 15) |
| `page[number]` | integer | Número de página |
| `sort` | string | Ordenar: `name`, `email`, `last_name`, `points`, `createdAt`, `updatedAt`. Prefijo `-` para DESC |
| `filter[createdAt]` | string | Filtrar por fecha (formato: `yyyy-mm-dd%`) |

**Response (200):**
```json
{
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 10,
      "perPage": 15,
      "to": 15,
      "total": 150
    }
  },
  "links": {
    "first": "/v1/customers?page[number]=1",
    "last": "/v1/customers?page[number]=10",
    "next": "/v1/customers?page[number]=2"
  },
  "data": [
    {
      "type": "customers",
      "id": "usuario@ejemplo.com",
      "attributes": {
        "name": "string",
        "last_name": "string",
        "email": "string",
        "card": "string",
        "phone": "string",
        "points": 150,
        "level": "Gold",
        "updatedAt": "datetime",
        "createdAt": "datetime"
      }
    }
  ]
}
```

---

#### 2. Crear Cliente ⭐ (Usar en registro de WWTRAIL)
```http
POST /v1/customers
```

**Request Body:**
```json
{
  "data": {
    "type": "customers",
    "attributes": {
      "name": "string (required)",
      "last_name": "string (optional)",
      "email": "string (required)",
      "phone": "string (optional)",
      "card": "string (auto-generated if not provided)",
      "points": 0,
      "level": "string (optional)"
    }
  }
}
```

**Response (201):**
```json
{
  "data": {
    "type": "customers",
    "id": "usuario@ejemplo.com",
    "attributes": {
      "name": "Juan",
      "last_name": "Pérez",
      "email": "usuario@ejemplo.com",
      "card": "1234567890",
      "phone": "+34600000000",
      "points": 0,
      "level": "Bronze",
      "updatedAt": "2025-12-07T10:00:00Z",
      "createdAt": "2025-12-07T10:00:00Z"
    },
    "relationships": {
      "transactions": {
        "links": {
          "related": "/v1/customers/usuario@ejemplo.com/transactions"
        }
      }
    },
    "links": {
      "self": "/v1/customers/usuario@ejemplo.com",
      "add-points": "/v1/customers/usuario@ejemplo.com/add-points",
      "subtract-points": "/v1/customers/usuario@ejemplo.com/subtract-points",
      "downloadGoogleWallet": "https://...",
      "downloadPassApple": "https://...",
      "downloadPassAndroid": "https://..."
    }
  }
}
```

---

#### 3. Obtener Datos de Cliente ⭐ (Usar para mostrar balance)
```http
GET /v1/customers/:customer_email
```

**Response (200):**
```json
{
  "data": {
    "type": "customers",
    "id": "usuario@ejemplo.com",
    "attributes": {
      "name": "Juan",
      "last_name": "Pérez",
      "card": "1234567890",
      "email": "usuario@ejemplo.com",
      "phone": "+34600000000",
      "points": 350,
      "birthday": "1990-05-15",
      "updatedAt": "2025-12-07T10:00:00Z",
      "createdAt": "2025-01-15T08:30:00Z",
      "level": "Gold"
    },
    "links": {
      "add-points": "/v1/customers/usuario@ejemplo.com/add-points",
      "subtract-points": "/v1/customers/usuario@ejemplo.com/subtract-points",
      "downloadGoogleWallet": "https://...",
      "downloadPassApple": "https://...",
      "downloadPassAndroid": "https://..."
    }
  }
}
```

---

#### 4. Actualizar Cliente
```http
PATCH /v1/customers/:customer_email
```

**Request Body:**
```json
{
  "data": {
    "type": "customers",
    "id": "usuario@ejemplo.com",
    "attributes": {
      "name": "string",
      "last_name": "string",
      "phone": "string",
      "level": "string"
    }
  }
}
```

---

#### 5. Eliminar Cliente
```http
DELETE /v1/customers/:customer_email
```

**Response:** `204 No Content`

---

#### 6. Sumar Puntos ⭐ (Usar para Zancadas)
```http
POST /v1/customers/:email/add-points
```

**Request Body:**
```json
{
  "points": 50,
  "type": "WWTRAIL - Valoración de competición",
  "external_id": "wwtrail_review_abc123",
  "order_id": "review_abc123",
  "content": {
    "competition_id": "uuid-competition",
    "competition_name": "UTMB 171K",
    "action": "REVIEW_COMPETITION"
  }
}
```

**Campos:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `points` | integer | ✅ | Cantidad de puntos a sumar |
| `type` | string | ✅ | Identificador del tipo de acción (max 255 chars) |
| `external_id` | string | ❌ | ID único de la transacción en WWTRAIL (max 255 chars) |
| `order_id` | string | ❌ | ID de orden/referencia (default: external_id) |
| `content` | object | ❌ | Metadata personalizada |

**Response (200):** Retorna el objeto customer actualizado con el nuevo balance.

---

#### 7. Restar Puntos
```http
POST /v1/customers/:email/subtract-points
```

**Request Body:** (mismo formato que add-points)
```json
{
  "points": 100,
  "type": "WWTRAIL - Canje de recompensa",
  "external_id": "wwtrail_redeem_xyz789"
}
```

---

#### 8. Sumar Puntos desde Valor Monetario
```http
POST /v1/customers/:email/add-points-from-value
```

**Request Body:**
```json
{
  "value": 25.50,
  "type": "WWTRAIL - Compra",
  "external_id": "wwtrail_purchase_123",
  "items": ["SKU001", "SKU002"],
  "metadata": {
    "order_total": 25.50,
    "currency": "EUR"
  },
  "source": "ONLINE_PURCHASE"
}
```

**Source values:** `OFFLINE_PURCHASE`, `ONLINE_PURCHASE`, `BACKOFFICE`, `CATALOG_ORDER`, `POINTS_EXCHANGE`, `ACTIONS`, `GAME`, `REFERRAL`, `COUPONS`, `CANCELLATION`, `REVIEWS`

---

#### 9. Obtener Transacciones del Cliente
```http
GET /v1/customers/:customer_email/transactions
```

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `page[size]` | integer | Resultados por página |
| `page[number]` | integer | Número de página |
| `sort` | string | `-created_at`, `points`, `type`, etc. |
| `filter[order_id]` | string | Filtrar por order_id |
| `filter[type]` | string | Filtrar por tipo |

**Response:**
```json
{
  "data": [
    {
      "type": "transactions",
      "id": "5935",
      "attributes": {
        "external_id": "wwtrail_review_abc123",
        "order_id": "review_abc123",
        "action": "addition",
        "type": "WWTRAIL - Valoración de competición",
        "points": 50,
        "amount": null,
        "exchange": null,
        "total_points": 350,
        "created_at": "2025-12-07 10:30:00"
      }
    }
  ]
}
```

---

#### 10. Generar Token de Cliente
```http
POST /v1/customers/token
```

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "expiration_minutes": 60
}
```

**Response:**
```json
{
  "type": "auth_token",
  "email": "usuario@ejemplo.com",
  "expires_at": "2025-12-07T11:30:00Z",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 🔹 SETTINGS (Configuración)

#### Obtener Configuración
```http
GET /v1/settings
GET /v1/settings/:setting_key
```

**Setting Keys comunes:**
- `POINTS_VALUE` - Valor del punto
- Otros según configuración de la cuenta

---

### 🔹 TRANSACTIONS

#### Obtener Transacción por ID
```http
GET /v1/transactions/:transaction_id
```

#### Gestionar Delay de Transacción
```http
POST /v1/transactions/:transaction_id/delay
```

**Request Body:**
```json
{
  "action": "apply | cancel"
}
```

---

## 🔔 WEBHOOKS

### Configuración
Los webhooks se configuran en el panel de Omniwallet:
1. Ir a configuración de webhooks
2. Especificar URL de tu servidor
3. Seleccionar eventos a suscribir
4. Obtener el Secret Key para validación

### Eventos Disponibles
- `customer.created` - Nuevo cliente registrado
- `customer.updated` - Cliente actualizado
- `points.added` - Puntos añadidos
- `points.subtracted` - Puntos restados
- `order.created` - Nueva orden
- `order.updated` - Orden actualizada

### Payload (Skinny Payload)
```json
{
  "event": "customer.created",
  "data": {
    "customer_id": "usuario@ejemplo.com"
  }
}
```

### Headers de Seguridad
| Header | Descripción |
|--------|-------------|
| `X-Omniwallet-Signature` | Firma HMAC SHA-256 |
| `X-Omniwallet-Timestamp` | Timestamp del envío |
| `X-Omniwallet-Hook-Id` | ID único del webhook (para idempotencia) |

### Validación de Firma
```typescript
import crypto from 'crypto';

function validateWebhookSignature(
  requestBody: string,
  timestamp: string,
  signature: string,
  secretKey: string
): boolean {
  // Verificar que timestamp no sea muy antiguo (5 min tolerance)
  const hookTime = parseInt(timestamp);
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - hookTime) > 300) {
    return false;
  }
  
  // Construir string a firmar
  const stringToSign = `${timestamp}.${requestBody}`;
  
  // Calcular firma esperada
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(stringToSign)
    .digest('hex');
  
  // Comparar firmas de forma segura
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### Manejo de Retries
- Responder con `2XX` para confirmar recepción
- Si no `2XX`, Omniwallet reintenta hasta 24 horas
- Usar `X-Omniwallet-Hook-Id` para evitar procesamiento duplicado

---

## 🏗️ ARQUITECTURA PROPUESTA PARA WWTRAIL

### 1. Nuevas Tablas de Base de Datos (Prisma Schema)

```prisma
// prisma/schema.prisma

// Configuración global de Omniwallet
model ZancadasConfig {
  id                    String   @id @default(uuid())
  
  // Conexión Omniwallet
  omniwalletSubdomain   String?
  omniwalletApiToken    String?  // Encriptado
  omniwalletWebhookSecret String? // Encriptado
  isEnabled             Boolean  @default(false)
  
  // Timestamps
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  @@map("zancadas_config")
}

// Acciones configurables que otorgan Zancadas
model ZancadasAction {
  id            String   @id @default(uuid())
  actionCode    String   @unique  // 'REGISTER', 'REVIEW', 'COMPLETE_COMPETITION'
  actionName    String             // Nombre para mostrar
  description   String?
  points        Int      @default(0)
  isEnabled     Boolean  @default(true)
  maxPerDay     Int?               // Límite diario (null = sin límite)
  maxPerUser    Int?               // Límite total por usuario
  
  // Relaciones
  transactions  ZancadasTransaction[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@map("zancadas_actions")
}

// Registro de transacciones de Zancadas
model ZancadasTransaction {
  id                    String   @id @default(uuid())
  userId                String
  actionId              String
  points                Int
  
  // Referencia al objeto relacionado
  referenceType         String?  // 'COMPETITION', 'REVIEW', etc.
  referenceId           String?
  
  // Sincronización con Omniwallet
  omniwalletSynced      Boolean  @default(false)
  omniwalletExternalId  String?  @unique
  omniwalletError       String?
  
  // Relaciones
  user                  User     @relation(fields: [userId], references: [id])
  action                ZancadasAction @relation(fields: [actionId], references: [id])
  
  createdAt             DateTime @default(now())
  
  @@map("zancadas_transactions")
}

// Registro de webhooks recibidos (para idempotencia)
model ZancadasWebhook {
  id            String   @id @default(uuid())
  hookId        String   @unique  // X-Omniwallet-Hook-Id
  event         String
  payload       Json
  processedAt   DateTime @default(now())
  
  @@map("zancadas_webhooks")
}

// Extensión de User
model User {
  // ... campos existentes ...
  
  // Campos Omniwallet
  omniwalletCustomerId    String?  // Email en Omniwallet
  zancadasBalance         Int      @default(0)
  omniwalletSyncedAt      DateTime?
  omniwalletCardNumber    String?
  
  // Relaciones
  zancadasTransactions    ZancadasTransaction[]
}
```

### 2. Migración SQL Directa (alternativa)

```sql
-- Configuración global
CREATE TABLE zancadas_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  omniwallet_subdomain VARCHAR(100),
  omniwallet_api_token TEXT,
  omniwallet_webhook_secret TEXT,
  is_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Acciones configurables
CREATE TABLE zancadas_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_code VARCHAR(50) UNIQUE NOT NULL,
  action_name VARCHAR(100) NOT NULL,
  description TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  is_enabled BOOLEAN DEFAULT true,
  max_per_day INTEGER,
  max_per_user INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Datos iniciales
INSERT INTO zancadas_actions (action_code, action_name, description, points) VALUES
  ('REGISTER', 'Registro en WWTRAIL', 'Zancadas de bienvenida al registrarse', 100),
  ('REVIEW_COMPETITION', 'Valorar Competición', 'Zancadas por valorar una competición', 50),
  ('COMPLETE_COMPETITION', 'Completar Competición', 'Zancadas al marcar competición como completada', 100),
  ('FIRST_REVIEW', 'Primera Valoración', 'Bonus por primera valoración', 25);

-- Transacciones
CREATE TABLE zancadas_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  action_id UUID NOT NULL REFERENCES zancadas_actions(id),
  points INTEGER NOT NULL,
  reference_type VARCHAR(50),
  reference_id UUID,
  omniwallet_synced BOOLEAN DEFAULT false,
  omniwallet_external_id VARCHAR(100) UNIQUE,
  omniwallet_error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhooks recibidos
CREATE TABLE zancadas_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hook_id VARCHAR(100) UNIQUE NOT NULL,
  event VARCHAR(100) NOT NULL,
  payload JSONB,
  processed_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_zancadas_transactions_user ON zancadas_transactions(user_id);
CREATE INDEX idx_zancadas_transactions_action ON zancadas_transactions(action_id);
CREATE INDEX idx_zancadas_transactions_created ON zancadas_transactions(created_at DESC);

-- Extensión tabla users
ALTER TABLE users ADD COLUMN IF NOT EXISTS omniwallet_customer_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS zancadas_balance INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS omniwallet_synced_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS omniwallet_card_number VARCHAR(100);
```

---

### 3. Servicio Backend: `OmniwalletService`

```typescript
// src/services/omniwallet.service.ts

import axios, { AxiosInstance } from 'axios';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';

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
  content?: Record<string, any>;
}

interface CustomerResponse {
  id: string;
  attributes: {
    name: string;
    last_name: string;
    email: string;
    card: string;
    phone: string;
    points: number;
    level: string;
    createdAt: string;
    updatedAt: string;
  };
  links: {
    downloadGoogleWallet: string;
    downloadPassApple: string;
    downloadPassAndroid: string;
  };
}

class OmniwalletService {
  private client: AxiosInstance | null = null;
  private config: OmniwalletConfig | null = null;

  private async getConfig(): Promise<OmniwalletConfig | null> {
    const configRecord = await prisma.zancadasConfig.findFirst();
    
    if (!configRecord || !configRecord.isEnabled) {
      return null;
    }

    return {
      subdomain: configRecord.omniwalletSubdomain!,
      apiToken: configRecord.omniwalletApiToken!,
      webhookSecret: configRecord.omniwalletWebhookSecret || '',
      baseUrl: 'https://api.omniwallet.cloud/v1'
    };
  }

  private async getClient(): Promise<AxiosInstance | null> {
    if (this.client) return this.client;

    const config = await this.getConfig();
    if (!config) return null;

    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        'Authorization': `Bearer ${config.apiToken}`,
        'X-Omniwallet-Account': config.subdomain
      }
    });

    return this.client;
  }

  // Verificar conexión
  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const client = await this.getClient();
      if (!client) {
        return { success: false, error: 'Omniwallet no está configurado' };
      }

      await client.get('/settings/POINTS_VALUE');
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message 
      };
    }
  }

  // Crear cliente en Omniwallet
  async createCustomer(data: CreateCustomerData): Promise<CustomerResponse | null> {
    try {
      const client = await this.getClient();
      if (!client) return null;

      const response = await client.post('/customers', {
        data: {
          type: 'customers',
          attributes: {
            email: data.email,
            name: data.name,
            last_name: data.lastName || '',
            phone: data.phone || ''
          }
        }
      });

      return response.data.data;
    } catch (error: any) {
      console.error('Error creating Omniwallet customer:', error.response?.data || error.message);
      throw error;
    }
  }

  // Obtener datos del cliente (incluyendo balance)
  async getCustomer(email: string): Promise<CustomerResponse | null> {
    try {
      const client = await this.getClient();
      if (!client) return null;

      const response = await client.get(`/customers/${encodeURIComponent(email)}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  // Obtener balance de puntos
  async getBalance(email: string): Promise<number | null> {
    const customer = await this.getCustomer(email);
    return customer?.attributes.points ?? null;
  }

  // Sumar puntos
  async addPoints(data: AddPointsData): Promise<boolean> {
    try {
      const client = await this.getClient();
      if (!client) return false;

      await client.post(`/customers/${encodeURIComponent(data.email)}/add-points`, {
        points: data.points,
        type: data.type,
        external_id: data.externalId,
        content: data.content || {}
      });

      return true;
    } catch (error: any) {
      console.error('Error adding points:', error.response?.data || error.message);
      return false;
    }
  }

  // Restar puntos
  async subtractPoints(data: AddPointsData): Promise<boolean> {
    try {
      const client = await this.getClient();
      if (!client) return false;

      await client.post(`/customers/${encodeURIComponent(data.email)}/subtract-points`, {
        points: data.points,
        type: data.type,
        external_id: data.externalId,
        content: data.content || {}
      });

      return true;
    } catch (error: any) {
      console.error('Error subtracting points:', error.response?.data || error.message);
      return false;
    }
  }

  // Obtener transacciones del cliente
  async getTransactions(email: string, page = 1, pageSize = 20) {
    try {
      const client = await this.getClient();
      if (!client) return null;

      const response = await client.get(
        `/customers/${encodeURIComponent(email)}/transactions`,
        {
          params: {
            'page[number]': page,
            'page[size]': pageSize,
            'sort': '-created_at'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error fetching transactions:', error.response?.data || error.message);
      return null;
    }
  }

  // Validar firma de webhook
  validateWebhookSignature(
    body: string,
    timestamp: string,
    signature: string
  ): boolean {
    if (!this.config?.webhookSecret) return false;

    // Verificar timestamp (5 minutos de tolerancia)
    const hookTime = parseInt(timestamp);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - hookTime) > 300) {
      return false;
    }

    // Calcular firma esperada
    const stringToSign = `${timestamp}.${body}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.config.webhookSecret)
      .update(stringToSign)
      .digest('hex');

    // Comparar de forma segura
    try {
      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );
    } catch {
      return false;
    }
  }

  // Invalidar caché de cliente (para refresh)
  invalidateCache() {
    this.client = null;
    this.config = null;
  }
}

export const omniwalletService = new OmniwalletService();
```

---

### 4. Servicio Backend: `ZancadasService`

```typescript
// src/services/zancadas.service.ts

import { prisma } from '../lib/prisma';
import { omniwalletService } from './omniwallet.service';
import { v4 as uuidv4 } from 'uuid';

interface GrantZancadasResult {
  success: boolean;
  points?: number;
  totalBalance?: number;
  error?: string;
}

class ZancadasService {
  
  // Verificar si Omniwallet está habilitado
  async isEnabled(): Promise<boolean> {
    const config = await prisma.zancadasConfig.findFirst();
    return config?.isEnabled ?? false;
  }

  // Obtener configuración de una acción
  async getAction(actionCode: string) {
    return prisma.zancadasAction.findUnique({
      where: { actionCode }
    });
  }

  // Obtener todas las acciones configuradas
  async getAllActions() {
    return prisma.zancadasAction.findMany({
      orderBy: { actionCode: 'asc' }
    });
  }

  // Verificar límites de la acción para un usuario
  private async checkLimits(userId: string, actionId: string, action: any): Promise<boolean> {
    // Verificar límite diario
    if (action.maxPerDay) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayCount = await prisma.zancadasTransaction.count({
        where: {
          userId,
          actionId,
          createdAt: { gte: today }
        }
      });
      
      if (todayCount >= action.maxPerDay) {
        return false;
      }
    }

    // Verificar límite total por usuario
    if (action.maxPerUser) {
      const totalCount = await prisma.zancadasTransaction.count({
        where: { userId, actionId }
      });
      
      if (totalCount >= action.maxPerUser) {
        return false;
      }
    }

    return true;
  }

  // Otorgar Zancadas por una acción
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
    if (!action || !action.isEnabled) {
      return { success: false, error: 'Acción no encontrada o deshabilitada' };
    }

    // Obtener usuario
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    if (!user) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    // Verificar límites
    const withinLimits = await this.checkLimits(userId, action.id, action);
    if (!withinLimits) {
      return { success: false, error: 'Límite de acción alcanzado' };
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
            user_id: userId
          }
        });
      } catch (error: any) {
        omniwalletError = error.message;
      }
    }

    // Registrar transacción local
    await prisma.zancadasTransaction.create({
      data: {
        userId,
        actionId: action.id,
        points: action.points,
        referenceType,
        referenceId,
        omniwalletSynced,
        omniwalletExternalId: externalId,
        omniwalletError
      }
    });

    // Actualizar balance local del usuario
    const newBalance = await prisma.user.update({
      where: { id: userId },
      data: {
        zancadasBalance: { increment: action.points }
      },
      select: { zancadasBalance: true }
    });

    return {
      success: true,
      points: action.points,
      totalBalance: newBalance.zancadasBalance
    };
  }

  // ============ HOOKS PARA INTEGRAR EN OTROS SERVICIOS ============

  // Llamar cuando un usuario se registra
  async onUserRegistered(userId: string, userData: { email: string; name: string; lastName?: string }): Promise<void> {
    if (!(await this.isEnabled())) return;

    // Crear cliente en Omniwallet
    try {
      const omniCustomer = await omniwalletService.createCustomer({
        email: userData.email,
        name: userData.name,
        lastName: userData.lastName
      });

      if (omniCustomer) {
        // Actualizar usuario con datos de Omniwallet
        await prisma.user.update({
          where: { id: userId },
          data: {
            omniwalletCustomerId: omniCustomer.id,
            omniwalletCardNumber: omniCustomer.attributes.card,
            omniwalletSyncedAt: new Date()
          }
        });
      }
    } catch (error) {
      console.error('Error creating Omniwallet customer:', error);
    }

    // Otorgar Zancadas de registro
    await this.grantZancadas(userId, 'REGISTER');
  }

  // Llamar cuando un usuario crea una valoración
  async onReviewCreated(userId: string, competitionId: string): Promise<GrantZancadasResult> {
    // Verificar si es la primera valoración del usuario
    const reviewCount = await prisma.review.count({
      where: { userId }
    });

    // Otorgar puntos por la valoración
    const result = await this.grantZancadas(
      userId,
      'REVIEW_COMPETITION',
      'COMPETITION',
      competitionId
    );

    // Si es la primera valoración, otorgar bonus
    if (reviewCount === 1) {
      await this.grantZancadas(userId, 'FIRST_REVIEW');
    }

    return result;
  }

  // Llamar cuando un usuario marca competición como completada
  async onCompetitionCompleted(userId: string, competitionId: string): Promise<GrantZancadasResult> {
    return this.grantZancadas(
      userId,
      'COMPLETE_COMPETITION',
      'COMPETITION',
      competitionId
    );
  }

  // ============ CONSULTAS ============

  // Obtener balance del usuario (local + sincronizado)
  async getUserBalance(userId: string): Promise<{ local: number; omniwallet: number | null }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { zancadasBalance: true, email: true }
    });

    let omniwalletBalance: number | null = null;
    if (user?.email) {
      omniwalletBalance = await omniwalletService.getBalance(user.email);
    }

    return {
      local: user?.zancadasBalance ?? 0,
      omniwallet: omniwalletBalance
    };
  }

  // Obtener historial de transacciones del usuario
  async getUserTransactions(userId: string, page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;

    const [transactions, total] = await Promise.all([
      prisma.zancadasTransaction.findMany({
        where: { userId },
        include: {
          action: {
            select: { actionName: true, actionCode: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.zancadasTransaction.count({ where: { userId } })
    ]);

    return {
      data: transactions,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  // Sincronizar balance con Omniwallet
  async syncBalance(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user?.email) return;

    const omniBalance = await omniwalletService.getBalance(user.email);
    if (omniBalance !== null) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          zancadasBalance: omniBalance,
          omniwalletSyncedAt: new Date()
        }
      });
    }
  }
}

export const zancadasService = new ZancadasService();
```

---

### 5. Endpoints API WWTRAIL (Nuevos)

```typescript
// src/routes/zancadas.routes.ts

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { zancadasController } from '../controllers/zancadas.controller';

const router = Router();

// ============ RUTAS PÚBLICAS (ninguna) ============

// ============ RUTAS DE USUARIO (autenticado) ============

// Obtener mi balance de Zancadas
router.get('/user/balance', authenticate, zancadasController.getMyBalance);

// Obtener mi historial de transacciones
router.get('/user/transactions', authenticate, zancadasController.getMyTransactions);

// Sincronizar mi balance con Omniwallet
router.post('/user/sync', authenticate, zancadasController.syncMyBalance);

// ============ RUTAS DE ADMIN ============

// Configuración de Omniwallet
router.get('/admin/config', authenticate, authorize('ADMIN'), zancadasController.getConfig);
router.put('/admin/config', authenticate, authorize('ADMIN'), zancadasController.updateConfig);
router.post('/admin/test-connection', authenticate, authorize('ADMIN'), zancadasController.testConnection);

// Gestión de acciones
router.get('/admin/actions', authenticate, authorize('ADMIN'), zancadasController.getActions);
router.put('/admin/actions/:id', authenticate, authorize('ADMIN'), zancadasController.updateAction);

// Estadísticas
router.get('/admin/stats', authenticate, authorize('ADMIN'), zancadasController.getStats);

// ============ WEBHOOK ============

router.post('/webhook/omniwallet', zancadasController.handleWebhook);

export default router;
```

---

### 6. Controller

```typescript
// src/controllers/zancadas.controller.ts

import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { zancadasService } from '../services/zancadas.service';
import { omniwalletService } from '../services/omniwallet.service';

class ZancadasController {
  
  // ============ USER ENDPOINTS ============

  async getMyBalance(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const balance = await zancadasService.getUserBalance(userId);
      
      res.json({
        success: true,
        data: {
          zancadas: balance.local,
          omniwalletBalance: balance.omniwallet,
          synced: balance.local === balance.omniwallet
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getMyTransactions(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      
      const result = await zancadasService.getUserTransactions(userId, page, pageSize);
      
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async syncMyBalance(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      await zancadasService.syncBalance(userId);
      const balance = await zancadasService.getUserBalance(userId);
      
      res.json({
        success: true,
        data: { zancadas: balance.local }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ ADMIN ENDPOINTS ============

  async getConfig(req: Request, res: Response) {
    try {
      const config = await prisma.zancadasConfig.findFirst();
      
      res.json({
        success: true,
        data: config ? {
          subdomain: config.omniwalletSubdomain,
          hasToken: !!config.omniwalletApiToken,
          hasWebhookSecret: !!config.omniwalletWebhookSecret,
          isEnabled: config.isEnabled
        } : null
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateConfig(req: Request, res: Response) {
    try {
      const { subdomain, apiToken, webhookSecret, isEnabled } = req.body;
      
      const existingConfig = await prisma.zancadasConfig.findFirst();
      
      const data: any = {
        omniwalletSubdomain: subdomain,
        isEnabled: isEnabled ?? false
      };
      
      // Solo actualizar token si se proporciona uno nuevo
      if (apiToken) {
        data.omniwalletApiToken = apiToken;
      }
      if (webhookSecret) {
        data.omniwalletWebhookSecret = webhookSecret;
      }

      let config;
      if (existingConfig) {
        config = await prisma.zancadasConfig.update({
          where: { id: existingConfig.id },
          data
        });
      } else {
        config = await prisma.zancadasConfig.create({ data });
      }

      // Invalidar caché del servicio
      omniwalletService.invalidateCache();

      res.json({ success: true, data: { isEnabled: config.isEnabled } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async testConnection(req: Request, res: Response) {
    try {
      const result = await omniwalletService.testConnection();
      res.json({ success: result.success, error: result.error });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getActions(req: Request, res: Response) {
    try {
      const actions = await zancadasService.getAllActions();
      res.json({ success: true, data: actions });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async updateAction(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { points, isEnabled, maxPerDay, maxPerUser } = req.body;
      
      const action = await prisma.zancadasAction.update({
        where: { id },
        data: {
          points,
          isEnabled,
          maxPerDay,
          maxPerUser
        }
      });

      res.json({ success: true, data: action });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getStats(req: Request, res: Response) {
    try {
      const [totalTransactions, totalPoints, userCount] = await Promise.all([
        prisma.zancadasTransaction.count(),
        prisma.zancadasTransaction.aggregate({
          _sum: { points: true }
        }),
        prisma.user.count({
          where: { zancadasBalance: { gt: 0 } }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalTransactions,
          totalPointsAwarded: totalPoints._sum.points || 0,
          usersWithPoints: userCount
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // ============ WEBHOOK ============

  async handleWebhook(req: Request, res: Response) {
    try {
      const signature = req.headers['x-omniwallet-signature'] as string;
      const timestamp = req.headers['x-omniwallet-timestamp'] as string;
      const hookId = req.headers['x-omniwallet-hook-id'] as string;
      const body = JSON.stringify(req.body);

      // Verificar firma
      if (!omniwalletService.validateWebhookSignature(body, timestamp, signature)) {
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Verificar idempotencia
      const existingWebhook = await prisma.zancadasWebhook.findUnique({
        where: { hookId }
      });

      if (existingWebhook) {
        return res.status(200).json({ message: 'Already processed' });
      }

      // Registrar webhook
      await prisma.zancadasWebhook.create({
        data: {
          hookId,
          event: req.body.event,
          payload: req.body
        }
      });

      // Procesar evento (según el tipo)
      const { event, data } = req.body;
      
      switch (event) {
        case 'points.added':
        case 'points.subtracted':
          // Sincronizar balance del usuario afectado
          const user = await prisma.user.findFirst({
            where: { email: data.customer_id }
          });
          if (user) {
            await zancadasService.syncBalance(user.id);
          }
          break;
        // Añadir más eventos según necesidad
      }

      res.status(200).json({ success: true });
    } catch (error: any) {
      console.error('Webhook error:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

export const zancadasController = new ZancadasController();
```

---

### 7. Integración en Servicios Existentes

```typescript
// En AuthService.register() - después de crear el usuario
import { zancadasService } from '../services/zancadas.service';

// ... después de crear el usuario exitosamente
await zancadasService.onUserRegistered(newUser.id, {
  email: newUser.email,
  name: newUser.name,
  lastName: newUser.lastName
});
```

```typescript
// En ReviewService.create() - después de crear la review
import { zancadasService } from '../services/zancadas.service';

// ... después de crear la review exitosamente
await zancadasService.onReviewCreated(userId, competitionId);
```

```typescript
// En UserCompetitionService.updateStatus() - cuando status cambia a COMPLETED
import { zancadasService } from '../services/zancadas.service';

// ... cuando el status cambia a COMPLETED
if (newStatus === 'COMPLETED' && oldStatus !== 'COMPLETED') {
  await zancadasService.onCompetitionCompleted(userId, competitionId);
}
```

---

## 🎨 COMPONENTES FRONTEND

### 1. `ZancadasBalance.tsx`
```tsx
// components/zancadas/ZancadasBalance.tsx

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { zancadasService } from '@/lib/api/zancadas.service';

interface Props {
  className?: string;
}

export function ZancadasBalance({ className }: Props) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchBalance = async () => {
    try {
      const data = await zancadasService.getBalance();
      setBalance(data.zancadas);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncBalance = async () => {
    setSyncing(true);
    try {
      const data = await zancadasService.syncBalance();
      setBalance(data.zancadas);
    } catch (error) {
      console.error('Error syncing balance:', error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse h-16 bg-gray-200 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium text-green-700">
          <span className="flex items-center gap-2">
            <span className="text-2xl">👟</span>
            Mis Zancadas
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={syncBalance}
            disabled={syncing}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-green-600">
            {balance.toLocaleString()}
          </span>
          <span className="text-sm text-green-600/70">zancadas</span>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-green-600/60">
          <TrendingUp className="h-3 w-3" />
          <span>Gana más valorando competiciones</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. `ZancadasHistory.tsx`
```tsx
// components/zancadas/ZancadasHistory.tsx

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { zancadasService } from '@/lib/api/zancadas.service';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Transaction {
  id: string;
  points: number;
  createdAt: string;
  action: {
    actionName: string;
    actionCode: string;
  };
}

export function ZancadasHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await zancadasService.getTransactions();
        setTransactions(data.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded" />;
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          <span className="text-4xl mb-2 block">👟</span>
          <p>Aún no tienes Zancadas.</p>
          <p className="text-sm">¡Valora competiciones para empezar a ganar!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Historial de Zancadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium text-sm">{tx.action.actionName}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(tx.createdAt), {
                    addSuffix: true,
                    locale: es
                  })}
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                +{tx.points} 👟
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 3. `AdminZancadasConfig.tsx`
```tsx
// app/admin/zancadas/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { zancadasAdminService } from '@/lib/api/zancadas-admin.service';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AdminZancadasPage() {
  const [config, setConfig] = useState({
    subdomain: '',
    apiToken: '',
    webhookSecret: '',
    isEnabled: false
  });
  const [actions, setActions] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadConfig();
    loadActions();
  }, []);

  const loadConfig = async () => {
    const data = await zancadasAdminService.getConfig();
    if (data) {
      setConfig(prev => ({
        ...prev,
        subdomain: data.subdomain || '',
        isEnabled: data.isEnabled
      }));
    }
  };

  const loadActions = async () => {
    const data = await zancadasAdminService.getActions();
    setActions(data);
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    const result = await zancadasAdminService.testConnection();
    setConnectionStatus(result.success ? 'success' : 'error');
    
    if (!result.success) {
      toast.error(`Error de conexión: ${result.error}`);
    } else {
      toast.success('Conexión exitosa con Omniwallet');
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await zancadasAdminService.updateConfig(config);
      toast.success('Configuración guardada');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateAction = async (id: string, data: any) => {
    try {
      await zancadasAdminService.updateAction(id, data);
      loadActions();
      toast.success('Acción actualizada');
    } catch (error) {
      toast.error('Error al actualizar acción');
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Configuración de Zancadas</h1>

      {/* Conexión Omniwallet */}
      <Card>
        <CardHeader>
          <CardTitle>🔗 Conexión con Omniwallet</CardTitle>
          <CardDescription>
            Configura la conexión con tu cuenta de Omniwallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subdomain">Subdominio</Label>
              <Input
                id="subdomain"
                placeholder="tu-cuenta"
                value={config.subdomain}
                onChange={(e) => setConfig(prev => ({ ...prev, subdomain: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                El subdominio de tu cuenta (ej: si accedes por miempresa.omniwallet.net, escribe "miempresa")
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="apiToken">API Token</Label>
              <Input
                id="apiToken"
                type="password"
                placeholder="••••••••••••••••"
                value={config.apiToken}
                onChange={(e) => setConfig(prev => ({ ...prev, apiToken: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhookSecret">Webhook Secret (opcional)</Label>
            <Input
              id="webhookSecret"
              type="password"
              placeholder="••••••••••••••••"
              value={config.webhookSecret}
              onChange={(e) => setConfig(prev => ({ ...prev, webhookSecret: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={config.isEnabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, isEnabled: checked }))}
              />
              <Label htmlFor="enabled">Sistema de Zancadas activo</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={testConnection} disabled={connectionStatus === 'testing'}>
                {connectionStatus === 'testing' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {connectionStatus === 'success' && <CheckCircle className="mr-2 h-4 w-4 text-green-500" />}
                {connectionStatus === 'error' && <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                Probar Conexión
              </Button>
              <Button onClick={saveConfig} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones y Puntos */}
      <Card>
        <CardHeader>
          <CardTitle>⚡ Acciones que otorgan Zancadas</CardTitle>
          <CardDescription>
            Configura cuántas Zancadas reciben los usuarios por cada acción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {actions.map((action: any) => (
              <div key={action.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Switch
                    checked={action.isEnabled}
                    onCheckedChange={(checked) => updateAction(action.id, { isEnabled: checked })}
                  />
                  <div>
                    <p className="font-medium">{action.actionName}</p>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    className="w-24"
                    value={action.points}
                    onChange={(e) => updateAction(action.id, { points: parseInt(e.target.value) })}
                  />
                  <span className="text-sm text-gray-500">Zancadas</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

### Backend
```
src/
├── services/
│   ├── omniwallet.service.ts      ✨ Nuevo
│   └── zancadas.service.ts        ✨ Nuevo
├── controllers/
│   └── zancadas.controller.ts     ✨ Nuevo
├── routes/
│   └── zancadas.routes.ts         ✨ Nuevo
└── middlewares/
    └── webhook.middleware.ts      ✨ Nuevo (opcional)

prisma/
└── schema.prisma                  📝 Modificar (añadir modelos)
```

### Frontend
```
app/
├── profile/
│   └── components/
│       ├── ZancadasBalance.tsx    ✨ Nuevo
│       └── ZancadasHistory.tsx    ✨ Nuevo
├── admin/
│   └── zancadas/
│       └── page.tsx               ✨ Nuevo
└── components/
    └── ui/                        (usar componentes existentes)

lib/
└── api/
    ├── zancadas.service.ts        ✨ Nuevo
    └── zancadas-admin.service.ts  ✨ Nuevo
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Backend - Infraestructura
- [ ] Actualizar schema.prisma con nuevos modelos
- [ ] Ejecutar migración de base de datos
- [ ] Crear OmniwalletService
- [ ] Crear ZancadasService
- [ ] Crear ZancadasController
- [ ] Crear rutas de Zancadas
- [ ] Registrar rutas en index.ts

### Fase 2: Backend - Integraciones
- [ ] Integrar en AuthService.register()
- [ ] Integrar en ReviewService.create()
- [ ] Integrar en UserCompetitionService.updateStatus()
- [ ] Implementar endpoint de webhook

### Fase 3: Frontend - Componentes
- [ ] Crear ZancadasBalance component
- [ ] Crear ZancadasHistory component
- [ ] Integrar balance en página de perfil
- [ ] Crear servicio API cliente

### Fase 4: Frontend - Admin
- [ ] Crear página de configuración admin
- [ ] Formulario de conexión Omniwallet
- [ ] Editor de acciones y puntos
- [ ] Test de conexión

### Fase 5: Testing
- [ ] Tests unitarios de OmniwalletService
- [ ] Tests unitarios de ZancadasService
- [ ] Tests de integración de endpoints
- [ ] Test E2E del flujo completo

---

## 📝 NOTAS IMPORTANTES

1. **Seguridad del Token:** El API Token de Omniwallet debe almacenarse de forma segura (cifrado en BD o variable de entorno).

2. **Idempotencia:** Usar `external_id` único en cada transacción para evitar duplicados.

3. **Balance Local vs Omniwallet:** Mantener siempre un balance local por si Omniwallet no está disponible.

4. **Webhooks:** La URL del webhook debe ser HTTPS en producción.

5. **Rate Limiting:** La API de Omniwallet puede tener límites. Implementar retry con backoff exponencial.

---

*Documento generado para Claude Code - WWTRAIL Omniwallet Integration*
*Fecha: 2025-12-07*
*Versión: 2.0 (Completa)*

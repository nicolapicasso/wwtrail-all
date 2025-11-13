# 🏔️ WWTRAIL Backend API

**World Wide Trail Running Races Platform** - Sistema de gestión de competiciones de trail running con soporte multiidioma y geolocalización.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Requisitos Previos](#requisitos-previos)
- [Instalación Rápida](#instalación-rápida)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)
- [Sistema Multiidioma](#sistema-multiidioma)
- [Testing](#testing)
- [Despliegue](#despliegue)

## ✨ Características

- 🔐 **Autenticación JWT** con refresh tokens
- 👥 **Sistema de roles**: Admin, Organizer, Athlete, Viewer
- 🗺️ **PostGIS** para búsquedas geoespaciales
- 🌍 **Multiidioma** (ES, EN, IT, CA, FR, DE)
- 🤖 **Traducciones automáticas** con IA
- 📊 **Sistema de resultados** y participantes
- ⭐ **Reviews y favoritos**
- 📁 **Gestión de archivos** (imágenes, GPX, KML)
- 🔔 **Sistema de notificaciones**
- 🚀 **Caché con Redis**
- 📈 **Rate limiting** y seguridad
- 🎯 **Validación con Zod**

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL 16 + PostGIS
- **Caché**: Redis 7
- **Autenticación**: JWT (jsonwebtoken)
- **Validación**: Zod
- **Logging**: Winston
- **Testing**: Jest

## 📦 Requisitos Previos

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** y **Docker Compose**
- **Git**

## 🚀 Instalación Rápida

### Opción 1: Setup Automático

```bash
# Clonar repositorio (cuando esté disponible)
git clone <repo-url>
cd wwtrail-backend

# Ejecutar setup automático
chmod +x setup-complete.sh
./setup-complete.sh
```

### Opción 2: Setup Manual

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 3. Levantar servicios Docker
docker-compose up -d

# 4. Generar cliente Prisma
npm run prisma:generate

# 5. Ejecutar migraciones
npm run prisma:migrate

# 6. (Opcional) Cargar datos de prueba
npm run prisma:seed

# 7. Iniciar servidor
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno

Crear archivo `.env` basado en `.env.example`:

```env
# Database
DATABASE_URL="postgresql://wwtrail:wwtrail_password@localhost:5432/wwtrail_db?schema=public"

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# OpenAI (para traducciones)
OPENAI_API_KEY=sk-...
```

### Docker Services

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart
```

## 📁 Estructura del Proyecto

```
wwtrail-backend/
├── src/
│   ├── config/           # Configuraciones (DB, Redis, etc)
│   ├── controllers/      # Controladores de rutas
│   ├── middlewares/      # Middlewares (auth, error, etc)
│   ├── routes/           # Definición de rutas
│   ├── services/         # Lógica de negocio
│   ├── schemas/          # Schemas de validación (Zod)
│   ├── utils/            # Utilidades y helpers
│   ├── types/            # Tipos TypeScript
│   └── index.ts          # Punto de entrada
├── prisma/
│   ├── schema.prisma     # Esquema de base de datos
│   ├── migrations/       # Migraciones
│   └── seed.ts           # Datos de prueba
├── docker-compose.yml    # Servicios Docker
├── tsconfig.json         # Config TypeScript
└── package.json          # Dependencias
```

## 🌐 API Endpoints

### Autenticación

```
POST   /api/v1/auth/register          # Registro de usuario
POST   /api/v1/auth/login             # Login
POST   /api/v1/auth/refresh           # Refresh token
POST   /api/v1/auth/logout            # Logout
GET    /api/v1/auth/me                # Usuario actual
```

### Competiciones

```
GET    /api/v1/competitions           # Listar competiciones
GET    /api/v1/competitions/:id       # Ver competición
POST   /api/v1/competitions           # Crear competición (ORGANIZER)
PUT    /api/v1/competitions/:id       # Actualizar competición
DELETE /api/v1/competitions/:id       # Eliminar competición
GET    /api/v1/competitions/search    # Búsqueda avanzada
GET    /api/v1/competitions/nearby    # Competiciones cercanas
```

### Usuarios

```
GET    /api/v1/users                  # Listar usuarios (ADMIN)
GET    /api/v1/users/:id              # Ver perfil
PUT    /api/v1/users/:id              # Actualizar perfil
DELETE /api/v1/users/:id              # Eliminar usuario
```

### Categorías

```
GET    /api/v1/categories             # Listar categorías de competición
POST   /api/v1/categories             # Crear categoría
PUT    /api/v1/categories/:id         # Actualizar categoría
DELETE /api/v1/categories/:id         # Eliminar categoría
```

### Participantes

```
GET    /api/v1/participants           # Listar participantes
POST   /api/v1/participants           # Registrar participante
PUT    /api/v1/participants/:id       # Actualizar participante
DELETE /api/v1/participants/:id       # Eliminar participante
```

### Resultados

```
GET    /api/v1/results                # Listar resultados
POST   /api/v1/results                # Crear resultado
PUT    /api/v1/results/:id            # Actualizar resultado
DELETE /api/v1/results/:id            # Eliminar resultado
```

### Reviews

```
GET    /api/v1/reviews                # Listar reviews
POST   /api/v1/reviews                # Crear review
PUT    /api/v1/reviews/:id            # Actualizar review
DELETE /api/v1/reviews/:id            # Eliminar review
```

### Traducciones

```
GET    /api/v1/translations/:competitionId      # Ver traducciones
POST   /api/v1/translations/:competitionId      # Crear traducción
PUT    /api/v1/translations/:id                 # Actualizar traducción
POST   /api/v1/translations/auto-translate      # Traducción automática con IA
```

### Health Check

```
GET    /health                        # Estado del servidor
```

## 🗄️ Base de Datos

### Modelos Principales

- **User**: Usuarios del sistema
- **Competition**: Competiciones de trail running
- **CompetitionTranslation**: Traducciones de competiciones
- **Category**: Categorías dentro de competiciones
- **Participant**: Participantes registrados
- **Result**: Resultados de competiciones
- **Review**: Valoraciones de competiciones
- **Favorite**: Competiciones favoritas
- **File**: Archivos adjuntos (imágenes, GPX, etc)
- **Notification**: Notificaciones del sistema

### Prisma Commands

```bash
# Generar cliente
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Aplicar migraciones en producción
npm run prisma:migrate:prod

# Abrir Prisma Studio
npm run prisma:studio

# Resetear base de datos
npm run prisma:reset

# Cargar datos de prueba
npm run prisma:seed
```

## 🌍 Sistema Multiidioma

El sistema soporta 6 idiomas:

- 🇪🇸 Español (ES) - Idioma base
- 🇬🇧 Inglés (EN)
- 🇮🇹 Italiano (IT)
- Catalán (CA)
- 🇫🇷 Francés (FR)
- 🇩🇪 Alemán (DE)

### Traducciones Automáticas

Las traducciones se pueden generar automáticamente usando OpenAI:

```typescript
POST /api/v1/translations/auto-translate
{
  "competitionId": "uuid",
  "targetLanguages": ["EN", "IT", "FR"]
}
```

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage
npm run test:coverage
```

## 📝 Scripts Disponibles

```bash
npm run dev              # Desarrollo con hot-reload
npm run build            # Compilar TypeScript
npm run start            # Iniciar en producción
npm run lint             # Ejecutar ESLint
npm run format           # Formatear con Prettier
npm run prisma:studio    # Abrir Prisma Studio
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Ejecutar migraciones
npm run prisma:seed      # Cargar datos de prueba
```

## 🚢 Despliegue

### Variables de Entorno en Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_HOST=redis.example.com
JWT_SECRET=<strong-random-secret>
OPENAI_API_KEY=sk-...
CORS_ORIGIN=https://wwtrail.com
```

### Docker Production

```bash
# Build
docker build -t wwtrail-backend .

# Run
docker run -p 3001:3001 --env-file .env wwtrail-backend
```

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Docs](https://expressjs.com/)
- [PostGIS Docs](https://postgis.net/documentation/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

## 👥 Contribuir

Por favor lee CONTRIBUTING.md para detalles sobre el proceso de contribución.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 🆘 Soporte

Para reportar problemas o solicitar características, por favor abre un issue en GitHub.

---

Desarrollado con ❤️ para la comunidad de trail running

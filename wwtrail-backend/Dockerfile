# ============================================
# WWTRAIL Backend - Production Dockerfile
# Express + TypeScript + Prisma + PostGIS
# ============================================

# --- Stage 1: Dependencies ---
FROM node:20-alpine AS deps

WORKDIR /app

# Instalar dependencias del sistema necesarias para bcrypt y sharp
RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci --omit=dev && \
    npx prisma generate

# --- Stage 2: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci

COPY tsconfig.json ./
COPY src ./src/

RUN npx prisma generate && \
    npm run build

# --- Stage 3: Production ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Instalar dependencias del sistema para sharp y bcrypt en runtime
RUN apk add --no-cache libc6-compat

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 expressjs

# Copiar dependencias de produccion
COPY --from=deps /app/node_modules ./node_modules

# Copiar build compilado
COPY --from=builder /app/dist ./dist

# Copiar Prisma (schema + migrations para prisma migrate deploy)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copiar package.json para scripts
COPY package.json ./

# Copiar init-db.sql por si se necesita
COPY init-db.sql ./

# Crear directorio de uploads con permisos correctos
RUN mkdir -p /app/uploads && chown -R expressjs:nodejs /app/uploads

# Exponer puerto
EXPOSE 3001

USER expressjs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Ejecutar migraciones y luego iniciar el servidor
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]

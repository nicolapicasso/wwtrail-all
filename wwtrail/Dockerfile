# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Native module build dependencies
RUN apk add --no-cache python3 make g++ openssl openssl-dev

COPY package.json package-lock.json* ./
RUN npm ci

# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

# Copy deps
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

# Generate Prisma client first (needs schema)
COPY prisma/ ./prisma/
RUN npx prisma generate

# Copy source and build
COPY . .

# Build arg for public env vars needed at build time
ARG NEXT_PUBLIC_APP_URL=https://wwtrail.com
ARG NEXT_PUBLIC_APP_NAME=WWTRAIL
# Storage backend for image URLs (baked into the client at build time). Defaults
# to Spaces so /uploads/* resolve to the DO Spaces CDN. Override to 'local' for
# same-origin serving in dev.
ARG NEXT_PUBLIC_STORAGE_TYPE=spaces
ARG NEXT_PUBLIC_SPACES_URL=https://wwtrail-uploads.fra1.cdn.digitaloceanspaces.com

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_STORAGE_TYPE=$NEXT_PUBLIC_STORAGE_TYPE
ENV NEXT_PUBLIC_SPACES_URL=$NEXT_PUBLIC_SPACES_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# openssl+curl for runtime; chromium + fonts for the AI scraper's headless
# rendering of JavaScript sites (e.g. UTMB).
RUN apk add --no-cache \
    openssl curl \
    chromium nss freetype harfbuzz ca-certificates ttf-freefont

# Create non-root user with writable home directory
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --home /home/nextjs nextjs && \
    mkdir -p /home/nextjs && chown -R nextjs:nodejs /home/nextjs

# Copy standalone output (includes server.js and minimal node_modules)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy Prisma schema + migrations (needed for migrate deploy at runtime)
COPY --from=builder /app/prisma ./prisma

# Copy generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Install only prisma CLI for runtime migrations (minimal install)
RUN npm install --no-save prisma@6.19.0

# playwright-core for the scraper's headless rendering. Uses the system Chromium
# installed above (no browser download). Installed here because the Next.js
# standalone output doesn't trace this runtime-only optional dependency.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
RUN npm install --no-save playwright-core@1.49.1

# Copy entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Create uploads directory with proper permissions
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

# Set ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
# Headless Chromium for the AI scraper (Alpine's chromium package)
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium-browser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

ENTRYPOINT ["./entrypoint.sh"]

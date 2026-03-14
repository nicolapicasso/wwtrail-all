# ---- Build stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for native modules (bcrypt, sharp)
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig.json tsconfig.build.json ./
COPY src/ ./src/
COPY prisma/ ./prisma/

# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS production

WORKDIR /app

# Install dependencies for native modules at runtime
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Rebuild native modules for production (bcrypt, sharp)
RUN npm rebuild bcrypt sharp

# Copy built output and prisma files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client in production node_modules
RUN npx prisma generate

# Copy entrypoint script
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Copy init-db.sql for reference
COPY init-db.sql ./init-db.sql

# Create uploads directory
RUN mkdir -p /app/uploads

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]

#!/bin/sh
set -e

echo "==> WWTRAIL Unified App Starting..."
echo "    Environment: ${NODE_ENV:-development}"
echo "    Port: ${PORT:-3000}"

# ---- Run Prisma Migrations ----
if [ -d "prisma/migrations" ]; then
  echo "==> Running database migrations..."
  npx prisma migrate deploy
  echo "==> Migrations completed!"
else
  echo "==> No migrations directory found, skipping..."
fi

# ---- Start Next.js ----
echo "==> Starting Next.js server..."
exec node server.js

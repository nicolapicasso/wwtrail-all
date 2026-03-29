#!/bin/sh

echo "==> WWTRAIL Unified App Starting..."
echo "    Environment: ${NODE_ENV:-development}"
echo "    Port: ${PORT:-3000}"
echo "    Hostname: ${HOSTNAME:-0.0.0.0}"

# ---- Check database connectivity ----
if [ -n "$DATABASE_URL" ]; then
  echo "==> DATABASE_URL is set"
else
  echo "==> WARNING: DATABASE_URL is NOT set!"
fi

# ---- Run Prisma Migrations ----
if [ -d "prisma/migrations" ]; then
  echo "==> Running database migrations..."
  if ./node_modules/.bin/prisma migrate deploy 2>&1; then
    echo "==> Migrations completed successfully!"
  else
    echo "==> WARNING: Migrations failed! The app will start anyway."
    echo "==> You may need to run migrations manually or check DATABASE_URL."
  fi
else
  echo "==> No migrations directory found, skipping..."
fi

# ---- Start Next.js ----
echo "==> Starting Next.js server on port ${PORT:-3000}..."
exec node server.js

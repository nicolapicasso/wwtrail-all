#!/bin/sh
set -e

echo "==> Waiting for PostgreSQL to be ready..."
until npx prisma db execute --stdin <<< "SELECT 1" > /dev/null 2>&1; do
  echo "    PostgreSQL is not ready yet. Retrying in 2s..."
  sleep 2
done
echo "==> PostgreSQL is ready!"

echo "==> Running Prisma migrations..."
npx prisma migrate deploy
echo "==> Migrations completed!"

echo "==> Generating Prisma client..."
npx prisma generate
echo "==> Prisma client generated!"

echo "==> Starting application..."
exec node dist/index.js

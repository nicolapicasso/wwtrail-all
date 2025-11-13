-- Habilitar extensiones de PostgreSQL
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsquedas de texto

-- Verificar versiones
SELECT PostGIS_Version();
SELECT PostGIS_Full_Version();

-- Crear índices espaciales de ejemplo (se crearán automáticamente con Prisma)
-- Este archivo se ejecuta al iniciar el contenedor por primera vez

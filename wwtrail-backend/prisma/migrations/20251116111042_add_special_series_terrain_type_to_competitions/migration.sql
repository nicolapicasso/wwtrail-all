-- CreateEnum
CREATE TYPE "UTMBIndex" AS ENUM ('INDEX_20K', 'INDEX_50K', 'INDEX_100K', 'INDEX_100M');

-- AlterTable: Modify special_series to match Organizer structure
-- Primero añadir columnas nuevas
ALTER TABLE "special_series" ADD COLUMN "country" VARCHAR(2);
ALTER TABLE "special_series" ADD COLUMN "website" TEXT;
ALTER TABLE "special_series" ADD COLUMN "instagramUrl" TEXT;
ALTER TABLE "special_series" ADD COLUMN "facebookUrl" TEXT;
ALTER TABLE "special_series" ADD COLUMN "twitterUrl" TEXT;
ALTER TABLE "special_series" ADD COLUMN "youtubeUrl" TEXT;
ALTER TABLE "special_series" ADD COLUMN "status" "EventStatus" DEFAULT 'DRAFT';
ALTER TABLE "special_series" ADD COLUMN "createdById" TEXT;

-- Modificar tipo de columnas existentes
ALTER TABLE "special_series" ALTER COLUMN "name" TYPE VARCHAR(255);
ALTER TABLE "special_series" ALTER COLUMN "slug" TYPE VARCHAR(255);

-- Si hay registros existentes, asignar valores por defecto
-- (Ajustar según necesidades específicas)
UPDATE "special_series"
SET "country" = 'ES',
    "website" = "websiteUrl",
    "status" = 'PUBLISHED',
    "createdById" = (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1)
WHERE "country" IS NULL;

-- Hacer columnas obligatorias
ALTER TABLE "special_series" ALTER COLUMN "country" SET NOT NULL;
ALTER TABLE "special_series" ALTER COLUMN "createdById" SET NOT NULL;
ALTER TABLE "special_series" ALTER COLUMN "status" SET NOT NULL;

-- Eliminar columnas antiguas
ALTER TABLE "special_series" DROP COLUMN IF EXISTS "websiteUrl";
ALTER TABLE "special_series" DROP COLUMN IF EXISTS "sortOrder";
ALTER TABLE "special_series" DROP COLUMN IF EXISTS "isActive";

-- Eliminar la foreign key vieja events → special_series si existe
ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_specialSeriesId_fkey";
ALTER TABLE "events" DROP COLUMN IF EXISTS "specialSeriesId";

-- CreateIndex en special_series
CREATE INDEX IF NOT EXISTS "special_series_status_idx" ON "special_series"("status");
CREATE INDEX IF NOT EXISTS "special_series_createdById_idx" ON "special_series"("createdById");

-- AddForeignKey: special_series → users
ALTER TABLE "special_series" ADD CONSTRAINT "special_series_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: Añadir nuevos campos a competitions
ALTER TABLE "competitions" ADD COLUMN "terrainTypeId" TEXT;
ALTER TABLE "competitions" ADD COLUMN "specialSeriesId" TEXT;
ALTER TABLE "competitions" ADD COLUMN "itraPoints" INTEGER;
ALTER TABLE "competitions" ADD COLUMN "utmbIndex" "UTMBIndex";

-- CreateIndex en competitions
CREATE INDEX IF NOT EXISTS "competitions_terrainTypeId_idx" ON "competitions"("terrainTypeId");
CREATE INDEX IF NOT EXISTS "competitions_specialSeriesId_idx" ON "competitions"("specialSeriesId");

-- AddForeignKey: competitions → terrain_types
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_terrainTypeId_fkey" FOREIGN KEY ("terrainTypeId") REFERENCES "terrain_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey: competitions → special_series
ALTER TABLE "competitions" ADD CONSTRAINT "competitions_specialSeriesId_fkey" FOREIGN KEY ("specialSeriesId") REFERENCES "special_series"("id") ON DELETE SET NULL ON UPDATE CASCADE;

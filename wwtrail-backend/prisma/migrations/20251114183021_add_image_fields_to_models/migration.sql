-- AlterTable: Add image fields to competitions table
ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;
ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;
ALTER TABLE "competitions" ADD COLUMN IF NOT EXISTS "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable: Add image fields to editions table
ALTER TABLE "editions" ADD COLUMN IF NOT EXISTS "coverImage" TEXT;
ALTER TABLE "editions" ADD COLUMN IF NOT EXISTS "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add comments for documentation
COMMENT ON COLUMN "competitions"."logoUrl" IS 'Logo específico de la competición';
COMMENT ON COLUMN "competitions"."coverImage" IS 'Imagen de portada/hero de la competición';
COMMENT ON COLUMN "competitions"."gallery" IS 'Array de URLs para galería de fotos de la competición';
COMMENT ON COLUMN "editions"."coverImage" IS 'Imagen de portada específica de esta edición';
COMMENT ON COLUMN "editions"."gallery" IS 'Galería de fotos de la edición';

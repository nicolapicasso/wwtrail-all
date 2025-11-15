-- AlterEnum: Add SERVICES to HomeBlockType
ALTER TYPE "HomeBlockType" ADD VALUE IF NOT EXISTS 'SERVICES';

-- CreateTable: services
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(100) NOT NULL,
    "country" VARCHAR(2) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "location" geometry(Point, 4326),
    "logoUrl" TEXT,
    "coverImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "organizerId" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "services_slug_key" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_slug_idx" ON "services"("slug");

-- CreateIndex
CREATE INDEX "services_country_idx" ON "services"("country");

-- CreateIndex
CREATE INDEX "services_city_idx" ON "services"("city");

-- CreateIndex
CREATE INDEX "services_category_idx" ON "services"("category");

-- CreateIndex
CREATE INDEX "services_status_idx" ON "services"("status");

-- CreateIndex
CREATE INDEX "services_organizerId_idx" ON "services"("organizerId");

-- CreateIndex
CREATE INDEX "services_featured_idx" ON "services"("featured");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "services" IS 'Servicios (alojamientos, restaurantes, tiendas, puntos de información, etc.)';
COMMENT ON COLUMN "services"."category" IS 'Categoría de creación libre (alojamientos, restaurantes, tiendas, etc.)';
COMMENT ON COLUMN "services"."location" IS 'Ubicación geográfica usando PostGIS';
COMMENT ON COLUMN "services"."logoUrl" IS 'Logo del servicio';
COMMENT ON COLUMN "services"."coverImage" IS 'Imagen de portada del servicio';
COMMENT ON COLUMN "services"."gallery" IS 'Galería de fotos del servicio';

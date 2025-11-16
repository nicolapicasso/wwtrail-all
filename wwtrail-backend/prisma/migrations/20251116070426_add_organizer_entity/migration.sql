-- CreateTable: organizers
CREATE TABLE "organizers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "country" VARCHAR(2) NOT NULL,
    "website" TEXT,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "twitterUrl" TEXT,
    "youtubeUrl" TEXT,
    "logoUrl" TEXT,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizers_slug_key" ON "organizers"("slug");

-- CreateIndex
CREATE INDEX "organizers_slug_idx" ON "organizers"("slug");

-- CreateIndex
CREATE INDEX "organizers_status_idx" ON "organizers"("status");

-- CreateIndex
CREATE INDEX "organizers_createdById_idx" ON "organizers"("createdById");

-- AddForeignKey: organizers -> users
ALTER TABLE "organizers" ADD CONSTRAINT "organizers_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Rename events.organizerId to events.userId (to reference user who created the event)
-- First, drop the existing foreign key
ALTER TABLE "events" DROP CONSTRAINT IF EXISTS "events_organizerId_fkey";

-- Rename the column
ALTER TABLE "events" RENAME COLUMN "organizerId" TO "userId";

-- Drop the old index
DROP INDEX IF EXISTS "events_organizerId_idx";

-- Create new index for userId
CREATE INDEX "events_userId_idx" ON "events"("userId");

-- Re-create the foreign key with the new column name
ALTER TABLE "events" ADD CONSTRAINT "events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add new nullable organizerId column (to reference organizer entity)
ALTER TABLE "events" ADD COLUMN "organizerId" TEXT;

-- Create index for new organizerId
CREATE INDEX "events_organizerId_idx" ON "events"("organizerId");

-- AddForeignKey: events.organizerId -> organizers
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "organizers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add comments for documentation
COMMENT ON TABLE "organizers" IS 'Entidades organizadoras (clubs, sociedades, etc.) que organizan eventos';
COMMENT ON COLUMN "organizers"."status" IS 'DRAFT hasta que admin apruebe, luego PUBLISHED';
COMMENT ON COLUMN "organizers"."createdById" IS 'Usuario que creó esta entidad organizadora';
COMMENT ON COLUMN "events"."userId" IS 'Usuario que creó el evento';
COMMENT ON COLUMN "events"."organizerId" IS 'Entidad organizadora del evento (opcional)';

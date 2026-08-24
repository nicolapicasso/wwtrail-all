-- Editable legal pages (privacy/cookies/terms) per language.
CREATE TABLE "legal_pages" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(40) NOT NULL,
    "language" VARCHAR(5) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "legal_pages_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "legal_pages_slug_language_key" ON "legal_pages"("slug", "language");

-- Dynamic cookie catalog.
CREATE TABLE "cookie_definitions" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "category" VARCHAR(20) NOT NULL,
    "provider" VARCHAR(120),
    "purpose" TEXT NOT NULL,
    "duration" VARCHAR(60),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "cookie_definitions_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "cookie_definitions_category_idx" ON "cookie_definitions"("category");
CREATE INDEX "cookie_definitions_isActive_idx" ON "cookie_definitions"("isActive");

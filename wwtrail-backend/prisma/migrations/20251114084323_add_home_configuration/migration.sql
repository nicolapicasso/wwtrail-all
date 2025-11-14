-- CreateEnum
CREATE TYPE "HomeBlockType" AS ENUM ('EVENTS', 'COMPETITIONS', 'EDITIONS', 'TEXT', 'LINKS');

-- CreateEnum
CREATE TYPE "HomeBlockViewType" AS ENUM ('LIST', 'CARDS');

-- CreateEnum
CREATE TYPE "HomeTextSize" AS ENUM ('SM', 'MD', 'LG', 'XL');

-- CreateEnum
CREATE TYPE "HomeTextVariant" AS ENUM ('PARAGRAPH', 'HEADING');

-- CreateTable
CREATE TABLE "home_configurations" (
    "id" TEXT NOT NULL,
    "heroImage" TEXT,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_blocks" (
    "id" TEXT NOT NULL,
    "configurationId" TEXT NOT NULL,
    "type" "HomeBlockType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_blocks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_blocks_configurationId_idx" ON "home_blocks"("configurationId");

-- CreateIndex
CREATE INDEX "home_blocks_order_idx" ON "home_blocks"("order");

-- AddForeignKey
ALTER TABLE "home_blocks" ADD CONSTRAINT "home_blocks_configurationId_fkey" FOREIGN KEY ("configurationId") REFERENCES "home_configurations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

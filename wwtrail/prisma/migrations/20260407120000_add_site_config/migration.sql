-- CreateTable
CREATE TABLE "site_config" (
    "id" TEXT NOT NULL,
    "openaiApiKey" TEXT,
    "siteName" VARCHAR(100) NOT NULL DEFAULT 'WWTRAIL',
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "fontPrimary" VARCHAR(100) NOT NULL DEFAULT 'Montserrat',
    "fontSecondary" VARCHAR(100) NOT NULL DEFAULT 'sans-serif',
    "colorPrimary" VARCHAR(20) NOT NULL DEFAULT '#B5751A',
    "colorSecondary" VARCHAR(20) NOT NULL DEFAULT '#16A34A',
    "colorAccent" VARCHAR(20) NOT NULL DEFAULT '#B66916',
    "colorBackground" VARCHAR(20) NOT NULL DEFAULT '#FFFFFF',
    "colorText" VARCHAR(20) NOT NULL DEFAULT '#333333',
    "colorSuccess" VARCHAR(20) NOT NULL DEFAULT '#28A745',
    "colorDanger" VARCHAR(20) NOT NULL DEFAULT '#DC3545',
    "borderRadius" VARCHAR(10) NOT NULL DEFAULT '0',
    "shadowStyle" VARCHAR(20) NOT NULL DEFAULT 'subtle',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_config_pkey" PRIMARY KEY ("id")
);

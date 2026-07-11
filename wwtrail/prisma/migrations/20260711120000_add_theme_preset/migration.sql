-- CreateTable
CREATE TABLE "theme_preset" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
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

    CONSTRAINT "theme_preset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "theme_preset_name_key" ON "theme_preset"("name");

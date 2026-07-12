-- Competition: orden de visualización dentro del evento (drag & drop backoffice)
ALTER TABLE "competitions" ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- Edition: activa/inactiva (ocultar sin borrar)
ALTER TABLE "editions" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Índices
CREATE INDEX "competitions_displayOrder_idx" ON "competitions"("displayOrder");
CREATE INDEX "editions_isActive_idx" ON "editions"("isActive");

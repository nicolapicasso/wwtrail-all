-- Editable outreach email templates (per type + language). Absent rows fall
-- back to the in-code defaults.
CREATE TABLE "outreach_email_templates" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "language" VARCHAR(5) NOT NULL,
    "subject" VARCHAR(500) NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outreach_email_templates_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "outreach_email_templates_type_language_key" ON "outreach_email_templates"("type", "language");

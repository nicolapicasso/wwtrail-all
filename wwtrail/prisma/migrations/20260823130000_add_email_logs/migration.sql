-- Idempotency log for the automated organizer/magazine outreach engine.
CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL,
    "entityType" VARCHAR(20) NOT NULL,
    "entityId" TEXT NOT NULL,
    "emailType" VARCHAR(40) NOT NULL,
    "recipient" VARCHAR(255) NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "email_logs_entityType_entityId_emailType_key" ON "email_logs"("entityType", "entityId", "emailType");
CREATE INDEX "email_logs_emailType_idx" ON "email_logs"("emailType");
CREATE INDEX "email_logs_sentAt_idx" ON "email_logs"("sentAt");

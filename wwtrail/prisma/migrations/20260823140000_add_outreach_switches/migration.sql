-- Outreach engine on/off switches (default OFF so nothing sends until enabled).
ALTER TABLE "site_config" ADD COLUMN "outreachEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "site_config" ADD COLUMN "emailWelcomeEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "site_config" ADD COLUMN "emailReminderEnabled" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "site_config" ADD COLUMN "emailMagazineEnabled" BOOLEAN NOT NULL DEFAULT false;

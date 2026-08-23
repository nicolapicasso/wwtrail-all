-- Email / Resend integration settings on the singleton site_config row.
-- resendApiKey is stored AES-encrypted (see lib/utils/settingsCrypto.ts).
ALTER TABLE "site_config" ADD COLUMN "resendApiKey" TEXT;
ALTER TABLE "site_config" ADD COLUMN "emailFrom" VARCHAR(255);
ALTER TABLE "site_config" ADD COLUMN "organizerReplyTo" VARCHAR(255);

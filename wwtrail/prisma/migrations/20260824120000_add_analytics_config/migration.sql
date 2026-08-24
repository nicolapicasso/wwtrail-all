-- Analytics / tag management IDs on SiteConfig (public, browser-injected, consent-gated)
ALTER TABLE "site_config" ADD COLUMN "gtmContainerId" VARCHAR(20);
ALTER TABLE "site_config" ADD COLUMN "gaMeasurementId" VARCHAR(20);
ALTER TABLE "site_config" ADD COLUMN "brevoTrackerId" VARCHAR(40);

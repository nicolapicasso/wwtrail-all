-- Weekly "new competitions by country" digest switch (default OFF).
ALTER TABLE "site_config" ADD COLUMN "marketingDigestEnabled" BOOLEAN NOT NULL DEFAULT false;

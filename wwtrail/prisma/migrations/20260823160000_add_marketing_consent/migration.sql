-- Marketing consent (explicit opt-in) for end-user marketing automation.
ALTER TABLE "users" ADD COLUMN "marketingOptIn" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "marketingOptInAt" TIMESTAMP(3);
CREATE INDEX "users_marketingOptIn_idx" ON "users"("marketingOptIn");

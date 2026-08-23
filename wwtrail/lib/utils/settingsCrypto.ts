// lib/utils/settingsCrypto.ts
// AES-256-GCM encryption for secret settings stored in the database (e.g. the
// Resend API key managed from the backoffice). The key material comes from the
// SETTINGS_ENC_KEY env var — the one bootstrap secret that never lives in the
// DB. Any-length env value is accepted; it is hashed to a 32-byte key.

import crypto from 'crypto';

const PREFIX = 'enc:v1:';

function getKey(): Buffer | null {
  const raw = process.env.SETTINGS_ENC_KEY;
  if (!raw) return null;
  // Derive a stable 32-byte key from whatever the operator provided.
  return crypto.createHash('sha256').update(raw).digest();
}

/** True if the stored value is one of our encrypted blobs. */
export function isEncrypted(value: string | null | undefined): boolean {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

/**
 * Encrypt a plaintext secret. Throws if SETTINGS_ENC_KEY is not configured, so
 * a secret is never accidentally written in cleartext.
 */
export function encryptSecret(plain: string): string {
  const key = getKey();
  if (!key) throw new Error('SETTINGS_ENC_KEY is not configured; cannot store secrets securely.');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString('base64')}:${tag.toString('base64')}:${enc.toString('base64')}`;
}

/**
 * Decrypt a value produced by encryptSecret. If the value is not encrypted
 * (e.g. entered manually before a key existed) it is returned as-is. Returns
 * null when decryption is impossible (missing key or corrupt data).
 */
export function decryptSecret(value: string | null | undefined): string | null {
  if (!value) return null;
  if (!isEncrypted(value)) return value; // plaintext / legacy
  const key = getKey();
  if (!key) return null;
  try {
    const [ivB64, tagB64, dataB64] = value.slice(PREFIX.length).split(':');
    const iv = Buffer.from(ivB64, 'base64');
    const tag = Buffer.from(tagB64, 'base64');
    const data = Buffer.from(dataB64, 'base64');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}

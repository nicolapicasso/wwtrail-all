// lib/services/spaces.client.ts
// DigitalOcean Spaces client (S3-compatible)

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

const endpoint = process.env.DO_SPACES_ENDPOINT || 'https://ams3.digitaloceanspaces.com';
const bucket = process.env.DO_SPACES_BUCKET || 'wwtrail-uploads';
const cdnUrl = process.env.DO_SPACES_CDN || 'https://wwtrail-uploads.fra1.cdn.digitaloceanspaces.com';

const s3Client = new S3Client({
  endpoint,
  forcePathStyle: false,
  region: 'ams3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY || '',
    secretAccessKey: process.env.DO_SPACES_SECRET || '',
  },
});

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

/**
 * Upload a file buffer to DigitalOcean Spaces
 * @returns The public CDN URL of the uploaded file
 */
export async function uploadToSpaces(
  buffer: Buffer,
  key: string,
  contentType?: string,
): Promise<string> {
  const ext = path.extname(key).toLowerCase();
  const resolvedContentType = contentType || MIME_TYPES[ext] || 'application/octet-stream';

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: resolvedContentType,
      CacheControl: 'public, max-age=2592000, immutable',
    }),
  );

  return `${cdnUrl}/${key}`;
}

/**
 * Delete a file from DigitalOcean Spaces
 */
export async function deleteFromSpaces(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

/**
 * Extract the Spaces key from a CDN URL
 * e.g. "https://wwtrail-uploads.ams3.cdn.digitaloceanspaces.com/uploads/logo/file.webp"
 *   -> "uploads/logo/file.webp"
 */
export function getKeyFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    // Remove leading slash
    return u.pathname.startsWith('/') ? u.pathname.slice(1) : u.pathname;
  } catch {
    // If it's already a relative path like /uploads/...
    if (url.startsWith('/')) return url.slice(1);
    return url;
  }
}

/**
 * Check if Spaces is configured (credentials present and storage type is spaces)
 */
export function isSpacesConfigured(): boolean {
  // If STORAGE_TYPE is explicitly "local", don't use Spaces
  if (process.env.STORAGE_TYPE === 'local') return false;
  // If STORAGE_TYPE is "spaces" or credentials are present, use Spaces
  return !!(process.env.DO_SPACES_KEY && process.env.DO_SPACES_SECRET);
}

export { s3Client, bucket, cdnUrl };

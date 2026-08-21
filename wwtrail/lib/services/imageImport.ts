// lib/services/imageImport.ts
// Server-side helper to "internalize" external image URLs: download the image
// and store it in our own DigitalOcean Spaces bucket, returning the CDN URL.
// Used by the importers so imported logos/covers live on our CDN instead of
// hot-linking third-party sites (which can disappear or block hotlinking).

import path from 'path';
import axios from 'axios';
import { uploadToSpaces, isSpacesConfigured } from './spaces.client';
import { assertSafeUrl } from '@/lib/utils/ssrf';
import logger from '@/lib/utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const EXT_BY_TYPE: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
};

/** True when the URL already points at our own storage (Spaces/CDN or local uploads). */
function isAlreadyStored(url: string): boolean {
  const bucket = process.env.DO_SPACES_BUCKET || 'wwtrail-uploads';
  return (
    url.startsWith('/uploads/') ||
    url.includes('digitaloceanspaces.com') ||
    url.includes(`${bucket}.`)
  );
}

/**
 * Download an external image URL and store it in our Spaces bucket, returning
 * the resulting CDN URL. On ANY problem — Spaces not configured, unsafe URL,
 * download failure, wrong content type, too large — the original URL is
 * returned unchanged so an import is never broken by a single image.
 */
export async function internalizeImageUrl(
  url: string | null | undefined,
  folder = 'imported'
): Promise<string | null | undefined> {
  if (!url || typeof url !== 'string') return url;
  if (!/^https?:\/\//i.test(url)) return url; // relative/local — leave as-is
  if (isAlreadyStored(url)) return url; // already on our storage
  if (!isSpacesConfigured()) return url; // can't store remotely → keep external ref

  try {
    // SSRF guard: reject internal/reserved hosts before requesting.
    await assertSafeUrl(url);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      maxContentLength: MAX_FILE_SIZE,
      maxRedirects: 0, // prevent redirect-based SSRF bypass
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WWTRAIL/1.0)',
        Accept: 'image/*',
      },
    });

    const buffer = Buffer.from(response.data);
    if (buffer.length === 0 || buffer.length > MAX_FILE_SIZE) return url;

    const contentType =
      (response.headers['content-type'] || '').split(';')[0]?.trim().toLowerCase() || 'image/jpeg';
    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) return url;

    let ext = EXT_BY_TYPE[contentType] || path.extname(new URL(url).pathname) || '.jpg';
    if (!ext.startsWith('.')) ext = '.' + ext;

    const baseName =
      path
        .basename(new URL(url).pathname, path.extname(new URL(url).pathname))
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .substring(0, 60) || 'imported-image';
    const key = `uploads/${folder}/${baseName}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 6)}${ext}`;

    const cdnUrl = await uploadToSpaces(buffer, key, contentType);
    logger.info(`[imageImport] internalized ${url} -> ${cdnUrl}`);
    return cdnUrl;
  } catch (e: any) {
    logger.warn(`[imageImport] could not internalize ${url}: ${e?.message || e}`);
    return url; // fallback: keep the external URL, never break the import
  }
}

/**
 * Internalize the common image fields of an import item in place, returning a
 * shallow copy with logoUrl / coverImage / gallery[] pointing at our storage.
 */
export async function internalizeItemImages<T extends Record<string, any>>(
  item: T,
  folder = 'imported'
): Promise<T> {
  if (!item || typeof item !== 'object') return item;
  const [logoUrl, coverImage] = await Promise.all([
    internalizeImageUrl(item.logoUrl, `${folder}/logos`),
    internalizeImageUrl(item.coverImage, `${folder}/covers`),
  ]);
  let gallery = item.gallery;
  if (Array.isArray(item.gallery) && item.gallery.length > 0) {
    gallery = await Promise.all(
      item.gallery.map((g: any) =>
        typeof g === 'string' ? internalizeImageUrl(g, `${folder}/gallery`) : g
      )
    );
  }
  return { ...item, logoUrl, coverImage, gallery };
}

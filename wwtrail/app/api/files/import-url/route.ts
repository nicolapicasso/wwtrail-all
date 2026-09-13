import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import path from 'path';
import { uploadToSpaces, isSpacesConfigured, assertLocalFallbackAllowed } from '@/lib/services/spaces.client';
import { writeFile, mkdir } from 'fs/promises';
import { assertSafeUrl } from '@/lib/utils/ssrf';
import axios from 'axios';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

/** Detect the image type from magic bytes (more reliable than Content-Type). */
function sniffImageType(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  if (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50
  ) return 'image/webp';
  // SVG (text): look for an <svg tag in the first chunk.
  const head = buf.slice(0, 256).toString('utf8').toLowerCase();
  if (head.includes('<svg')) return 'image/svg+xml';
  return null;
}

/**
 * POST /api/files/import-url
 * Download an image from an external URL and upload it to storage
 * Body: { url: string, fieldName?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { url, fieldName = 'gallery' } = await request.json();

    if (!url || typeof url !== 'string') {
      throw new ApiError('URL is required', 400);
    }

    // Download the image, following redirects manually so we can re-check each
    // hop against the SSRF guard (many event sites redirect image URLs, so a
    // hard maxRedirects:0 was silently breaking imports).
    let currentUrl = url;
    let response: any = null;
    for (let hop = 0; hop <= 3; hop++) {
      try {
        await assertSafeUrl(currentUrl);
      } catch (e: any) {
        throw new ApiError(e?.message || 'URL is not allowed', 400);
      }
      // Send browser-like headers, including a Referer pointing at the image's
      // own origin. Many CDNs / sites block hotlinking (403) for requests
      // without these, even when the page HTML itself loads fine.
      let referer = '';
      try { const u = new URL(currentUrl); referer = `${u.protocol}//${u.host}/`; } catch { /* ignore */ }
      const resp = await axios.get(currentUrl, {
        responseType: 'arraybuffer',
        timeout: 20000,
        maxContentLength: MAX_FILE_SIZE,
        maxRedirects: 0,
        validateStatus: (s) => s >= 200 && s < 400,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          ...(referer ? { Referer: referer } : {}),
        },
      });
      const location = resp.headers['location'] || resp.headers['Location'];
      if (resp.status >= 300 && resp.status < 400 && location) {
        currentUrl = new URL(location, currentUrl).toString();
        continue; // follow the redirect
      }
      response = resp;
      break;
    }
    if (!response) {
      throw new ApiError('Too many redirects while fetching the image', 400);
    }

    const buffer = Buffer.from(response.data);
    if (buffer.length === 0) {
      throw new ApiError('The downloaded image is empty', 400);
    }
    if (buffer.length > MAX_FILE_SIZE) {
      throw new ApiError('Image too large (max 10MB)', 400);
    }

    const headerType = response.headers['content-type']?.split(';')[0]?.trim().toLowerCase() || '';
    // Sniff the actual bytes: many CDNs serve images as octet-stream/generic
    // types, so trust the magic bytes over the declared content-type.
    const sniffed = sniffImageType(buffer);
    const contentType = sniffed || headerType;

    if (!contentType.startsWith('image/') || !ALLOWED_CONTENT_TYPES.includes(contentType)) {
      throw new ApiError(
        `The URL did not return a valid image (received "${headerType || 'unknown'}").`,
        400
      );
    }

    // Determine extension from content type or URL
    const extMap: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp',
      'image/svg+xml': '.svg',
    };
    let ext = extMap[contentType] || path.extname(new URL(url).pathname) || '.jpg';
    if (!ext.startsWith('.')) ext = '.' + ext;

    // Generate unique filename
    const baseName = path.basename(new URL(url).pathname, path.extname(new URL(url).pathname))
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .substring(0, 60) || 'imported-image';
    const uniqueName = `${baseName}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}${ext}`;
    const spacesKey = `uploads/${fieldName}/${uniqueName}`;

    let uploadedUrl: string;

    if (isSpacesConfigured()) {
      uploadedUrl = await uploadToSpaces(buffer, spacesKey, contentType);
    } else {
      assertLocalFallbackAllowed('import-url');
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', fieldName);
      await mkdir(uploadDir, { recursive: true });
      await writeFile(path.join(uploadDir, uniqueName), buffer);
      uploadedUrl = `/uploads/${fieldName}/${uniqueName}`;
    }

    // Save to DB
    const fileRecord = await prisma.file.create({
      data: {
        filename: uniqueName,
        originalName: path.basename(new URL(url).pathname),
        mimeType: contentType,
        size: buffer.length,
        path: spacesKey,
        url: uploadedUrl,
        uploaderId: user.id,
      },
    });

    return apiSuccess({
      id: fileRecord.id,
      url: uploadedUrl,
      filename: uniqueName,
      originalUrl: url,
      mimeType: contentType,
      size: buffer.length,
    }, 201);
  } catch (error: any) {
    if (error instanceof ApiError) return apiError(error);
    if (axios.isAxiosError(error)) {
      return apiError(new ApiError(`Failed to download image: ${error.message}`, 400));
    }
    return apiError(error);
  }
}

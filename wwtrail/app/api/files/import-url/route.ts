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
      const resp = await axios.get(currentUrl, {
        responseType: 'arraybuffer',
        timeout: 15000,
        maxContentLength: MAX_FILE_SIZE,
        maxRedirects: 0,
        validateStatus: (s) => s >= 200 && s < 400,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; WWTRAIL/1.0)',
          'Accept': 'image/*',
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
    const contentType = response.headers['content-type']?.split(';')[0]?.trim().toLowerCase() || '';

    // Validate it is actually an image (otherwise a redirect/HTML error page
    // would be "imported successfully" but show nothing).
    if (!contentType.startsWith('image/') || !ALLOWED_CONTENT_TYPES.includes(contentType)) {
      throw new ApiError(
        `The URL did not return a valid image (received "${contentType || 'unknown'}").`,
        400
      );
    }

    if (buffer.length === 0) {
      throw new ApiError('The downloaded image is empty', 400);
    }
    if (buffer.length > MAX_FILE_SIZE) {
      throw new ApiError('Image too large (max 10MB)', 400);
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

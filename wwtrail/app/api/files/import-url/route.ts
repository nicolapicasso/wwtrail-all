import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import path from 'path';
import { uploadToSpaces, isSpacesConfigured } from '@/lib/services/spaces.client';
import { writeFile, mkdir } from 'fs/promises';
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

    // Download the image
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      maxContentLength: MAX_FILE_SIZE,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WWTRAIL/1.0)',
        'Accept': 'image/*',
      },
    });

    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type']?.split(';')[0]?.trim() || 'image/jpeg';

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

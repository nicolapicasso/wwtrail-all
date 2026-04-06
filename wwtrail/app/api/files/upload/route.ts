import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const formData = await request.formData();

    // Find the uploaded file from any field name (file, link, logo, cover, etc.)
    let file: File | null = null;
    let detectedFieldName = 'uploads';
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        file = value;
        detectedFieldName = key;
        break;
      }
    }
    const fieldName = detectedFieldName;

    if (!file) {
      throw new ApiError('No file provided', 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new ApiError('Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError('File too large. Maximum 5MB', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const ext = path.extname(file.name);
    const basename = path.basename(file.name, ext);
    const uniqueName = `${basename}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;

    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', fieldName);
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    // Build URL
    const url = `/uploads/${fieldName}/${uniqueName}`;

    // Save to database
    const fileRecord = await prisma.file.create({
      data: {
        filename: uniqueName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: filePath,
        url,
        uploaderId: user.id,
      },
    });

    return apiSuccess({
      id: fileRecord.id,
      url,
      filename: uniqueName,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
    }, 201);
  } catch (error) {
    return apiError(error);
  }
}

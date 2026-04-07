import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { uploadToSpaces, isSpacesConfigured } from '@/lib/services/spaces.client';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 20;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const formData = await request.formData();

    // Collect all files from the form data
    const files: { file: File; fieldName: string }[] = [];
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        files.push({ file: value, fieldName: key });
      }
    }

    if (files.length === 0) {
      throw new ApiError('No files provided', 400);
    }

    if (files.length > MAX_FILES) {
      throw new ApiError(`Too many files. Maximum ${MAX_FILES}`, 400);
    }

    // Validate all files first
    for (const { file } of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new ApiError(`Invalid file type: ${file.name}. Allowed: JPG, PNG, GIF, WebP, SVG`, 400);
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new ApiError(`File too large: ${file.name}. Maximum 5MB`, 400);
      }
    }

    const useSpaces = isSpacesConfigured();
    const results = [];

    for (const { file, fieldName } of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || '.webp';
      const basename = path.basename(file.name, ext)
        .replace(/[^a-zA-Z0-9_-]/g, '-')
        .substring(0, 80);
      const uniqueName = `${basename}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const spacesKey = `uploads/${fieldName}/${uniqueName}`;

      let url: string;

      if (useSpaces) {
        url = await uploadToSpaces(buffer, spacesKey, file.type);
      } else {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', fieldName);
        await mkdir(uploadDir, { recursive: true });
        await writeFile(path.join(uploadDir, uniqueName), buffer);
        url = `/uploads/${fieldName}/${uniqueName}`;
      }

      const fileRecord = await prisma.file.create({
        data: {
          filename: uniqueName,
          originalName: file.name,
          mimeType: file.type,
          size: file.size,
          path: spacesKey,
          url,
          uploaderId: user.id,
        },
      });

      results.push({
        id: fileRecord.id,
        url,
        filename: uniqueName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
      });
    }

    return apiSuccess(results, 201);
  } catch (error) {
    return apiError(error);
  }
}

import { NextRequest } from 'next/server';
import { EditionPhotoService } from '@/lib/services/editionPhoto.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';

// GET /api/v2/editions/:id/photos
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const photos = await EditionPhotoService.getByEdition(params.id);
    return apiSuccess(photos);
  } catch (error) {
    return apiError(error);
  }
}

// POST /api/v2/editions/:id/photos - multipart upload (ORGANIZER/ADMIN)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const formData = await request.formData();

    const caption = (formData.get('caption') as string) || undefined;
    const photographer = (formData.get('photographer') as string) || undefined;
    const isFeatured = formData.get('isFeatured') === 'true';

    // Collect uploaded files (client appends them under the `photos` field)
    const files: File[] = [];
    for (const [, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      throw new ApiError('No files provided', 400);
    }

    const results = [];
    for (const file of files) {
      // The service consumes a multer-style file ({ path, originalname }) and
      // deletes the temp file itself, so stage the upload on disk first.
      const buffer = Buffer.from(await file.arrayBuffer());
      const tmpPath = path.join(
        os.tmpdir(),
        `photo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
      );
      await writeFile(tmpPath, buffer);

      const photo = await EditionPhotoService.upload(
        params.id,
        { path: tmpPath, originalname: file.name },
        { caption, photographer, isFeatured }
      );
      results.push(photo);
    }

    return apiSuccess(results, 201);
  } catch (error) {
    return apiError(error);
  }
}

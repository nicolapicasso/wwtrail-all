import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError, ApiError } from '@/lib/auth';
import prisma from '@/lib/db';
import { unlink } from 'fs/promises';
import path from 'path';
import { deleteFromSpaces, getKeyFromUrl, isSpacesConfigured } from '@/lib/services/spaces.client';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(request);
    const { id } = await params;

    const file = await prisma.file.findUnique({ where: { id } });

    if (!file) {
      throw new ApiError('File not found', 404);
    }

    // Only uploader or admin can delete
    if (file.uploaderId !== user.id && user.role !== 'ADMIN') {
      throw new ApiError('Unauthorized', 403);
    }

    // Delete from storage
    try {
      if (isSpacesConfigured() && file.url.startsWith('http')) {
        const key = getKeyFromUrl(file.url);
        if (key) await deleteFromSpaces(key);
      } else if (file.url.startsWith('/uploads/')) {
        const filePath = path.join(process.cwd(), 'public', file.url);
        await unlink(filePath).catch(() => {});
      }
    } catch (error) {
      console.error('Error deleting file from storage:', error);
    }

    await prisma.file.delete({ where: { id } });
    return apiSuccess({ message: 'File deleted successfully' });
  } catch (error) {
    return apiError(error);
  }
}

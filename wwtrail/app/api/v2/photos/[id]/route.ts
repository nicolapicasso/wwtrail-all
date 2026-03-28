import { NextRequest } from 'next/server';
import { EditionPhotoService } from '@/lib/services/editionPhoto.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const photo = await EditionPhotoService.update(params.id, data);
    return apiSuccess(photo);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    await EditionPhotoService.delete(params.id);
    return apiSuccess({ message: 'Photo deleted' });
  } catch (error) { return apiError(error); }
}

import { NextRequest } from 'next/server';
import { EditionPhotoService } from '@/lib/services/editionPhoto.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const editionId = searchParams.get('editionId');
    if (!editionId) return apiError(new Error('editionId required'));
    const result = await EditionPhotoService.getByEdition(editionId);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const photo = await EditionPhotoService.create(data);
    return apiSuccess(photo, 201);
  } catch (error) { return apiError(error); }
}

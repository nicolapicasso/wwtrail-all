import { NextRequest } from 'next/server';
import { EditionPhotoService } from '@/lib/services/editionPhoto.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// POST /api/v2/editions/:id/photos/reorder
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    await EditionPhotoService.reorder(params.id, data);
    return apiSuccess({ message: 'Photos reordered' });
  } catch (error) {
    return apiError(error);
  }
}

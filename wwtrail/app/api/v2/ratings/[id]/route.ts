import { NextRequest } from 'next/server';
import { EditionRatingService } from '@/lib/services/editionRating.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/ratings/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const rating = await EditionRatingService.getById(params.id);
    return apiSuccess(rating);
  } catch (error) {
    return apiError(error);
  }
}

// PUT /api/v2/ratings/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const data = await request.json();
    const rating = await EditionRatingService.update(params.id, user.id, data);
    return apiSuccess(rating);
  } catch (error) {
    return apiError(error);
  }
}

// DELETE /api/v2/ratings/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    await EditionRatingService.delete(params.id, user.id);
    return apiSuccess({ message: 'Rating deleted' });
  } catch (error) {
    return apiError(error);
  }
}

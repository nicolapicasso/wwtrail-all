import { NextRequest } from 'next/server';
import { EditionRatingService } from '@/lib/services/editionRating.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/me/ratings
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const result = await EditionRatingService.getByUser(user.id, page, limit);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

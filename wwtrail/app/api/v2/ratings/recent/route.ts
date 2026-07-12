import { NextRequest } from 'next/server';
import { EditionRatingService } from '@/lib/services/editionRating.service';
import { apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/ratings/recent
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const ratings = await EditionRatingService.getRecent(limit);
    return apiSuccess(ratings);
  } catch (error) {
    return apiError(error);
  }
}

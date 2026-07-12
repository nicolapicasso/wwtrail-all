import { NextRequest } from 'next/server';
import { EditionRatingService } from '@/lib/services/editionRating.service';
import { apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/editions/:id/ratings/summary
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await EditionRatingService.getSummary(params.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

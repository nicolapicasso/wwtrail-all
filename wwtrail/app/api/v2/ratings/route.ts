import { NextRequest } from 'next/server';
import { EditionRatingService } from '@/lib/services/editionRating.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/ratings?editionId=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const editionId = searchParams.get('editionId');
    if (!editionId) return apiError(new Error('editionId required'));
    const result = await EditionRatingService.getByEdition(editionId);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// POST /api/v2/ratings
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const data = await request.json();
    const rating = await EditionRatingService.createOrUpdate(data, user.id);
    return apiSuccess(rating, 201);
  } catch (error) { return apiError(error); }
}

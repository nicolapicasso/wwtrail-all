import { NextRequest } from 'next/server';
import { EditionRatingService } from '@/lib/services/editionRating.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/editions/:id/ratings
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '100', 10);
    const result = await EditionRatingService.getByEdition(params.id, page, limit);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

// POST /api/v2/editions/:id/ratings
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const data = await request.json();
    const rating = await EditionRatingService.create(user.id, params.id, data);
    return apiSuccess(rating, 201);
  } catch (error) {
    return apiError(error);
  }
}

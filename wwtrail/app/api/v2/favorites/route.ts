import { NextRequest } from 'next/server';
import { FavoritesService } from '@/lib/services/favorites.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const result = await FavoritesService.getUserFavorites(user.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

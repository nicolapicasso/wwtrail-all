import { NextRequest } from 'next/server';
import { FavoritesService } from '@/lib/services/favorites.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    const result = await FavoritesService.addFavorite(user.id, params.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    await FavoritesService.removeFavorite(user.id, params.id);
    return apiSuccess({ message: 'Removed from favorites' });
  } catch (error) { return apiError(error); }
}

import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/auth';
import { CatalogService } from '@/lib/services/catalog.service';

/**
 * GET /api/v2/terrain-types/[id]
 * Get a single terrain type by ID (public)
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await CatalogService.getById('terrainType', params.id);
    return apiSuccess(item);
  } catch (error) {
    return apiError(error);
  }
}

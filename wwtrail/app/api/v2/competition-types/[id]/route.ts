import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/auth';
import { CatalogService } from '@/lib/services/catalog.service';

/**
 * GET /api/v2/competition-types/[id]
 * Get a single competition type by ID (public)
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const item = await CatalogService.getById('competitionType', params.id);
    return apiSuccess(item);
  } catch (error) {
    return apiError(error);
  }
}

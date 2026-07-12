import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { CatalogService } from '@/lib/services/catalog.service';

/**
 * GET /api/v2/admin/competition-types
 * List all competition types (admin: includes inactive)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const items = await CatalogService.getAll('competitionType', false);
    return apiSuccess(items);
  } catch (error) {
    return apiError(error);
  }
}

/**
 * POST /api/v2/admin/competition-types
 * Create a competition type
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const item = await CatalogService.create('competitionType', data);
    return apiSuccess(item, 201);
  } catch (error) {
    return apiError(error);
  }
}

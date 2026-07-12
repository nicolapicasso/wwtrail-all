import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { CatalogService } from '@/lib/services/catalog.service';

/**
 * PUT /api/v2/admin/terrain-types/[id]
 * Update a terrain type
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const item = await CatalogService.update('terrainType', params.id, data);
    return apiSuccess(item);
  } catch (error) {
    return apiError(error);
  }
}

/**
 * DELETE /api/v2/admin/terrain-types/[id]
 * Soft-delete (deactivate) a terrain type
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const result = await CatalogService.delete('terrainType', params.id);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

// Alias: some clients use PATCH for partial updates.
export const PATCH = PUT;

import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { SpecialSeriesService } from '@/lib/services/specialSeries.service';

/**
 * PUT /api/v2/admin/special-series/[id]
 * Update a special series (admin)
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const data = await request.json();
    const series = await SpecialSeriesService.update(params.id, data, user.id, user.role);
    return apiSuccess(series);
  } catch (error) {
    return apiError(error);
  }
}

/**
 * DELETE /api/v2/admin/special-series/[id]
 * Delete a special series (admin)
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ADMIN');
    await SpecialSeriesService.delete(params.id, user.id);
    return apiSuccess({ message: 'Special series deleted' });
  } catch (error) {
    return apiError(error);
  }
}

// Alias: some clients use PATCH for partial updates.
export const PATCH = PUT;

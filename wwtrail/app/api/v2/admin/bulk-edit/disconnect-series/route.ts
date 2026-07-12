import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { bulkEditService } from '@/lib/services/bulk-edit.service';

/**
 * POST /api/v2/admin/bulk-edit/disconnect-series
 * Disconnect a special series from all matching competitions (bulk).
 * Body: { filters, seriesId }
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const { filters, seriesId } = await request.json();
    const result = await bulkEditService.bulkDisconnectCompetitionSeries(filters, seriesId);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { exportService } from '@/lib/services/export.service';

/**
 * GET /api/v2/admin/export/stats
 * Export statistics (counts only, no data)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const stats = await exportService.getExportStats();
    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}

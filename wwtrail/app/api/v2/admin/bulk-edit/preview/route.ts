import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { bulkEditService } from '@/lib/services/bulk-edit.service';

/**
 * POST /api/v2/admin/bulk-edit/preview
 * Preview a bulk edit operation (shows what will change).
 * Body: { entityType, filters, operation }
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const { entityType, filters, operation } = await request.json();
    const preview = await bulkEditService.previewBulkEdit(entityType, filters, operation);
    return apiSuccess(preview);
  } catch (error) {
    return apiError(error);
  }
}

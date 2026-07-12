import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { bulkEditService } from '@/lib/services/bulk-edit.service';

/**
 * POST /api/v2/admin/bulk-edit/execute
 * Execute a bulk edit operation.
 * Body: { entityType, filters, operation }
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const { entityType, filters, operation } = await request.json();
    const result = await bulkEditService.executeBulkEdit(entityType, filters, operation);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

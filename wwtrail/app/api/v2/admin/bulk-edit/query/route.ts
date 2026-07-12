import { NextRequest } from 'next/server';
import { requireRole, apiError } from '@/lib/auth';
import { bulkEditService } from '@/lib/services/bulk-edit.service';

/**
 * POST /api/v2/admin/bulk-edit/query
 * Query records matching the given filters.
 * Body: { entityType, filters, limit? }
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const { entityType, filters, limit } = await request.json();
    const records = await bulkEditService.queryRecords(entityType, filters, limit ?? 100);

    // Match client shape: { count, data }
    return Response.json({ count: records.length, data: records });
  } catch (error) {
    return apiError(error);
  }
}

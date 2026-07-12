import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { bulkEditService } from '@/lib/services/bulk-edit.service';

/**
 * GET /api/v2/admin/bulk-edit/relations/[entity]
 * Get options for a relation field (for dropdowns in the UI)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  try {
    await requireRole(request, 'ADMIN');

    const options = await bulkEditService.getRelationOptions(params.entity);
    return apiSuccess(options);
  } catch (error) {
    return apiError(error);
  }
}

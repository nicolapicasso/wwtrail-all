import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { bulkEditService } from '@/lib/services/bulk-edit.service';

/**
 * GET /api/v2/admin/bulk-edit/metadata
 * Get metadata for all supported entities and their editable fields
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const metadata = bulkEditService.getEntitiesMetadata();
    return apiSuccess(metadata);
  } catch (error) {
    return apiError(error);
  }
}

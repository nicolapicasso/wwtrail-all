import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { ImportService } from '@/lib/services/import.service';
import type { NativeImportOptions } from '@/lib/services/import.service';

const importService = new ImportService();

/**
 * POST /api/v2/admin/import/native
 * Import data from native export format (produced by the export endpoint)
 * Body: { entityType, data[], conflictResolution, dryRun?, parentId? }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const body = await request.json();
    const { entityType, data, conflictResolution = 'skip', dryRun = false, parentId } = body;

    if (!entityType || !data || !Array.isArray(data)) {
      return apiSuccess({ error: 'entityType and data[] are required' });
    }

    const options: NativeImportOptions = {
      conflictResolution,
      dryRun,
      userId: (user as any).id,
      parentId,
    };

    // Validate first
    if (dryRun || body.validate) {
      const validation = await importService.validateNativeImport({ entity: entityType, data }, entityType);
      if (dryRun) {
        return apiSuccess(validation);
      }
    }

    // Perform import
    const result = await importService.importNativeData({ entity: entityType, data }, entityType, options);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

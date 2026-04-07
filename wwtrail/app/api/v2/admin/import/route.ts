import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { ImportService } from '@/lib/services/import.service';
import { fixEncoding } from '@/lib/utils/encoding';

const importService = new ImportService();

/**
 * GET /api/v2/admin/import
 * Get import statistics
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const stats = await importService.getImportStats();
    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}

/**
 * POST /api/v2/admin/import
 * Import data from various formats
 * Body: { type: 'terrain-types' | 'organizers' | 'series' | 'events' | 'competitions' | 'full', data: any }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const rawBody = await request.json();
    // Normalize UTF-8 encoding on all string fields
    const body = fixEncoding(rawBody);
    const { type, data } = body;

    switch (type) {
      case 'terrain-types': {
        const result = await importService.ensureTerrainTypes();
        return apiSuccess(result);
      }
      case 'organizers': {
        const result = await importService.importOrganizers(data);
        return apiSuccess(result);
      }
      case 'series': {
        const result = await importService.importSeries(data);
        return apiSuccess(result);
      }
      case 'events': {
        const result = await importService.importEvents(data);
        return apiSuccess(result);
      }
      case 'competitions': {
        const result = await importService.importCompetitions(data);
        return apiSuccess(result);
      }
      case 'full': {
        const result = await importService.importAll(data);
        return apiSuccess(result);
      }
      default:
        return apiSuccess({ error: 'Invalid type. Use: terrain-types, organizers, series, events, competitions, full' });
    }
  } catch (error) {
    return apiError(error);
  }
}

/**
 * DELETE /api/v2/admin/import
 * Delete imported data by type
 * Body: { type: 'competitions' | 'events' | 'series' | 'organizers' | 'editions' | 'all' }
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();
    const { type } = body;

    switch (type) {
      case 'competitions': {
        const result = await importService.deleteAllCompetitions();
        return apiSuccess(result);
      }
      case 'events': {
        const result = await importService.deleteAllEvents();
        return apiSuccess(result);
      }
      case 'series': {
        const result = await importService.deleteAllSeries();
        return apiSuccess(result);
      }
      case 'organizers': {
        const result = await importService.deleteAllOrganizers();
        return apiSuccess(result);
      }
      case 'editions': {
        const result = await importService.deleteAllEditions();
        return apiSuccess(result);
      }
      case 'all': {
        const result = await importService.deleteAllImportedData();
        return apiSuccess(result);
      }
      default:
        return apiSuccess({ error: 'Invalid type. Use: competitions, events, series, organizers, editions, all' });
    }
  } catch (error) {
    return apiError(error);
  }
}

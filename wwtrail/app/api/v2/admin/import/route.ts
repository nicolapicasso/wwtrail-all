import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { ImportService } from '@/lib/services/import.service';

const importService = new ImportService();

/**
 * POST /api/v2/admin/import
 * Import data from various formats
 * Body: { type: 'terrain-types' | 'organizers' | 'series' | 'events' | 'competitions' | 'full', data: any }
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const body = await request.json();
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

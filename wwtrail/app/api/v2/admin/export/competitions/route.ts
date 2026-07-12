import { NextRequest } from 'next/server';
import { requireRole, apiError } from '@/lib/auth';
import { exportService } from '@/lib/services/export.service';

/**
 * GET /api/v2/admin/export/competitions
 * Export all competitions as a downloadable JSON file
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get('includeRelations') !== 'false';

    const data = await exportService.exportCompetitions(includeRelations);

    return new Response(JSON.stringify({ entity: 'competitions', count: data.length, data }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="wwtrail-competitions-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

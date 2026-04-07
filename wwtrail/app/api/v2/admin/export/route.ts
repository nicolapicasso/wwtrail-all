import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { exportService } from '@/lib/services/export.service';

/**
 * GET /api/v2/admin/export?type=full|events|competitions|...
 * Export data for backup or migration
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'stats';

    if (type === 'stats') {
      const stats = await exportService.getExportStats();
      return apiSuccess(stats);
    }

    if (type === 'full') {
      const data = await exportService.exportAll(true);
      return new Response(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="wwtrail-export-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    // Export specific entity
    const validTypes = ['events', 'competitions', 'editions', 'organizers', 'specialSeries', 'services', 'posts', 'users'] as const;
    if (validTypes.includes(type as any)) {
      const data = await exportService.exportEntity(type as any, true);
      return new Response(JSON.stringify({ entity: type, count: data.length, data }, null, 2), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': `attachment; filename="wwtrail-${type}-${new Date().toISOString().split('T')[0]}.json"`,
        },
      });
    }

    return apiSuccess({ error: 'Invalid type. Use: stats, full, events, competitions, editions, organizers, specialSeries, services, posts, users' });
  } catch (error) {
    return apiError(error);
  }
}

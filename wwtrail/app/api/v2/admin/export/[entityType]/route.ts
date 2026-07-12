import { NextRequest } from 'next/server';
import { requireRole, apiError, ApiError } from '@/lib/auth';
import { exportService } from '@/lib/services/export.service';

// Map client-facing aliases to the service entity type
const entityAliases: Record<string, 'events' | 'competitions' | 'editions' | 'organizers' | 'specialSeries' | 'services' | 'posts' | 'users'> = {
  events: 'events',
  competitions: 'competitions',
  editions: 'editions',
  organizers: 'organizers',
  specialSeries: 'specialSeries',
  series: 'specialSeries',
  services: 'services',
  posts: 'posts',
  users: 'users',
};

/**
 * GET /api/v2/admin/export/[entityType]
 * Export a single entity type as a downloadable JSON file.
 * (Static sibling routes such as /events, /competitions, /stats, /full take precedence.)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { entityType: string } }
) {
  try {
    await requireRole(request, 'ADMIN');

    const entityType = entityAliases[params.entityType];
    if (!entityType) {
      throw new ApiError(
        `Invalid entity type. Use: events, competitions, editions, organizers, specialSeries, services, posts, users`,
        400
      );
    }

    const { searchParams } = new URL(request.url);
    const includeRelations = searchParams.get('includeRelations') !== 'false';

    const data = await exportService.exportEntity(entityType, includeRelations);

    return new Response(JSON.stringify({ entity: entityType, count: data.length, data }, null, 2), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="wwtrail-${params.entityType}-${new Date().toISOString().split('T')[0]}.json"`,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}

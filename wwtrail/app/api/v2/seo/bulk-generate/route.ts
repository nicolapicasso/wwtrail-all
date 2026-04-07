import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { SEOService } from '@/lib/services/seo.service';
import prisma from '@/lib/db';
import logger from '@/lib/utils/logger';

/**
 * POST /api/v2/seo/bulk-generate
 * Generate SEO for all entities of a given type that don't have SEO yet
 * Body: { entityType: 'event' | 'competition' | 'edition' | ... }
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const { entityType } = await request.json();

    if (!entityType) {
      return apiSuccess({ error: 'entityType is required' });
    }

    // Find all entities of this type that don't have SEO
    const entities = await getEntitiesWithoutSEO(entityType);

    if (entities.length === 0) {
      return apiSuccess({
        entityType,
        message: 'All entities already have SEO generated',
        total: 0,
        generated: 0,
        errors: 0,
      });
    }

    // Process in sequence to avoid rate limiting on OpenAI
    let generated = 0;
    let errors = 0;
    const errorDetails: string[] = [];

    for (const entity of entities) {
      try {
        await SEOService.generateAndSave({
          entityType,
          entityId: entity.id,
          slug: entity.slug,
          data: entity,
        });
        generated++;
        logger.info(`SEO generated for ${entityType} ${entity.slug || entity.id} (${generated}/${entities.length})`);
      } catch (err: any) {
        errors++;
        errorDetails.push(`${entity.slug || entity.id}: ${err.message?.substring(0, 100)}`);
        logger.error(`Error generating SEO for ${entityType} ${entity.slug}: ${err.message}`);
      }
    }

    return apiSuccess({
      entityType,
      total: entities.length,
      generated,
      errors,
      errorDetails: errorDetails.slice(0, 20),
    });
  } catch (error) {
    return apiError(error);
  }
}

async function getEntitiesWithoutSEO(entityType: string): Promise<any[]> {
  // Get all existing SEO entity IDs for this type
  const existingSEO = await prisma.sEO.findMany({
    where: { entityType, language: 'ES' },
    select: { entityId: true },
  });
  const existingIds = new Set(existingSEO.map(s => s.entityId));

  let allEntities: any[] = [];

  switch (entityType) {
    case 'event':
      allEntities = await prisma.event.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true, name: true, slug: true, description: true,
          city: true, country: true, website: true,
          competitions: { select: { name: true, type: true, baseDistance: true } },
        },
      });
      break;

    case 'competition':
      allEntities = await prisma.competition.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true, name: true, slug: true, description: true,
          type: true, baseDistance: true, baseElevation: true,
          event: { select: { name: true, city: true, country: true } },
        },
      });
      break;

    case 'service':
      allEntities = await prisma.service.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true, name: true, slug: true, description: true,
          city: true, country: true,
        },
      });
      break;

    case 'specialSeries':
      allEntities = await prisma.specialSeries.findMany({
        where: { status: 'PUBLISHED' },
        select: {
          id: true, name: true, slug: true, description: true,
          country: true,
        },
      });
      break;

    default:
      return [];
  }

  // Filter out entities that already have SEO
  return allEntities.filter(e => !existingIds.has(e.id));
}

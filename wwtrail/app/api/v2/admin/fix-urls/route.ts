import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * POST /api/v2/admin/fix-urls
 * Replace URL patterns in all image fields.
 * Body: { dryRun?: boolean, targetUrl?: string, sourceUrls?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json().catch(() => ({}));
    const dryRun = body.dryRun ?? false;
    const appUrl = body.targetUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://wwtrail-5agxm.ondigitalocean.app';

    const oldPatterns = body.sourceUrls || ['http://localhost:3001', 'http://localhost:3000'];
    const results: Record<string, number> = {};

    const fieldsToFix: Array<{ model: string; field: string }> = [
      { model: 'user', field: 'avatar' },
      { model: 'organizer', field: 'logoUrl' },
      { model: 'event', field: 'logo' },
      { model: 'event', field: 'coverImage' },
      { model: 'event', field: 'logoUrl' },
      { model: 'event', field: 'coverImageUrl' },
      { model: 'competition', field: 'logoUrl' },
      { model: 'competition', field: 'coverImage' },
      { model: 'file', field: 'path' },
      { model: 'file', field: 'url' },
      { model: 'specialSeries', field: 'logoUrl' },
      { model: 'editionPhoto', field: 'url' },
      { model: 'editionPhoto', field: 'thumbnail' },
      { model: 'homeConfiguration', field: 'heroImage' },
      { model: 'service', field: 'logoUrl' },
      { model: 'service', field: 'coverImage' },
    ];

    for (const { model, field } of fieldsToFix) {
      for (const oldPattern of oldPatterns) {
        try {
          const prismaModel = (prisma as any)[model];
          if (!prismaModel) continue;

          const records = await prismaModel.findMany({
            where: { [field]: { startsWith: oldPattern } },
            select: { id: true, [field]: true },
          });

          if (records.length > 0) {
            const key = `${model}.${field}`;
            results[key] = (results[key] || 0) + records.length;

            if (!dryRun) {
              for (const record of records) {
                const oldValue = record[field] as string;
                const newValue = oldValue.replace(oldPattern, appUrl);
                await prismaModel.update({
                  where: { id: record.id },
                  data: { [field]: newValue },
                });
              }
            }
          }
        } catch (e: any) {
          // Skip fields that don't exist in this schema version
        }
      }
    }

    // Handle heroImages JSON array in HomeConfiguration
    try {
      const homeConfigs = await prisma.homeConfiguration.findMany({
        select: { id: true, heroImages: true },
      });
      for (const config of homeConfigs) {
        if (Array.isArray(config.heroImages)) {
          const images = config.heroImages as string[];
          const hasLocalhost = images.some((img: string) =>
            typeof img === 'string' && oldPatterns.some(p => img.startsWith(p))
          );
          if (hasLocalhost) {
            results['homeConfiguration.heroImages'] = (results['homeConfiguration.heroImages'] || 0) + 1;
            if (!dryRun) {
              const fixed = images.map((img: string) => {
                if (typeof img !== 'string') return img;
                let result = img;
                for (const p of oldPatterns) {
                  result = result.replace(p, appUrl);
                }
                return result;
              });
              await prisma.homeConfiguration.update({
                where: { id: config.id },
                data: { heroImages: fixed },
              });
            }
          }
        }
      }
    } catch (e: any) {
      // Skip if homeConfiguration doesn't have heroImages
    }

    const totalFixed = Object.values(results).reduce((sum, n) => sum + n, 0);

    return apiSuccess({
      dryRun,
      targetUrl: appUrl,
      totalRecordsFixed: totalFixed,
      details: results,
    });
  } catch (error) {
    return apiError(error);
  }
}

import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

const SPACES_CDN = process.env.DO_SPACES_CDN || 'https://wwtrail-uploads.fra1.cdn.digitaloceanspaces.com';

/**
 * Convert any upload URL to the Spaces CDN URL
 */
function toSpacesCdn(url: string): string {
  if (!url || typeof url !== 'string') return url;

  // Already on correct Spaces CDN
  if (url.startsWith(SPACES_CDN)) return url;

  // Wrong Spaces region (ams3 instead of fra1, or vice versa)
  const spacesPattern = /^https:\/\/wwtrail-uploads\.[a-z0-9]+\.cdn\.digitaloceanspaces\.com/;
  if (spacesPattern.test(url)) {
    return url.replace(spacesPattern, SPACES_CDN);
  }
  // Also handle non-CDN Spaces URLs
  const spacesOriginPattern = /^https:\/\/wwtrail-uploads\.[a-z0-9]+\.digitaloceanspaces\.com/;
  if (spacesOriginPattern.test(url)) {
    return url.replace(spacesOriginPattern, SPACES_CDN);
  }

  // localhost:3001/uploads/... → CDN
  if (url.startsWith('http://localhost:3001/uploads/')) {
    return `${SPACES_CDN}${url.substring('http://localhost:3001'.length)}`;
  }
  if (url.startsWith('http://localhost:3000/uploads/')) {
    return `${SPACES_CDN}${url.substring('http://localhost:3000'.length)}`;
  }

  // localhost:3001/... (non-uploads path)
  if (url.startsWith('http://localhost:3001')) {
    const path = url.substring('http://localhost:3001'.length);
    return `${SPACES_CDN}${path}`;
  }

  // Production domain /uploads/... → CDN
  if (url.includes('ondigitalocean.app/uploads/')) {
    const idx = url.indexOf('/uploads/');
    return `${SPACES_CDN}${url.substring(idx)}`;
  }

  // Relative /uploads/... → CDN
  if (url.startsWith('/uploads/')) {
    return `${SPACES_CDN}${url}`;
  }

  // Relative uploads/... (no slash) → CDN
  if (url.startsWith('uploads/')) {
    return `${SPACES_CDN}/${url}`;
  }

  return url;
}

/**
 * POST /api/v2/admin/fix-urls
 * Migrate all image URLs in the database to Spaces CDN.
 * Body: { dryRun?: boolean }
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json().catch(() => ({}));
    const dryRun = body.dryRun ?? false;

    const results: Record<string, number> = {};

    // Scalar URL fields
    const scalarFields: Array<{ model: string; fields: string[] }> = [
      { model: 'event', fields: ['logoUrl', 'coverImage'] },
      { model: 'competition', fields: ['logoUrl', 'coverImage'] },
      { model: 'edition', fields: ['logoUrl', 'coverImage'] },
      { model: 'organizer', fields: ['logoUrl'] },
      { model: 'specialSeries', fields: ['logoUrl'] },
      { model: 'service', fields: ['logoUrl', 'coverImage'] },
      { model: 'user', fields: ['avatar'] },
      { model: 'file', fields: ['url'] },
      { model: 'editionPhoto', fields: ['url', 'thumbnail'] },
      { model: 'post', fields: ['coverImage'] },
      { model: 'homeConfiguration', fields: ['heroImage'] },
    ];

    for (const { model, fields } of scalarFields) {
      const prismaModel = (prisma as any)[model];
      if (!prismaModel) continue;

      for (const field of fields) {
        try {
          const records = await prismaModel.findMany({
            where: { [field]: { not: null } },
            select: { id: true, [field]: true },
          });

          for (const record of records) {
            const oldUrl = record[field] as string;
            if (!oldUrl) continue;
            const newUrl = toSpacesCdn(oldUrl);

            if (newUrl !== oldUrl) {
              if (!dryRun) {
                await prismaModel.update({
                  where: { id: record.id },
                  data: { [field]: newUrl },
                });
              }
              const key = `${model}.${field}`;
              results[key] = (results[key] || 0) + 1;
            }
          }
        } catch {}
      }
    }

    // Array URL fields (gallery, heroImages)
    const arrayFields: Array<{ model: string; field: string }> = [
      { model: 'event', field: 'gallery' },
      { model: 'competition', field: 'gallery' },
      { model: 'service', field: 'gallery' },
      { model: 'post', field: 'gallery' },
      { model: 'homeConfiguration', field: 'heroImages' },
    ];

    for (const { model, field } of arrayFields) {
      const prismaModel = (prisma as any)[model];
      if (!prismaModel) continue;

      try {
        const records = await prismaModel.findMany({
          select: { id: true, [field]: true },
        });

        for (const record of records) {
          const arr = record[field];
          if (!Array.isArray(arr) || arr.length === 0) continue;

          let changed = false;
          const newArr = arr.map((url: string) => {
            if (typeof url !== 'string') return url;
            const newUrl = toSpacesCdn(url);
            if (newUrl !== url) changed = true;
            return newUrl;
          });

          if (changed) {
            if (!dryRun) {
              await prismaModel.update({
                where: { id: record.id },
                data: { [field]: field === 'heroImages' ? newArr : newArr },
              });
            }
            const key = `${model}.${field}`;
            results[key] = (results[key] || 0) + 1;
          }
        }
      } catch {}
    }

    const total = Object.values(results).reduce((sum, n) => sum + n, 0);

    return apiSuccess({
      dryRun,
      spacesCdn: SPACES_CDN,
      totalRecordsFixed: total,
      details: results,
    });
  } catch (error) {
    return apiError(error);
  }
}

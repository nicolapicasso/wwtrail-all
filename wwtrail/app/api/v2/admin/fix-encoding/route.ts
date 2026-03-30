import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import prisma from '@/lib/db';

/**
 * GET /api/v2/admin/fix-encoding
 * Scan for records with corrupted encoding (containing ?? characters)
 */
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');

    const results: Record<string, number> = {};

    // Check text fields across models for ?? patterns
    const modelsToCheck: Array<{ model: string; fields: string[] }> = [
      { model: 'event', fields: ['name', 'description', 'city', 'country', 'region'] },
      { model: 'competition', fields: ['name', 'description'] },
      { model: 'edition', fields: ['name', 'description'] },
      { model: 'organizer', fields: ['name', 'description', 'city', 'country'] },
      { model: 'specialSeries', fields: ['name', 'description'] },
      { model: 'service', fields: ['name', 'description', 'city', 'country'] },
      { model: 'eventTranslation', fields: ['name', 'description'] },
      { model: 'competitionTranslation', fields: ['name', 'description'] },
      { model: 'specialSeriesTranslation', fields: ['name', 'description'] },
    ];

    for (const { model, fields } of modelsToCheck) {
      try {
        const prismaModel = (prisma as any)[model];
        if (!prismaModel) continue;

        for (const field of fields) {
          try {
            const count = await prismaModel.count({
              where: { [field]: { contains: '??' } },
            });
            if (count > 0) {
              results[`${model}.${field}`] = count;
            }
          } catch {
            // Field might not exist
          }
        }
      } catch {
        // Model might not exist
      }
    }

    const total = Object.values(results).reduce((sum, n) => sum + n, 0);

    return apiSuccess({
      totalCorruptedRecords: total,
      details: results,
      note: 'The ?? characters indicate data was imported with wrong encoding. Use POST /api/v2/admin/fix-encoding with a JSON export from the source database to fix, or re-import directly with correct UTF-8 encoding using pg_dump --encoding=UTF8.',
    });
  } catch (error) {
    return apiError(error);
  }
}

/**
 * POST /api/v2/admin/fix-encoding
 * Re-import text data from a properly encoded JSON export to fix ?? characters.
 * Body: { entity: 'events' | 'competitions' | ..., data: [...] }
 * Each item in data must have an 'id' field to match with existing records.
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();
    const { entity, data } = body;

    if (!entity || !Array.isArray(data)) {
      return apiSuccess({ error: 'Provide { entity: string, data: Array<{id, ...fields}> }' });
    }

    const prismaModel = (prisma as any)[entity];
    if (!prismaModel) {
      return apiSuccess({ error: `Unknown entity: ${entity}` });
    }

    // Only update text fields, skip relations and dates
    const textFieldsMap: Record<string, string[]> = {
      event: ['name', 'description', 'city', 'country', 'region'],
      competition: ['name', 'description'],
      edition: ['name', 'description'],
      organizer: ['name', 'description', 'city', 'country'],
      specialSeries: ['name', 'description'],
      service: ['name', 'description', 'city', 'country'],
      eventTranslation: ['name', 'description'],
      competitionTranslation: ['name', 'description'],
      specialSeriesTranslation: ['name', 'description'],
    };

    const allowedFields = textFieldsMap[entity];
    if (!allowedFields) {
      return apiSuccess({ error: `No text fields defined for entity: ${entity}` });
    }

    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const item of data) {
      if (!item.id) {
        skipped++;
        continue;
      }

      const updateData: Record<string, string> = {};
      for (const field of allowedFields) {
        if (item[field] !== undefined && item[field] !== null) {
          updateData[field] = item[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        skipped++;
        continue;
      }

      try {
        await prismaModel.update({
          where: { id: item.id },
          data: updateData,
        });
        updated++;
      } catch (e: any) {
        errors.push(`${item.id}: ${e.message?.substring(0, 100)}`);
      }
    }

    return apiSuccess({
      entity,
      total: data.length,
      updated,
      skipped,
      errors: errors.slice(0, 20),
    });
  } catch (error) {
    return apiError(error);
  }
}

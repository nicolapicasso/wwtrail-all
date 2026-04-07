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

    // Also scan SEO llmFaq JSON fields for ??
    let seoCorrupted = 0;
    try {
      const seoRecords = await prisma.sEO.findMany({
        where: { llmFaq: { not: null as any } },
        select: { id: true, llmFaq: true },
      });
      for (const record of seoRecords) {
        const json = JSON.stringify(record.llmFaq);
        if (json.includes('??')) seoCorrupted++;
      }
      if (seoCorrupted > 0) results['seo.llmFaq'] = seoCorrupted;
    } catch {}

    // Scan SEO text fields
    try {
      for (const field of ['metaTitle', 'metaDescription']) {
        const count = await prisma.sEO.count({
          where: { [field]: { contains: '??' } },
        });
        if (count > 0) results[`seo.${field}`] = count;
      }
    } catch {}

    const total = Object.values(results).reduce((sum, n) => sum + n, 0);

    return apiSuccess({
      totalCorruptedRecords: total,
      details: results,
      note: 'Use POST with { action: "auto-fix" } to attempt automatic repair, or { entity, data } to re-import from source.',
    });
  } catch (error) {
    return apiError(error);
  }
}

/**
 * POST /api/v2/admin/fix-encoding
 * Two modes:
 * 1. { action: "auto-fix" } - Automatically strip ?? from all text fields
 * 2. { entity, data: [...] } - Re-import from properly encoded source
 */
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();

    // Mode 1: Automatic fix - strip ?? across all models
    if (body.action === 'auto-fix') {
      return await autoFixEncoding();
    }

    // Mode 2: Re-import from source
    const { entity, data } = body;

    if (!entity || !Array.isArray(data)) {
      return apiSuccess({ error: 'Provide { action: "auto-fix" } or { entity: string, data: Array<{id, ...fields}> }' });
    }

    const prismaModel = (prisma as any)[entity];
    if (!prismaModel) {
      return apiSuccess({ error: `Unknown entity: ${entity}` });
    }

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

/**
 * Auto-fix: strip/replace ?? patterns in all text fields
 */
async function autoFixEncoding() {
  const modelsAndFields: Array<{ model: string; fields: string[] }> = [
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

  const report: Record<string, number> = {};
  let totalFixed = 0;

  for (const { model, fields } of modelsAndFields) {
    const prismaModel = (prisma as any)[model];
    if (!prismaModel) continue;

    for (const field of fields) {
      try {
        const records = await prismaModel.findMany({
          where: { [field]: { contains: '??' } },
          select: { id: true, [field]: true },
        });

        for (const record of records) {
          const original = record[field] as string;
          // Remove standalone ?? and clean up resulting spaces
          const fixed = original
            .replace(/\?\?/g, '')
            .replace(/\s{2,}/g, ' ')
            .trim();

          if (fixed !== original) {
            await prismaModel.update({
              where: { id: record.id },
              data: { [field]: fixed },
            });
            totalFixed++;
          }
        }

        if (records.length > 0) {
          report[`${model}.${field}`] = records.length;
        }
      } catch {}
    }
  }

  // Fix SEO llmFaq JSON
  let seoFixed = 0;
  try {
    const seoRecords = await prisma.sEO.findMany({
      where: { llmFaq: { not: null as any } },
      select: { id: true, llmFaq: true },
    });

    for (const record of seoRecords) {
      const json = JSON.stringify(record.llmFaq);
      if (json.includes('??')) {
        const fixed = json.replace(/\?\?/g, '').replace(/\s{2,}/g, ' ');
        await prisma.sEO.update({
          where: { id: record.id },
          data: { llmFaq: JSON.parse(fixed) },
        });
        seoFixed++;
      }
    }
    if (seoFixed > 0) report['seo.llmFaq'] = seoFixed;
  } catch {}

  // Fix SEO text fields
  try {
    for (const field of ['metaTitle', 'metaDescription']) {
      const records = await prisma.sEO.findMany({
        where: { [field]: { contains: '??' } },
        select: { id: true, [field]: true },
      });
      for (const record of records) {
        const fixed = (record[field] as string).replace(/\?\?/g, '').replace(/\s{2,}/g, ' ').trim();
        await prisma.sEO.update({
          where: { id: record.id },
          data: { [field]: fixed },
        });
      }
      if (records.length > 0) report[`seo.${field}`] = records.length;
      totalFixed += records.length;
    }
  } catch {}

  totalFixed += seoFixed;

  return apiSuccess({
    action: 'auto-fix',
    totalFixed,
    details: report,
    note: 'Stripped ?? characters from all affected text fields. Characters that were replaced by ?? during import are lost — re-import from source if original data is available.',
  });
}

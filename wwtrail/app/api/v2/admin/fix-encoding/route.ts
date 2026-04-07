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
      { model: 'competitionType', fields: ['name', 'description'] },
      { model: 'terrainType', fields: ['name', 'description'] },
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

    // Mode 2: Fix catalog names
    if (body.action === 'fix-catalogs') {
      return await fixCatalogEncoding();
    }

    // Mode 3: Clear corrupted SEO FAQs (so they regenerate fresh)
    if (body.action === 'fix-seo-faq') {
      return await fixCorruptedFaqs();
    }

    // Mode 4: Re-import from source
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
      competitionType: ['name', 'description'],
      terrainType: ['name', 'description'],
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
    { model: 'competitionType', fields: ['name', 'description'] },
    { model: 'terrainType', fields: ['name', 'description'] },
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

/**
 * Fix catalog encoding: update terrain types and competition types
 * by slug (which doesn't have accents and is correct)
 */
async function fixCatalogEncoding() {
  // Known correct terrain type names (slug → correct name)
  const terrainFixes: Record<string, string> = {
    'alta-montana': 'Alta montaña',
    'pista-de-tierra': 'Pista de tierra',
    'bosques-y-senderos': 'Bosques y senderos',
    'terreno-muy-tecnico': 'Terreno muy técnico',
    'selva-jungla': 'Selva/Jungla',
    'grandes-lagos': 'Grandes lagos',
    'llanuras': 'Llanuras',
    'desiertos': 'Desiertos',
    'costa-y-playa': 'Costa y playa',
    'terreno-mixto': 'Terreno mixto',
    'senderos-boscosos': 'Senderos boscosos',
    'desierto': 'Desierto',
    'montana-media': 'Montaña media',
    'montana-tecnica': 'Montaña técnica',
    'mixto-asfalto-sendero': 'Mixto asfalto/sendero',
  };

  // Known correct competition type names
  const competitionTypeFixes: Record<string, string> = {
    'trail': 'Trail',
    'ultra-trail': 'Ultra Trail',
    'maraton-de-montana': 'Maratón de montaña',
    'media-maraton-de-montana': 'Media maratón de montaña',
    'carrera-vertical': 'Carrera vertical',
    'sky-running': 'Sky Running',
    'kilómetro-vertical': 'Kilómetro vertical',
    'kilometro-vertical': 'Kilómetro vertical',
    'cross-country': 'Cross Country',
    'canicross': 'Canicross',
    'raquetas-de-nieve': 'Raquetas de nieve',
    'marcha-nordica': 'Marcha nórdica',
    'senderismo': 'Senderismo',
    'carrera-por-etapas': 'Carrera por etapas',
  };

  let fixed = 0;
  const details: string[] = [];

  // Fix terrain types
  for (const [slug, correctName] of Object.entries(terrainFixes)) {
    try {
      const existing = await prisma.terrainType.findUnique({ where: { slug } });
      if (existing && existing.name !== correctName) {
        await prisma.terrainType.update({
          where: { slug },
          data: { name: correctName, description: `Terreno tipo ${correctName.toLowerCase()}` },
        });
        details.push(`terrainType: "${existing.name}" → "${correctName}"`);
        fixed++;
      }
    } catch {}
  }

  // Fix competition types
  for (const [slug, correctName] of Object.entries(competitionTypeFixes)) {
    try {
      const existing = await prisma.competitionType.findUnique({ where: { slug } });
      if (existing && existing.name !== correctName) {
        await prisma.competitionType.update({
          where: { slug },
          data: { name: correctName, description: `Tipo de competición: ${correctName}` },
        });
        details.push(`competitionType: "${existing.name}" → "${correctName}"`);
        fixed++;
      }
    } catch {}
  }

  return apiSuccess({
    action: 'fix-catalogs',
    totalFixed: fixed,
    details,
  });
}

/**
 * Clear corrupted SEO FAQ entries so they can be regenerated fresh by the AI
 */
async function fixCorruptedFaqs() {
  let cleared = 0;
  let metaFixed = 0;
  const details: string[] = [];

  // Find all SEO records with corrupted llmFaq
  const seoRecords = await prisma.sEO.findMany({
    select: { id: true, entityType: true, entityId: true, slug: true, llmFaq: true, metaTitle: true, metaDescription: true },
  });

  for (const record of seoRecords) {
    const faqJson = JSON.stringify(record.llmFaq);
    const hasBadFaq = faqJson.includes('??');
    const hasBadTitle = record.metaTitle?.includes('??');
    const hasBadDesc = record.metaDescription?.includes('??');

    if (hasBadFaq || hasBadTitle || hasBadDesc) {
      const updateData: any = {};

      if (hasBadFaq) {
        // Null out the FAQ so it gets regenerated
        updateData.llmFaq = null;
        updateData.autoGenerated = false;
        cleared++;
      }

      if (hasBadTitle) {
        updateData.metaTitle = record.metaTitle!.replace(/\?\?/g, '').replace(/\s{2,}/g, ' ').trim();
        metaFixed++;
      }

      if (hasBadDesc) {
        updateData.metaDescription = record.metaDescription!.replace(/\?\?/g, '').replace(/\s{2,}/g, ' ').trim();
        metaFixed++;
      }

      await prisma.sEO.update({
        where: { id: record.id },
        data: updateData,
      });

      details.push(`${record.entityType}/${record.slug || record.entityId}: ${hasBadFaq ? 'FAQ cleared' : ''}${hasBadTitle || hasBadDesc ? ' meta fixed' : ''}`);
    }
  }

  return apiSuccess({
    action: 'fix-seo-faq',
    faqsCleared: cleared,
    metaFieldsFixed: metaFixed,
    totalAffected: details.length,
    details: details.slice(0, 50),
    note: 'Corrupted FAQs have been cleared (set to null). They will be regenerated automatically when the SEO system runs, or you can trigger regeneration manually from the SEO admin panel.',
  });
}

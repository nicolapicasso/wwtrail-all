import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const slug = searchParams.get('slug');
    const lang = searchParams.get('lang') || 'ES';
    const result = await SEOService.get({ entityType, entityId, slug, language: lang });
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const result = await SEOService.generate(data);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

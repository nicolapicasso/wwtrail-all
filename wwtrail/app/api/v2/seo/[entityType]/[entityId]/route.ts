import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { entityType: string; entityId: string } }) {
  try {
    const { entityType, entityId } = await params;
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'ES';

    const seo = await SEOService.getSEO(entityType, entityId, language as any);
    return apiSuccess(seo);
  } catch (error) { return apiError(error); }
}

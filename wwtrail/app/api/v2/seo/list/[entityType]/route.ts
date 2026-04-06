import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { entityType: string } }) {
  try {
    const { entityType } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const result = await SEOService.listSEO(entityType, page, limit);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

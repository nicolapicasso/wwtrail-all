import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { entityType: string } }) {
  try {
    const { entityType } = await params;
    const config = await SEOService.getConfig(entityType);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

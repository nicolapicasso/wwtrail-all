import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET() {
  try {
    const configs = await SEOService.listConfigs();
    return apiSuccess(configs);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const config = await SEOService.upsertConfig(data);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

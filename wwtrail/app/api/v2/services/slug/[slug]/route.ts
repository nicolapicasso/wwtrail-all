import { NextRequest } from 'next/server';
import { ServiceService } from '@/lib/services/service.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const service = await ServiceService.getBySlug(params.slug, lang);
    return apiSuccess(service);
  } catch (error) {
    return apiError(error);
  }
}

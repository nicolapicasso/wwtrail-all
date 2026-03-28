import { NextRequest } from 'next/server';
import { LandingService } from '@/lib/services/landing.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const landing = await LandingService.getBySlug(params.slug, lang);
    return apiSuccess(landing);
  } catch (error) { return apiError(error); }
}

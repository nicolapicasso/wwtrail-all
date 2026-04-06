import { NextRequest } from 'next/server';
import { SpecialSeriesService } from '@/lib/services/specialSeries.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const { slug } = await params;
    const series = await SpecialSeriesService.getBySlug(slug);
    return apiSuccess(series);
  } catch (error) { return apiError(error); }
}

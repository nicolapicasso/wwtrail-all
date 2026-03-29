import { NextRequest } from 'next/server';
import { CompetitionService } from '@/lib/services/competition.service';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const competition = await CompetitionService.findBySlug(params.slug);
    return apiSuccess(competition);
  } catch (error: any) {
    if (error?.message?.includes('not found')) {
      return apiError(new ApiError('Competition not found', 404));
    }
    return apiError(error);
  }
}

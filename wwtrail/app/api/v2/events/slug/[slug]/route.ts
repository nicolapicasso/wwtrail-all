import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { apiSuccess, apiError, ApiError } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const event = await EventService.findBySlug(params.slug);
    return apiSuccess(event);
  } catch (error: any) {
    if (error?.message?.includes('not found')) {
      return apiError(new ApiError('Event not found', 404));
    }
    return apiError(error);
  }
}

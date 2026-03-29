import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const event = await EventService.getBySlug(params.slug, lang);
    return apiSuccess(event);
  } catch (error) {
    return apiError(error);
  }
}

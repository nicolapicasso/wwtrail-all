import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/events/check-slug/:slug — check if an event slug is available
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeId = searchParams.get('excludeId') || undefined;
    const available = await EventService.isSlugAvailable(params.slug, excludeId);
    return apiSuccess({ available });
  } catch (error) {
    return apiError(error);
  }
}

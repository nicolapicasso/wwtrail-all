import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/events/my-events
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const params: any = {};

    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }

    const result = await EventService.getMyEvents(user.id, user.role, params);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

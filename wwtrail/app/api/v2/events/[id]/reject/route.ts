import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// POST /api/v2/events/:id/reject — reject (cancel) an event (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const event = await EventService.update(params.id, { status: 'CANCELLED' }, user.id);
    return apiSuccess(event);
  } catch (error) {
    return apiError(error);
  }
}

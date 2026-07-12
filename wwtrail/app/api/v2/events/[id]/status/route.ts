import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// PATCH /api/v2/events/:id/status — update event status (admin/organizer)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const { status } = await request.json();
    const event = await EventService.update(params.id, { status }, user.id);
    return apiSuccess(event);
  } catch (error) {
    return apiError(error);
  }
}

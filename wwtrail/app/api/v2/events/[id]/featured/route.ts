import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// PATCH /api/v2/events/:id/featured — toggle featured status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const current = await EventService.findById(params.id);
    const event = await EventService.update(
      params.id,
      { featured: !(current as any).featured },
      user.id
    );
    return apiSuccess(event);
  } catch (error) {
    return apiError(error);
  }
}

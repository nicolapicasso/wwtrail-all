import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

// GET /api/v2/events/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await EventService.findById(params.id);
    return apiSuccess(event);
  } catch (error: any) {
    if (error?.message?.includes('not found')) {
      return apiError(new ApiError('Event not found', 404));
    }
    return apiError(error);
  }
}

// PUT /api/v2/events/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const event = await EventService.update(params.id, data, user.id);
    return apiSuccess(event);
  } catch (error) {
    return apiError(error);
  }
}

// DELETE /api/v2/events/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ADMIN');
    await EventService.delete(params.id, user.id);
    return apiSuccess({ message: 'Event deleted' });
  } catch (error) {
    return apiError(error);
  }
}

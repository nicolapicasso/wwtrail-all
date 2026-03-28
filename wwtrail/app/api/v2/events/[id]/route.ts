import { NextRequest } from 'next/server';
import { EventService } from '@/lib/services/event.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/events/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await EventService.getById(params.id);
    return apiSuccess(event);
  } catch (error) {
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
    const event = await EventService.update(params.id, data, user.id, user.role);
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
    await EventService.delete(params.id);
    return apiSuccess({ message: 'Event deleted' });
  } catch (error) {
    return apiError(error);
  }
}

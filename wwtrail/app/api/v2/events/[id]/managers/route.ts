import { NextRequest } from 'next/server';
import { requireAuth, requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { eventManagerService } from '@/lib/services/eventManager.service';

// GET /api/v2/events/:id/managers
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth(request);
    const { id } = await params;
    const managers = await eventManagerService.getEventManagers(id);
    return apiSuccess(managers);
  } catch (error) {
    return apiError(error);
  }
}

// POST /api/v2/events/:id/managers - Assign a user as manager of the event (ADMIN)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireRole(request, 'ADMIN');
    const { id } = await params;
    const { userId } = await request.json();
    if (!userId) throw new ApiError('userId requerido', 400);
    const manager = await eventManagerService.addManager({ eventId: id, userId, assignedById: admin.id });
    return apiSuccess(manager, 201);
  } catch (error: any) {
    if (error && !(error instanceof ApiError) && typeof error.message === 'string') {
      // Map service validation errors to 400 with their message.
      return apiError(new ApiError(error.message, 400));
    }
    return apiError(error);
  }
}

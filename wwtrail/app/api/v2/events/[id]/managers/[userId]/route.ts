import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { eventManagerService } from '@/lib/services/eventManager.service';

// DELETE /api/v2/events/:id/managers/:userId - Remove a manager from the event (ADMIN)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    await requireRole(request, 'ADMIN');
    const { id, userId } = await params;
    await eventManagerService.removeManager(id, userId);
    return apiSuccess({ removed: true });
  } catch (error: any) {
    if (error && !(error instanceof ApiError) && typeof error.message === 'string') {
      const status = error.message.includes('not found') ? 404 : 400;
      return apiError(new ApiError(error.message, status));
    }
    return apiError(error);
  }
}

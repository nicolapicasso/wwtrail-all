import { NextRequest } from 'next/server';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';
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

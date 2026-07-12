import { NextRequest } from 'next/server';
import { CompetitionService } from '@/lib/services/competition.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

// POST /api/v2/events/:id/competitions/reorder
// Body: { orderedIds: string[] }  (ORGANIZER/ADMIN)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const body = await request.json().catch(() => ({}));
    const orderedIds = body?.orderedIds ?? body?.ids ?? body?.order;
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      throw new ApiError('orderedIds (array) is required', 400);
    }
    const result = await CompetitionService.reorderWithinEvent(params.id, orderedIds, user.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// Alias PATCH.
export const PATCH = POST;

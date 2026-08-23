import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { OrganizerInviteService } from '@/lib/services/organizerInvite.service';

// POST /api/v2/events/:id/invite-organizer  (ADMIN)
// Creates/links the organizer user and emails them a magic link to manage the event.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const { id } = await params;
    const result = await OrganizerInviteService.createInvite(id, user.id);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

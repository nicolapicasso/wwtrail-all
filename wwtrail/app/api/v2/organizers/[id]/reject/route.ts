import { NextRequest } from 'next/server';
import { OrganizerService } from '@/lib/services/organizer.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const organizer = await OrganizerService.reject(params.id, user.id);
    return apiSuccess(organizer);
  } catch (error) {
    return apiError(error);
  }
}

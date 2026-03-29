import { NextRequest } from 'next/server';
import { OrganizerService } from '@/lib/services/organizer.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const organizer = await OrganizerService.getById(params.id);
    return apiSuccess(organizer);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const organizer = await OrganizerService.update(params.id, data, user.id);
    return apiSuccess(organizer);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ADMIN');
    await OrganizerService.delete(params.id, user.id);
    return apiSuccess({ message: 'Organizer deleted' });
  } catch (error) {
    return apiError(error);
  }
}

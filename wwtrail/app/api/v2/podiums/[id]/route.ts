import { NextRequest } from 'next/server';
import { EditionPodiumService } from '@/lib/services/editionPodium.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const podium = await EditionPodiumService.update(params.id, data);
    return apiSuccess(podium);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    await EditionPodiumService.delete(params.id);
    return apiSuccess({ message: 'Podium deleted' });
  } catch (error) { return apiError(error); }
}

import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const edition = await EditionService.findById(params.id);
    return apiSuccess(edition);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const edition = await EditionService.update(params.id, data, user.id, user.role);
    return apiSuccess(edition);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ADMIN');
    await EditionService.delete(params.id);
    return apiSuccess({ message: 'Edition deleted' });
  } catch (error) {
    return apiError(error);
  }
}

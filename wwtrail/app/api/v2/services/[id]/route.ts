import { NextRequest } from 'next/server';
import { ServiceService } from '@/lib/services/service.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const service = await ServiceService.getById(params.id);
    return apiSuccess(service);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const service = await ServiceService.update(params.id, data, user.id, user.role);
    return apiSuccess(service);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    await ServiceService.delete(params.id);
    return apiSuccess({ message: 'Service deleted' });
  } catch (error) {
    return apiError(error);
  }
}

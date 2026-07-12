import { NextRequest } from 'next/server';
import { ServiceService } from '@/lib/services/service.service';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';

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
    const { id } = await params;

    // Ownership check: an organizer may only edit their own services.
    if (user.role !== 'ADMIN') {
      const existing = await ServiceService.getById(id);
      if (!existing) throw new ApiError('Service not found', 404);
      if ((existing as any).organizerId !== user.id) {
        throw new ApiError('Forbidden', 403);
      }
    }

    const data = await request.json();
    const service = await ServiceService.update(id, data);
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

// Alias: some clients use PATCH for partial updates.
export const PATCH = PUT;

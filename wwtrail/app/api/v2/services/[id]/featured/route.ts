import { NextRequest } from 'next/server';
import { ServiceService } from '@/lib/services/service.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const service = await ServiceService.toggleFeatured(params.id);
    return apiSuccess(service);
  } catch (error) {
    return apiError(error);
  }
}

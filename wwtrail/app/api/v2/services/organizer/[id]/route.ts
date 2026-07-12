import { NextRequest } from 'next/server';
import { ServiceService } from '@/lib/services/service.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth(request);
    const services = await ServiceService.getByOrganizer(params.id);
    return apiSuccess(services);
  } catch (error) {
    return apiError(error);
  }
}

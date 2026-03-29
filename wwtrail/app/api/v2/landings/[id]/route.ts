import { NextRequest } from 'next/server';
import { LandingService } from '@/lib/services/landing.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const landing = await LandingService.getById(params.id);
    return apiSuccess(landing);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const landing = await LandingService.update(params.id, data);
    return apiSuccess(landing);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    await LandingService.delete(params.id);
    return apiSuccess({ message: 'Landing deleted' });
  } catch (error) { return apiError(error); }
}

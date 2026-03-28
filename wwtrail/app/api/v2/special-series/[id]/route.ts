import { NextRequest } from 'next/server';
import { SpecialSeriesService } from '@/lib/services/specialSeries.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const series = await SpecialSeriesService.getById(params.id);
    return apiSuccess(series);
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const series = await SpecialSeriesService.update(params.id, data, user.id, user.role);
    return apiSuccess(series);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    await SpecialSeriesService.delete(params.id);
    return apiSuccess({ message: 'Special series deleted' });
  } catch (error) { return apiError(error); }
}

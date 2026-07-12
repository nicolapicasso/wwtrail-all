import { NextRequest } from 'next/server';
import { HomeConfigurationService } from '@/lib/services/homeConfiguration.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const data = await request.json();
    const config = await HomeConfigurationService.updateFull(id, data);
    return apiSuccess(config);
  } catch (error) { return apiError(error); }
}

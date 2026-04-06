import { NextRequest } from 'next/server';
import { HomeConfigurationService } from '@/lib/services/homeConfiguration.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const data = await request.json();
    const block = await HomeConfigurationService.updateBlock(id, data);
    return apiSuccess(block);
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    await HomeConfigurationService.deleteBlock(id);
    return apiSuccess({ message: 'Block deleted' });
  } catch (error) { return apiError(error); }
}

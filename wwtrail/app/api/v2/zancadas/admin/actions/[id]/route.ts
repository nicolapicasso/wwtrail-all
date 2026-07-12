import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();
    const action = await zancadasService.updateAction(params.id, body);
    return apiSuccess(action);
  } catch (error) {
    return apiError(error);
  }
}

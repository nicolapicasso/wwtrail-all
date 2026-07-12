import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const actions = await zancadasService.getAllActions();
    return apiSuccess(actions);
  } catch (error) {
    return apiError(error);
  }
}

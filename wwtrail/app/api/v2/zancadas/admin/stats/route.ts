import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const stats = await zancadasService.getStats();
    return apiSuccess(stats);
  } catch (error) {
    return apiError(error);
  }
}

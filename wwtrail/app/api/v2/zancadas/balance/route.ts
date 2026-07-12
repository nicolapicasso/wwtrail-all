import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const balance = await zancadasService.getUserBalance(user.id);
    return apiSuccess(balance);
  } catch (error) {
    return apiError(error);
  }
}

import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const config = await zancadasService.getConfig();
    return apiSuccess(config);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();
    await zancadasService.updateConfig(body);
    const config = await zancadasService.getConfig();
    return apiSuccess(config);
  } catch (error) {
    return apiError(error);
  }
}

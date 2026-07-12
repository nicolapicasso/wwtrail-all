import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const zancadas = parseInt(searchParams.get('zancadas') || '0', 10);
    const result = await zancadasService.getEquivalentCompetitions(zancadas);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

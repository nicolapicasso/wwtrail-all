import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
    const transactions = await zancadasService.getUserTransactions(user.id, page, pageSize);
    return apiSuccess(transactions);
  } catch (error) {
    return apiError(error);
  }
}

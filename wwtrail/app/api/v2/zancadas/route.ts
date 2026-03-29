import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireAuth, requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'balance') {
      const user = await requireAuth(request);
      const balance = await zancadasService.getBalance(user.id);
      return apiSuccess(balance);
    }
    if (action === 'transactions') {
      const user = await requireAuth(request);
      const transactions = await zancadasService.getTransactions(user.id);
      return apiSuccess(transactions);
    }

    return apiError(new Error('Invalid action'));
  } catch (error) { return apiError(error); }
}

import { NextRequest } from 'next/server';
import { zancadasService } from '@/lib/services/zancadas.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/zancadas/admin/test-connection  (ADMIN)
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const result = await zancadasService.testConnection();
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// POST alias for clients that trigger the test via POST.
export const POST = GET;

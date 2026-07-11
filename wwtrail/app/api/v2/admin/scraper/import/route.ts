import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { ScraperService } from '@/lib/services/scraper/scraper.service';

// POST /api/v2/admin/scraper/import - Create the reviewed graph (admin)
export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const body = await request.json();
    if (!body.graph?.event?.name) {
      throw new ApiError('Falta el grafo a importar', 400);
    }
    const result = await ScraperService.importGraph(body.graph, user.id, user.role);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

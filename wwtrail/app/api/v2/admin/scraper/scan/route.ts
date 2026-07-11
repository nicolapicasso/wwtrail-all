import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { ScraperService } from '@/lib/services/scraper/scraper.service';

// POST /api/v2/admin/scraper/scan - Fetch + AI-extract + dedup a URL/HTML (admin)
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json();
    if (!body.url && !body.html) {
      throw new ApiError('Proporciona una URL o HTML a escanear', 400);
    }
    const result = await ScraperService.scan({ url: body.url, html: body.html, mode: body.mode });
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { SiteConfigService } from '@/lib/services/siteConfig.service';

// GET /api/v2/admin/site-config - Get site config (admin only)
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const config = await SiteConfigService.get(true);
    return apiSuccess(config);
  } catch (error) {
    return apiError(error);
  }
}

// PUT /api/v2/admin/site-config - Update site config (admin only)
export async function PUT(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const data = await request.json();
    const config = await SiteConfigService.update(data);
    return apiSuccess(config);
  } catch (error) {
    return apiError(error);
  }
}

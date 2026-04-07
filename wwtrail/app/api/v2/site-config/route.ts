import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/auth';
import { SiteConfigService } from '@/lib/services/siteConfig.service';

// GET /api/v2/site-config - Get public site styles (no auth)
export async function GET(_request: NextRequest) {
  try {
    const config = await SiteConfigService.getPublicStyles();
    return apiSuccess(config);
  } catch (error) {
    return apiError(error);
  }
}

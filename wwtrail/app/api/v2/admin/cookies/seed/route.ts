import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { LegalService } from '@/lib/services/legal.service';

// POST /api/v2/admin/cookies/seed
// Auto-seed the catalog from configured integrations (GA4/Ads via GTM, Brevo)
// plus the platform's necessary cookies. Never overwrites existing entries.
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    return apiSuccess(await LegalService.seedFromIntegrations());
  } catch (e) { return apiError(e); }
}

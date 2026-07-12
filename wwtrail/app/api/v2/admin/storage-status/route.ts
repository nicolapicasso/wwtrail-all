import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { getSpacesStatus } from '@/lib/services/spaces.client';

// GET /api/v2/admin/storage-status - Diagnose the image storage backend (admin).
// Returns whether Spaces is active and which env vars are present (no secrets).
export async function GET(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    return apiSuccess(getSpacesStatus());
  } catch (error) {
    return apiError(error);
  }
}

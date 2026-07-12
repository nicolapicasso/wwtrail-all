import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// POST /api/v2/editions/:id/toggle-active  (ORGANIZER/ADMIN)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const result = await EditionService.toggleActive(params.id, user.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// Alias PATCH.
export const PATCH = POST;

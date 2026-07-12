import { NextRequest } from 'next/server';
import userEditionService from '@/lib/services/userEdition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/editions/:id/participants  (ORGANIZER/ADMIN)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const result = await userEditionService.getEditionParticipants(params.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

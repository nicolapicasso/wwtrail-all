import { NextRequest } from 'next/server';
import userEditionService from '@/lib/services/userEdition.service';
import { apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/editions/:id/participants
// Public: the participant/results list is shown on the public edition page.
export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await userEditionService.getEditionParticipants(params.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

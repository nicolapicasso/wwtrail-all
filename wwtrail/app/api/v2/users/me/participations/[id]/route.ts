import { NextRequest } from 'next/server';
import userEditionService from '@/lib/services/userEdition.service';
import { requireAuth, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/users/me/participations/:id  (id = editionId)
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    const result = await userEditionService.getParticipation(user.id, params.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// POST /api/v2/users/me/participations/:id  (create or update)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    const data = await request.json();
    const result = await userEditionService.upsertParticipation(user.id, params.id, data);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

// Alias: some clients use PUT for the upsert.
export const PUT = POST;

// DELETE /api/v2/users/me/participations/:id
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    const result = await userEditionService.deleteParticipation(user.id, params.id);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

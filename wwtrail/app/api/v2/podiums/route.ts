import { NextRequest } from 'next/server';
import { EditionPodiumService } from '@/lib/services/editionPodium.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const editionId = searchParams.get('editionId');
    if (!editionId) return apiError(new Error('editionId required'));
    const result = await EditionPodiumService.getByEdition(editionId);
    return apiSuccess(result);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const podium = await EditionPodiumService.create(data);
    return apiSuccess(podium, 201);
  } catch (error) { return apiError(error); }
}

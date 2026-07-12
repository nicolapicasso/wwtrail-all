import { NextRequest } from 'next/server';
import { EditionPodiumService } from '@/lib/services/editionPodium.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// GET /api/v2/editions/:id/podiums
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const podiums = await EditionPodiumService.getByEdition(params.id);
    return apiSuccess(podiums);
  } catch (error) {
    return apiError(error);
  }
}

// POST /api/v2/editions/:id/podiums
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const podium = await EditionPodiumService.create(params.id, data);
    return apiSuccess(podium, 201);
  } catch (error) {
    return apiError(error);
  }
}

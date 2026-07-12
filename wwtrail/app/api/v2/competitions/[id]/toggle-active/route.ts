import { NextRequest } from 'next/server';
import { CompetitionService } from '@/lib/services/competition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// POST /api/v2/competitions/:id/toggle-active — toggle competition featured status (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ADMIN');
    const competition = await CompetitionService.toggleFeatured(params.id, user.id);
    return apiSuccess(competition);
  } catch (error) {
    return apiError(error);
  }
}

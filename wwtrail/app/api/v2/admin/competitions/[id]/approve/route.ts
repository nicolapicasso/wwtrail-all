import { NextRequest } from 'next/server';
import { CompetitionService } from '@/lib/services/competition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    const competition = await CompetitionService.update(id, { status: 'PUBLISHED' });
    return apiSuccess(competition);
  } catch (error) { return apiError(error); }
}

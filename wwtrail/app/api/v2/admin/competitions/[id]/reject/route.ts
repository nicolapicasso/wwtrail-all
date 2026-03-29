import { NextRequest } from 'next/server';
import { CompetitionService } from '@/lib/services/competition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    const { id } = await params;
    await CompetitionService.delete(id);
    return apiSuccess({ message: 'Competition rejected' });
  } catch (error) { return apiError(error); }
}

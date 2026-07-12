import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// POST /api/v2/competitions/:id/editions/bulk - Create editions in bulk (ORGANIZER/ADMIN)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const { years } = await request.json();
    const editions = await EditionService.createBulk(params.id, years, user.id);
    return apiSuccess(editions, 201);
  } catch (error) {
    return apiError(error);
  }
}

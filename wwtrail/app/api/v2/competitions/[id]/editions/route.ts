import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// POST /api/v2/competitions/:id/editions - Create an edition (ORGANIZER/ADMIN)
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const edition = await EditionService.create(params.id, data, user.id);
    return apiSuccess(edition, 201);
  } catch (error) { return apiError(error); }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const options: any = {};
    if (searchParams.get('includeInactive') === 'true') options.includeInactive = true;
    if (searchParams.get('sortOrder')) options.sortOrder = searchParams.get('sortOrder');

    const editions = await EditionService.findByCompetition(id, options);
    return apiSuccess(editions);
  } catch (error) { return apiError(error); }
}

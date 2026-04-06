import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { apiSuccess, apiError } from '@/lib/auth';

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

import { NextRequest } from 'next/server';
import { OrganizerService } from '@/lib/services/organizer.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const organizer = await OrganizerService.getBySlug(params.slug);
    return apiSuccess(organizer);
  } catch (error) {
    return apiError(error);
  }
}

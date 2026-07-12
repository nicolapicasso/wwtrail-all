import { NextRequest } from 'next/server';
import { OrganizerService } from '@/lib/services/organizer.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const result = await OrganizerService.checkSlug(params.slug);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

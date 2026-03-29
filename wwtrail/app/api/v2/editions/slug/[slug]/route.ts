import { NextRequest } from 'next/server';
import { EditionService } from '@/lib/services/edition.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const withInheritance = searchParams.get('withInheritance') === 'true';

    if (withInheritance) {
      const edition = await EditionService.getWithInheritanceBySlug(params.slug);
      return apiSuccess(edition);
    }

    const edition = await EditionService.findBySlug(params.slug);
    return apiSuccess(edition);
  } catch (error) {
    return apiError(error);
  }
}

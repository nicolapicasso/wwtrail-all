import { NextRequest } from 'next/server';
import { FooterService } from '@/lib/services/footer.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'ES';
    const content = await FooterService.getFooterForLanguage(language as any);
    return apiSuccess(content);
  } catch (error) { return apiError(error); }
}

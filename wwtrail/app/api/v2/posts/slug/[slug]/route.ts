import { NextRequest } from 'next/server';
import { PostsService } from '@/lib/services/posts.service';
import { apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || undefined;
    const { slug } = await params;
    const post = await PostsService.getBySlug(slug);
    return apiSuccess(post);
  } catch (error) {
    return apiError(error);
  }
}

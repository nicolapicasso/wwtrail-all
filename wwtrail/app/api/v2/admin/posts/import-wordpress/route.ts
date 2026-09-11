import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError, ApiError } from '@/lib/auth';
import { WordpressImportService } from '@/lib/services/wordpressImport.service';

// POST /api/v2/admin/posts/import-wordpress
// Body: { posts: WpPostInput[], language, category, statusOverride?, onlyDrafts? }
export async function POST(request: NextRequest) {
  try {
    const auth = await requireRole(request, 'ADMIN');
    const body = await request.json();
    const posts = Array.isArray(body.posts) ? body.posts : [];
    if (posts.length === 0) throw new ApiError('No posts to import', 400);
    const result = await WordpressImportService.importPosts(posts, {
      authorId: auth.id,
      language: body.language || 'ES',
      category: body.category || 'GENERAL',
      statusOverride: body.statusOverride,
      onlyDrafts: !!body.onlyDrafts,
    });
    return apiSuccess(result);
  } catch (e) { return apiError(e); }
}

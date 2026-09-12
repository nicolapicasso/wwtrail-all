import { NextRequest } from 'next/server';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';
import { WordpressImportService } from '@/lib/services/wordpressImport.service';

// POST /api/v2/admin/posts/migrate-images  { offset?, limit? }
// Download external images of already-imported posts into our CDN and rewrite
// the content/featured image to our own URLs. Batched; call repeatedly until
// `remaining` is 0.
export async function POST(request: NextRequest) {
  try {
    await requireRole(request, 'ADMIN');
    const body = await request.json().catch(() => ({}));
    const offset = Number.isFinite(body.offset) ? Math.max(0, body.offset) : 0;
    const limit = Number.isFinite(body.limit) ? Math.min(50, Math.max(1, body.limit)) : 15;
    const result = await WordpressImportService.migratePostImages(offset, limit);
    return apiSuccess(result);
  } catch (e) { return apiError(e); }
}

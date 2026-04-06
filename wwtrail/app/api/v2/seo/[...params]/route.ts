import { NextRequest } from 'next/server';
import { SEOService } from '@/lib/services/seo.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

// Catch-all for:
// GET /api/v2/seo/config
// GET /api/v2/seo/config/:entityType
// GET /api/v2/seo/list/:entityType
// GET /api/v2/seo/:entityType/:entityId
// POST /api/v2/seo/generate
// POST /api/v2/seo/regenerate
// PUT /api/v2/seo/:id
// DELETE /api/v2/seo/:id
export async function GET(request: NextRequest, { params }: { params: { params: string[] } }) {
  try {
    const segments = (await params).params;
    const { searchParams } = new URL(request.url);

    // /seo/config
    if (segments[0] === 'config' && !segments[1]) {
      const configs = await SEOService.listConfigs();
      return apiSuccess(configs);
    }

    // /seo/config/:entityType
    if (segments[0] === 'config' && segments[1]) {
      const config = await SEOService.getConfig(segments[1]);
      return apiSuccess(config);
    }

    // /seo/list/:entityType
    if (segments[0] === 'list' && segments[1]) {
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const result = await SEOService.listSEO(segments[1], page, limit);
      return apiSuccess(result);
    }

    // /seo/:entityType/:entityId
    if (segments[0] && segments[1]) {
      const language = searchParams.get('language') || 'ES';
      const seo = await SEOService.getSEO(segments[0], segments[1], language as any);
      return apiSuccess(seo);
    }

    return apiSuccess(null);
  } catch (error) { return apiError(error); }
}

export async function POST(request: NextRequest, { params }: { params: { params: string[] } }) {
  try {
    await requireRole(request, 'ADMIN');
    const segments = (await params).params;
    const data = await request.json();

    // /seo/generate
    if (segments[0] === 'generate') {
      const result = await SEOService.generateAndSave(data);
      return apiSuccess(result);
    }

    // /seo/regenerate
    if (segments[0] === 'regenerate') {
      const result = await SEOService.regenerateSEO(data);
      return apiSuccess(result);
    }

    // /seo/config
    if (segments[0] === 'config') {
      const config = await SEOService.upsertConfig(data);
      return apiSuccess(config);
    }

    return apiError(new Error('Unknown route'));
  } catch (error) { return apiError(error); }
}

export async function PUT(request: NextRequest, { params }: { params: { params: string[] } }) {
  try {
    await requireRole(request, 'ADMIN');
    const segments = (await params).params;
    const data = await request.json();
    // /seo/:id
    if (segments[0]) {
      const result = await SEOService.updateSEO(segments[0], data);
      return apiSuccess(result);
    }
    return apiError(new Error('id required'));
  } catch (error) { return apiError(error); }
}

export async function DELETE(request: NextRequest, { params }: { params: { params: string[] } }) {
  try {
    await requireRole(request, 'ADMIN');
    const segments = (await params).params;
    if (segments[0]) {
      await SEOService.deleteSEO(segments[0]);
      return apiSuccess({ message: 'SEO deleted' });
    }
    return apiError(new Error('id required'));
  } catch (error) { return apiError(error); }
}

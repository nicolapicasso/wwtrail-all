import { NextRequest } from 'next/server';
import { PostsService } from '@/lib/services/posts.service';
import { requireRole, apiSuccess, apiError } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await PostsService.getById(params.id);
    return apiSuccess(post);
  } catch (error) {
    return apiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(request, 'ORGANIZER', 'ADMIN');
    const data = await request.json();
    const post = await PostsService.update(params.id, data, user.id, user.role);
    return apiSuccess(post);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(request, 'ADMIN');
    await PostsService.delete(params.id);
    return apiSuccess({ message: 'Post deleted' });
  } catch (error) {
    return apiError(error);
  }
}

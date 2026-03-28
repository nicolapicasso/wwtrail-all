import apiClientV2 from '../client-v2';
import {
  Post,
  PostListItem,
  CreatePostInput,
  UpdatePostInput,
  PostFilters,
  PaginatedResponse,
  ApiResponse,
} from '@/types/v2';

class PostsService {
  /**
   * Get all posts (public - only PUBLISHED)
   */
  async getAll(filters?: PostFilters): Promise<PaginatedResponse<PostListItem>> {
    const params = new URLSearchParams();

    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.language) params.append('language', filters.language);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.authorId) params.append('authorId', filters.authorId);
    if (filters?.eventId) params.append('eventId', filters.eventId);
    if (filters?.competitionId) params.append('competitionId', filters.competitionId);
    if (filters?.editionId) params.append('editionId', filters.editionId);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await apiClientV2.get<PaginatedResponse<PostListItem>>(
      `/posts?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get post by ID
   */
  async getById(id: string): Promise<Post> {
    const response = await apiClientV2.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data.data!;
  }

  /**
   * Get post by slug
   */
  async getBySlug(slug: string): Promise<Post> {
    const response = await apiClientV2.get<ApiResponse<Post>>(`/posts/slug/${slug}`);
    return response.data.data!;
  }

  /**
   * Check if slug is available
   */
  async checkSlug(slug: string): Promise<{ available: boolean; slug: string }> {
    const response = await apiClientV2.get<ApiResponse<{ available: boolean; slug: string }>>(
      `/posts/check-slug/${slug}`
    );
    return response.data.data!;
  }

  /**
   * Create a new post (authenticated - ORGANIZER/ADMIN)
   */
  async create(data: CreatePostInput): Promise<Post> {
    const response = await apiClientV2.post<ApiResponse<Post>>('/posts', data);
    return response.data.data!;
  }

  /**
   * Update a post (authenticated - author or ADMIN)
   */
  async update(id: string, data: UpdatePostInput): Promise<Post> {
    const response = await apiClientV2.patch<ApiResponse<Post>>(`/posts/${id}`, data);
    return response.data.data!;
  }

  /**
   * Publish a post (admin only)
   */
  async publish(id: string): Promise<Post> {
    const response = await apiClientV2.post<ApiResponse<Post>>(`/posts/${id}/publish`);
    return response.data.data!;
  }

  /**
   * Delete a post (admin only)
   */
  async delete(id: string): Promise<void> {
    await apiClientV2.delete(`/posts/${id}`);
  }
}

const postsService = new PostsService();
export default postsService;

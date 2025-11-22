'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { postsService } from '@/lib/api/v2';
import { PostListItem, POST_CATEGORY_LABELS } from '@/types/v2';
import { Plus, Edit, Eye, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function OrganizerPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadPosts();
    }
  }, [user]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await postsService.getAll({
        authorId: user?.id,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      setPosts(response.data || []);
    } catch (err: any) {
      console.error('Error loading posts:', err);
      setError(err.message || 'Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      return;
    }

    try {
      await postsService.delete(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting post:', err);
      alert(err.message || 'Error al eliminar el artículo');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 text-green-800 px-2.5 py-0.5 text-xs font-semibold">
            <CheckCircle className="h-3 w-3" />
            Publicado
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-xs font-semibold">
            <Clock className="h-3 w-3" />
            Borrador
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-800 px-2.5 py-0.5 text-xs font-semibold">
            <XCircle className="h-3 w-3" />
            Archivado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mis Artículos</h1>
            <p className="text-muted-foreground">
              Gestiona tus artículos del magazine
            </p>
          </div>

          <Link href="/organizer/posts/new">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nuevo Artículo
            </button>
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
            <button
              onClick={loadPosts}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg border p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        )}

        {/* Posts List */}
        {!loading && !error && (
          <>
            {posts.length === 0 ? (
              <div className="bg-white rounded-lg border p-12 text-center">
                <p className="text-muted-foreground text-lg mb-4">
                  No tienes artículos todavía
                </p>
                <Link href="/organizer/posts/new">
                  <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Crear Tu Primer Artículo
                  </button>
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-lg border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Título
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoría
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vistas
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {posts.map((post) => (
                        <tr key={post.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">
                              {post.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">
                              {POST_CATEGORY_LABELS[post.category]}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(post.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">
                              {post.viewCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-500">
                              {new Date(
                                post.publishedAt || post.createdAt
                              ).toLocaleDateString('es-ES')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2">
                              {post.status === 'PUBLISHED' && (
                                <Link
                                  href={`/magazine/${post.category.toLowerCase()}/${
                                    post.slug
                                  }`}
                                  className="text-gray-600 hover:text-gray-900"
                                  title="Ver"
                                >
                                  <Eye className="h-4 w-4" />
                                </Link>
                              )}
                              <Link
                                href={`/organizer/posts/edit/${post.id}`}
                                className="text-green-600 hover:text-green-900"
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                              {user?.role === 'ADMIN' && (
                                <button
                                  onClick={() => handleDelete(post.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {posts.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Total: {posts.length} artículo{posts.length !== 1 ? 's' : ''}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import { postsService } from '@/lib/api/v2';
import { ArticleGrid } from '@/components/ArticleGrid';
import { PostListItem, PostCategory, POST_CATEGORY_LABELS } from '@/types/v2';

export default function MagazineCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const category = (params.category as string).toUpperCase() as PostCategory;

  const [articles, setArticles] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Validate category
  const isValidCategory = Object.keys(PostCategory).includes(category);
  const categoryLabel = isValidCategory ? POST_CATEGORY_LABELS[category] : 'Categoría';

  useEffect(() => {
    if (!isValidCategory) {
      setError('Categoría no válida');
      setLoading(false);
      return;
    }

    loadArticles();
  }, [category, search, isValidCategory]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        limit: 50,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
        category: category,
      };

      if (search) params.search = search;

      const response = await postsService.getAll(params);
      setArticles(response.data || []);
    } catch (err: any) {
      console.error('Error loading articles:', err);
      setError(err.message || 'Error al cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  if (!isValidCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Categoría no encontrada</h1>
          <Link href="/magazine">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Volver al Magazine
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <Link
          href="/magazine"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Magazine
        </Link>
        <h1 className="text-4xl font-bold mb-2">{categoryLabel}</h1>
        <p className="text-muted-foreground">
          Artículos de la categoría {categoryLabel}
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en esta categoría..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">❌ {error}</p>
            <button
              onClick={loadArticles}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            <div className="mb-4 text-sm text-muted-foreground">
              {articles.length} artículo{articles.length !== 1 ? 's' : ''} encontrado{articles.length !== 1 ? 's' : ''}
            </div>
            <ArticleGrid
              articles={articles}
              emptyMessage={`No se encontraron artículos en la categoría ${categoryLabel}`}
            />
          </>
        )}
      </div>
    </div>
  );
}

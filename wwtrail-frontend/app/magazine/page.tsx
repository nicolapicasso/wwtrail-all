'use client';

import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { postsService } from '@/lib/api/v2';
import { ArticleGrid } from '@/components/ArticleGrid';
import { PostListItem, PostCategory, Language, POST_CATEGORY_LABELS, LANGUAGE_LABELS } from '@/types/v2';

export default function MagazinePage() {
  const [articles, setArticles] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | ''>('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | ''>('');
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [search, selectedCategory, selectedLanguage]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        limit: 50,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      };

      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedLanguage) params.language = selectedLanguage;

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

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedLanguage('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <div className="container mx-auto px-4 mb-8">
        <h1 className="text-4xl font-bold mb-2">Magazine</h1>
        <p className="text-muted-foreground">
          Artículos, noticias y guías sobre trail running
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {showFilters ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>

            {showFilters && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={search}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value as PostCategory | '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Todas las categorías</option>
                      {Object.entries(POST_CATEGORY_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idioma
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value as Language | '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Todos los idiomas</option>
                      {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
                        <option key={key} value={key}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reset Button */}
                {(search || selectedCategory || selectedLanguage) && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
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
              emptyMessage="No se encontraron artículos"
            />
          </>
        )}
      </div>
    </div>
  );
}

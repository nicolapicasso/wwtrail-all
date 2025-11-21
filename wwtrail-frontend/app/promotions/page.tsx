'use client';

import { useEffect, useState } from 'react';
import { promotionsService } from '@/lib/api/v2';
import { Promotion, PromotionType } from '@/types/v2';
import PromotionCard from '@/components/promotions/PromotionCard';
import { Search, Filter } from 'lucide-react';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<PromotionType | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPromotions();
  }, [page, search, typeFilter]);

  const loadPromotions = async () => {
    try {
      setLoading(true);
      const filters: any = {
        page,
        limit: 12,
        status: 'PUBLISHED',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      if (search) filters.search = search;
      if (typeFilter !== 'ALL') filters.type = typeFilter;

      const response = await promotionsService.getAll(filters);
      setPromotions(response.data);
      setTotalPages(response.pagination.pages);
    } catch (err) {
      console.error('Error loading promotions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Promociones Exclusivas</h1>
          <p className="text-lg text-gray-600">
            Descubre cupones y contenido exclusivo para la comunidad trail
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar promociones..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="ALL">Todas</option>
                <option value="COUPON">Cupones</option>
                <option value="EXCLUSIVE_CONTENT">Contenido Exclusivo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && promotions.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando promociones...</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">No se encontraron promociones</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promotion) => (
                <PromotionCard key={promotion.id} promotion={promotion} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      page === pageNum
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

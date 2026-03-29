// components/RelatedArticles.tsx - Display related articles

'use client';

import { useEffect, useState } from 'react';
import { postsService } from '@/lib/api/v2';
import { PostListItem } from '@/types/v2';
import { ArticleGrid } from './ArticleGrid';
import { BookOpen } from 'lucide-react';

interface RelatedArticlesProps {
  eventId?: string;
  competitionId?: string;
  editionId?: string;
  title?: string;
  className?: string;
}

export function RelatedArticles({
  eventId,
  competitionId,
  editionId,
  title = 'Artículos Relacionados',
  className = '',
}: RelatedArticlesProps) {
  const [articles, setArticles] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [eventId, competitionId, editionId]);

  const loadArticles = async () => {
    try {
      setLoading(true);

      const params: any = {
        limit: 6,
        sortBy: 'publishedAt',
        sortOrder: 'desc',
      };

      if (eventId) params.eventId = eventId;
      if (competitionId) params.competitionId = competitionId;
      if (editionId) params.editionId = editionId;

      const response = await postsService.getAll(params);
      setArticles(response.data || []);
    } catch (err) {
      console.error('Error loading related articles:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if no articles
  if (!loading && articles.length === 0) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <ArticleGrid articles={articles} emptyMessage="" />
      )}
    </div>
  );
}

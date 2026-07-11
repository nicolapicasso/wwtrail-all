// components/ArticleGrid.tsx - Grid layout for articles list

import { ArticleCard } from './ArticleCard';
import { PostListItem } from '@/types/v2';

interface ArticleGridProps {
  articles: PostListItem[];
  emptyMessage?: string;
}

export function ArticleGrid({
  articles,
  emptyMessage = 'No se encontraron artículos'
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
        />
      ))}
    </div>
  );
}

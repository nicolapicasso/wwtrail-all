// components/ArticleCard.tsx - Individual article card component

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { PostListItem, POST_CATEGORY_LABELS, LANGUAGE_LABELS } from '@/types/v2';
import { Calendar, User, Eye, BookOpen } from 'lucide-react';

interface ArticleCardProps {
  article: PostListItem;
  onClick?: () => void;
  className?: string;
}

export function ArticleCard({
  article,
  onClick,
  className = ''
}: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);

  // Format date
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date(article.createdAt).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  // Author name
  const authorName = article.author
    ? article.author.firstName && article.author.lastName
      ? `${article.author.firstName} ${article.author.lastName}`
      : article.author.username
    : 'Anónimo';

  const content = (
    <article className={`group relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md flex flex-col h-full ${className}`}>
      {/* Featured Image */}
      <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {article.featuredImage && !imageError ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="h-20 w-20 text-gray-300" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded-none bg-gray-800 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {POST_CATEGORY_LABELS[article.category]}
          </span>
        </div>

        {/* Status Badge (DRAFT) */}
        {article.status === 'DRAFT' && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center rounded-none bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-white shadow-lg">
              Borrador
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-lg font-semibold group-hover:text-green-600 transition-colors mb-2 line-clamp-2">
          {article.title}
        </h3>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
            {article.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="mt-auto pt-4 border-t space-y-2">
          {/* Author & Date */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="line-clamp-1">{authorName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{publishedDate}</span>
            </div>
          </div>

          {/* View Count */}
          {article.viewCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              <span>{article.viewCount.toLocaleString()} vistas</span>
            </div>
          )}

          {/* Related Event/Competition/Edition */}
          {(article.event || article.competition || article.edition) && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              {article.event && (
                <span>📍 {article.event.name}</span>
              )}
              {article.competition && (
                <span>🏃 {article.competition.name}</span>
              )}
              {article.edition && (
                <span>📅 Edición {article.edition.year}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="w-full text-left">
        {content}
      </button>
    );
  }

  // Build URL based on category
  const articleUrl = `/magazine/${article.category.toLowerCase()}/${article.slug}`;

  return (
    <Link href={articleUrl}>
      {content}
    </Link>
  );
}

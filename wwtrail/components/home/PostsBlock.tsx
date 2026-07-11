// components/home/PostsBlock.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';
import postsService from '@/lib/api/v2/posts.service';
import type { PostListItem } from '@/types/v2';
import type { ContentBlockConfig } from '@/types/home';
import { HomeBlockViewType } from '@/types/home';

interface PostsBlockProps {
  config: ContentBlockConfig;
}

const DEFAULT_TITLE = 'Magazine';
const DEFAULT_SUBTITLE = 'Artículos, noticias y guías del mundo del trail';

export function PostsBlock({ config }: PostsBlockProps) {
  const { limit, viewType, featuredOnly, title, subtitle } = config;
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsService.getAll({
          limit,
          status: 'PUBLISHED' as any
        });
        setPosts(response?.data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [limit, featuredOnly]);

  if (loading) {
    return (
      <section className="w-full px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-content">
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-green-brand border-t-transparent" />
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-content">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-black tracking-[-0.02em] text-ink-2">
              {title || DEFAULT_TITLE}
            </h2>
            {(subtitle || (!title && DEFAULT_SUBTITLE)) && (
              <p className="mt-1.5 text-[15px] text-text-muted">{subtitle || DEFAULT_SUBTITLE}</p>
            )}
          </div>
          <Link
            href="/magazine"
            className="flex shrink-0 items-center gap-1.5 text-[14px] font-extrabold text-green-brand hover:underline"
          >
            Ver todos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Content */}
        <div
          className={
            viewType === HomeBlockViewType.CARDS
              ? 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'
              : 'flex flex-col gap-4'
          }
        >
          {posts.map((post) => (
            <ArticleCard key={post.id} article={post} />
          ))}
        </div>
      </div>
    </section>
  );
}

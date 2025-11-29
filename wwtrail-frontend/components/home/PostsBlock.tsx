// components/home/PostsBlock.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { ArticleCard } from '@/components/ArticleCard';
import postsService from '@/lib/api/v2/posts.service';
import type { PostListItem } from '@/types/v2';
import type { ContentBlockConfig } from '@/types/home';
import { HomeBlockViewType } from '@/types/home';

interface PostsBlockProps {
  config: ContentBlockConfig;
}

export function PostsBlock({ config }: PostsBlockProps) {
  const { limit, viewType, featuredOnly } = config;
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsService.getAll({
          limit,
          status: 'PUBLISHED'
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
      <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-green-600" />
              Magazine
            </h2>
            <p className="text-gray-600 mt-2">Artículos, noticias y guías del mundo del trail</p>
          </div>
          <Link
            href="/magazine"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Ver todos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Contenido */}
        {viewType === HomeBlockViewType.CARDS ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} article={post} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <ArticleCard key={post.id} article={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

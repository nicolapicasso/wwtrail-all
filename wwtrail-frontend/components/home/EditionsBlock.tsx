// components/home/EditionsBlock.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';
import { EditionCard } from '@/components/EditionCard';
import editionsService from '@/lib/api/v2/editions.service';
import type { EditionFull } from '@/types/edition';
import type { ContentBlockConfig } from '@/types/home';
import { HomeBlockViewType } from '@/types/home';

interface EditionsBlockProps {
  config: ContentBlockConfig;
}

const DEFAULT_TITLE = 'Últimas Ediciones';
const DEFAULT_SUBTITLE = 'Inscríbete en las próximas carreras';

export function EditionsBlock({ config }: EditionsBlockProps) {
  const { limit, viewType, featuredOnly, title, subtitle } = config;
  const [editions, setEditions] = useState<EditionFull[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const data = await editionsService.getAll({
          limit,
          isFeatured: featuredOnly
        });
        setEditions(data?.editions || []);
      } catch (error) {
        console.error('Error fetching editions:', error);
        setEditions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEditions();
  }, [limit, featuredOnly]);

  if (loading) {
    return (
      <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (editions.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-black" />
              {title || DEFAULT_TITLE}
            </h2>
            {(subtitle || (!title && DEFAULT_SUBTITLE)) && (
              <p className="text-gray-600 mt-2">{subtitle || DEFAULT_SUBTITLE}</p>
            )}
          </div>
          <Link
            href="/editions"
            className="flex items-center gap-2 text-black hover:text-gray-700 font-medium transition-colors"
          >
            Ver todas
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Contenido */}
        {viewType === HomeBlockViewType.CARDS ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {editions.map((edition) => (
              <EditionCard key={edition.id} edition={edition} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {editions.map((edition) => (
              <EditionCard key={edition.id} edition={edition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

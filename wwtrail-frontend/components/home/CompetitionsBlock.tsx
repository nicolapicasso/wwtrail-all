// components/home/CompetitionsBlock.tsx

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Flag, ArrowRight } from 'lucide-react';
import { CompetitionCard } from '@/components/CompetitionCard';
import competitionsService from '@/lib/api/v2/competitions.service';
import type { Competition } from '@/types/competition';
import type { ContentBlockConfig, HomeBlockViewType } from '@/types/home';

interface CompetitionsBlockProps {
  config: ContentBlockConfig;
}

export function CompetitionsBlock({ config }: CompetitionsBlockProps) {
  const { limit, viewType } = config;
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await competitionsService.getAll({ limit });
        setCompetitions(data?.competitions || []);
      } catch (error) {
        console.error('Error fetching competitions:', error);
        setCompetitions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [limit]);

  if (loading) {
    return (
      <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (competitions.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Flag className="w-8 h-8 text-green-600" />
              Competiciones Destacadas
            </h2>
            <p className="text-gray-600 mt-2">Las mejores carreras de trail y ultra trail</p>
          </div>
          <Link
            href="/competitions"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Ver todas
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Contenido */}
        {viewType === HomeBlockViewType.CARDS ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {competitions.map((competition) => (
              <CompetitionCard key={competition.id} competition={competition} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

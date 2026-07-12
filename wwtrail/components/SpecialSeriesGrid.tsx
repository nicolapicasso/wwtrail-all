// components/SpecialSeriesGrid.tsx - Grid layout for special series list

import { getTranslations } from 'next-intl/server';
import { SpecialSeriesCard } from './SpecialSeriesCard';
import { SpecialSeriesListItem } from '@/types/v2';

interface SpecialSeriesGridProps {
  specialSeries: SpecialSeriesListItem[];
  emptyMessage?: string;
}

export async function SpecialSeriesGrid({
  specialSeries,
  emptyMessage
}: SpecialSeriesGridProps) {
  const t = await getTranslations('cmp');
  if (specialSeries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage ?? t('noSpecialSeries')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {specialSeries.map((series) => (
        <SpecialSeriesCard
          key={series.id}
          specialSeries={series}
        />
      ))}
    </div>
  );
}

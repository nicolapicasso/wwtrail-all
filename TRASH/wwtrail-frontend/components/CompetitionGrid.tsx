import { CompetitionCard } from './CompetitionCard';
import { Competition } from '@/types/competition';

interface CompetitionGridProps {
  competitions: Competition[];
  emptyMessage?: string;
}

export function CompetitionGrid({ 
  competitions, 
  emptyMessage = 'No se encontraron competiciones' 
}: CompetitionGridProps) {
  if (competitions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
        />
      ))}
    </div>
  );
}

import { CompetitionCard } from './CompetitionCard';

interface Competition {
  id: string;
  slug: string;
  name: string;
  type: string;
  city: string;
  country: string;
  startDate: string;
  distance?: number;
  elevation?: number;
  maxParticipants?: number;
  _count?: {
    participants: number;
  };
  imageUrl?: string;
  isHighlighted?: boolean;
}

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
          id={competition.id}
          slug={competition.slug}
          name={competition.name}
          type={competition.type}
          city={competition.city}
          country={competition.country}
          startDate={competition.startDate}
          distance={competition.distance}
          elevation={competition.elevation}
          maxParticipants={competition.maxParticipants}
          currentParticipants={competition._count?.participants}
          imageUrl={competition.imageUrl}
          isHighlighted={competition.isHighlighted}
        />
      ))}
    </div>
  );
}

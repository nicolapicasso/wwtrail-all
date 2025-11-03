import Link from 'next/link';
import { Calendar, MapPin, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface CompetitionCardProps {
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
  currentParticipants?: number;
  imageUrl?: string;
  isHighlighted?: boolean;
}

export function CompetitionCard({
  id,
  slug,
  name,
  type,
  city,
  country,
  startDate,
  distance,
  elevation,
  maxParticipants,
  currentParticipants,
  imageUrl,
  isHighlighted,
}: CompetitionCardProps) {
  // Format date
  const formattedDate = new Date(startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate availability percentage
  const availabilityPercentage = maxParticipants && currentParticipants
    ? ((currentParticipants / maxParticipants) * 100).toFixed(0)
    : null;

  // Type badge colors
  const typeColors: Record<string, string> = {
    TRAIL: 'bg-green-100 text-green-800',
    ULTRA: 'bg-purple-100 text-purple-800',
    VERTICAL: 'bg-blue-100 text-blue-800',
    SKYRUNNING: 'bg-orange-100 text-orange-800',
    CANICROSS: 'bg-pink-100 text-pink-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${isHighlighted ? 'ring-2 ring-primary' : ''}`}>
      {/* Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <TrendingUp className="w-16 h-16 text-primary/40" />
          </div>
        )}
        
        {/* Type Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${typeColors[type] || typeColors.OTHER}`}>
          {type}
        </div>

        {/* Highlighted Badge */}
        {isHighlighted && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
            ⭐ Destacada
          </div>
        )}
      </div>

      {/* Content */}
      <CardHeader className="pb-3">
        <Link href={`/competitions/${slug}`}>
          <h3 className="text-lg font-bold hover:text-primary transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Location */}
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{city}, {country}</span>
        </div>

        {/* Date */}
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{formattedDate}</span>
        </div>

        {/* Stats Grid */}
        {(distance || elevation) && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            {distance && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Distancia</p>
                <p className="text-sm font-semibold">{distance} km</p>
              </div>
            )}
            {elevation && (
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Desnivel</p>
                <p className="text-sm font-semibold">{elevation} m</p>
              </div>
            )}
          </div>
        )}

        {/* Availability */}
        {availabilityPercentage && (
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                Plazas
              </span>
              <span>{currentParticipants} / {maxParticipants}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  parseInt(availabilityPercentage) > 90
                    ? 'bg-red-500'
                    : parseInt(availabilityPercentage) > 70
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${availabilityPercentage}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="pt-3">
        <Link href={`/competitions/${slug}`} className="w-full">
          <Button variant="outline" className="w-full">
            Ver Detalles
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

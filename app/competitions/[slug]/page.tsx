'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { competitionsService } from '@/lib/api';
import { Calendar, MapPin, TrendingUp, Users, ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CompetitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [competition, setCompetition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadCompetition();
    }
  }, [slug]);

  const loadCompetition = async () => {
    try {
      setLoading(true);
      setError(null);
      // Note: We need to add getBySlug to the service
      // For now, we'll fetch all and find by slug
      const response = await competitionsService.getAll({ limit: 100 });
      const comp = response.data?.find((c: any) => c.slug === slug);
      
      if (!comp) {
        setError('Competición no encontrada');
        return;
      }
      
      setCompetition(comp);
    } catch (err: any) {
      console.error('Error loading competition:', err);
      setError(err.message || 'Error al cargar la competición');
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !competition) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ {error || 'Competición no encontrada'}</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(competition.startDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const typeColors: Record<string, string> = {
    TRAIL: 'bg-green-100 text-green-800',
    ULTRA: 'bg-purple-100 text-purple-800',
    VERTICAL: 'bg-blue-100 text-blue-800',
    SKYRUNNING: 'bg-orange-100 text-orange-800',
    CANICROSS: 'bg-pink-100 text-pink-800',
    OTHER: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Image */}
      <div className="relative h-96 bg-gray-200">
        {competition.imageUrl ? (
          <img
            src={competition.imageUrl}
            alt={competition.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <TrendingUp className="w-32 h-32 text-primary/40" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[competition.type] || typeColors.OTHER}`}>
                {competition.type}
              </span>
              {competition.isHighlighted && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900">
                  ⭐ Destacada
                </span>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-2">{competition.name}</h1>
            <p className="text-lg opacity-90 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              {competition.city}, {competition.country}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <Button
          variant="secondary"
          onClick={() => router.back()}
          className="absolute top-4 left-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        {/* Share Button */}
        <Button
          variant="secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: competition.name,
                url: window.location.href,
              });
            }
          }}
          className="absolute top-4 right-4"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line">
                  {competition.description || 'No hay descripción disponible.'}
                </p>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {competition.distance && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{competition.distance} km</p>
                      <p className="text-sm text-muted-foreground">Distancia</p>
                    </div>
                  )}
                  {competition.elevation && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{competition.elevation} m</p>
                      <p className="text-sm text-muted-foreground">Desnivel +</p>
                    </div>
                  )}
                  {competition.maxParticipants && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{competition.maxParticipants}</p>
                      <p className="text-sm text-muted-foreground">Plazas</p>
                    </div>
                  )}
                  {competition.type && (
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold text-primary">{competition.type}</p>
                      <p className="text-sm text-muted-foreground">Modalidad</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Información</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Date */}
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Fecha</p>
                    <p className="text-sm text-muted-foreground capitalize">{formattedDate}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Ubicación</p>
                    <p className="text-sm text-muted-foreground">
                      {competition.city}, {competition.country}
                    </p>
                  </div>
                </div>

                {/* Participants */}
                {competition.maxParticipants && (
                  <div className="flex items-start">
                    <Users className="w-5 h-5 mr-3 mt-0.5 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold">Participantes</p>
                      <p className="text-sm text-muted-foreground">
                        {competition._count?.participants || 0} / {competition.maxParticipants}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${((competition._count?.participants || 0) / competition.maxParticipants) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Register Button */}
                <Button className="w-full" size="lg">
                  Inscribirse
                </Button>
              </CardContent>
            </Card>

            {/* Contact Card */}
            {(competition.websiteUrl || competition.email) && (
              <Card>
                <CardHeader>
                  <CardTitle>Contacto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {competition.websiteUrl && (
                    <a
                      href={competition.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline"
                    >
                      Sitio web oficial →
                    </a>
                  )}
                  {competition.email && (
                    <a
                      href={`mailto:${competition.email}`}
                      className="block text-primary hover:underline"
                    >
                      Enviar email →
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

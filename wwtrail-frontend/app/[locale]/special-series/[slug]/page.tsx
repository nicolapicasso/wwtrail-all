'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import specialSeriesService from '@/lib/api/v2/specialSeries.service';
import { SpecialSeries } from '@/types/v2';
import { ArrowLeft, Globe, Instagram, Facebook, Twitter, Youtube, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompetitionGrid } from '@/components/CompetitionGrid';

export default function SpecialSeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const locale = params.locale as string; // ✅ Get current locale

  const [specialSeries, setSpecialSeries] = useState<SpecialSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    if (slug) {
      loadSpecialSeries();
    }
  }, [slug, locale]); // ✅ Reload when locale changes

  const loadSpecialSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      const series = await specialSeriesService.getBySlug(slug);

      // ✅ Apply translations if available
      const translation = (series as any).translations?.find((t: any) => t.language === locale?.toUpperCase());
      if (translation) {
        series.name = translation.name || series.name;
        series.description = translation.description || series.description;
      }

      console.log('Special series loaded:', {
        name: series.name,
        locale,
        hasTranslation: !!translation
      });
      setSpecialSeries(series);
    } catch (err: any) {
      console.error('Error loading special series:', err);
      setError(err.message || 'Error al cargar la special series');
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
  if (error || !specialSeries) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ {error || 'Special Series no encontrada'}</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Logo */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Logo */}
            <div className="w-48 h-48 flex items-center justify-center bg-white rounded-lg p-6 flex-shrink-0">
              {specialSeries.logoUrl && !logoError ? (
                <div className="relative w-full h-full">
                  <Image
                    src={specialSeries.logoUrl}
                    alt={specialSeries.name}
                    fill
                    className="object-contain"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <Trophy className="h-24 w-24 text-gray-300" />
              )}
            </div>

            {/* Title and Info */}
            <div className="flex-1 text-center md:text-left">
              <Link
                href="/special-series"
                className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Special Series
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{specialSeries.name}</h1>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>{specialSeries.country}</span>
                </div>
                {specialSeries._count?.competitions !== undefined && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    <span>
                      {specialSeries._count.competitions} competition{specialSeries._count.competitions !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {specialSeries.description && (
              <section className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-4">Sobre la Serie</h2>
                <p className="text-muted-foreground whitespace-pre-line">{specialSeries.description}</p>
              </section>
            )}

            {/* Competitions */}
            {specialSeries.competitions && specialSeries.competitions.length > 0 && (
              <section className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold mb-6">Competiciones</h2>
                <CompetitionGrid
                  competitions={specialSeries.competitions as any}
                  emptyMessage="No hay competiciones en esta special series"
                />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-8 space-y-6">
              {/* Website */}
              {specialSeries.website && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website
                  </h3>
                  <a
                    href={specialSeries.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 hover:underline break-all"
                  >
                    {specialSeries.website}
                  </a>
                </div>
              )}

              {/* Social Media */}
              {(specialSeries.instagramUrl || specialSeries.facebookUrl || specialSeries.twitterUrl || specialSeries.youtubeUrl) && (
                <div>
                  <h3 className="font-semibold mb-3">Redes Sociales</h3>
                  <div className="flex flex-wrap gap-3">
                    {specialSeries.instagramUrl && (
                      <a
                        href={specialSeries.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <Instagram className="h-5 w-5" />
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {specialSeries.facebookUrl && (
                      <a
                        href={specialSeries.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Facebook className="h-5 w-5" />
                        <span className="text-sm font-medium">Facebook</span>
                      </a>
                    )}
                    {specialSeries.twitterUrl && (
                      <a
                        href={specialSeries.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
                      >
                        <Twitter className="h-5 w-5" />
                        <span className="text-sm font-medium">Twitter</span>
                      </a>
                    )}
                    {specialSeries.youtubeUrl && (
                      <a
                        href={specialSeries.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Youtube className="h-5 w-5" />
                        <span className="text-sm font-medium">YouTube</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Creator Info */}
              {specialSeries.createdBy && (
                <div>
                  <h3 className="font-semibold mb-2">Creado por</h3>
                  <p className="text-sm text-muted-foreground">
                    {specialSeries.createdBy.firstName && specialSeries.createdBy.lastName
                      ? `${specialSeries.createdBy.firstName} ${specialSeries.createdBy.lastName}`
                      : specialSeries.createdBy.username}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

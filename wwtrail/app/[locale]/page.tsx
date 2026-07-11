// app/page.tsx - Dynamic Home Page

'use client';

import { useEffect, useState } from 'react';
import { homeService } from '@/lib/api/home.service';
import { HeroSection } from '@/components/home/HeroSection';
import { HomeBlockRenderer } from '@/components/home/HomeBlockRenderer';
import { ValueProps } from '@/components/home/ValueProps';
import { MapBand } from '@/components/home/MapBand';
import type { HomeConfiguration } from '@/types/home';

export default function HomePage() {
  const [config, setConfig] = useState<HomeConfiguration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await homeService.getActiveConfiguration();
        setConfig(data);
      } catch (err) {
        console.error('Error fetching home configuration:', err);
        setError('Error al cargar la configuración de la home');
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-green-brand border-t-transparent" />
          <p className="text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md px-4 text-center">
          <h1 className="mb-2 text-2xl font-bold text-destructive">Error</h1>
          <p className="text-text-muted">{error || 'No se pudo cargar la configuración'}</p>
        </div>
      </div>
    );
  }

  // Ordenar bloques por order
  const sortedBlocks = [...config.blocks].sort((a, b) => a.order - b.order);

  // Obtener imágenes del hero: usar heroImages si existe, sino heroImage como fallback
  const heroImages = config.heroImages || (config.heroImage ? [config.heroImage] : []);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <HeroSection
        images={heroImages}
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
      />

      {/* Fixed section: value propositions */}
      <ValueProps />

      {/* Admin-configurable content blocks */}
      <div className="relative">
        {sortedBlocks.map((block) => (
          <HomeBlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {/* Fixed section: map band */}
      <MapBand />

      {/* Fallback when no blocks are configured */}
      {sortedBlocks.length === 0 && (
        <div className="mx-auto max-w-content px-6 py-16 text-center sm:px-8">
          <p className="text-text-muted">
            La home está en configuración. Pronto habrá contenido aquí.
          </p>
        </div>
      )}
    </main>
  );
}

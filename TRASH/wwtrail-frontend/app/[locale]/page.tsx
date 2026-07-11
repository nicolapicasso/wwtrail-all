// app/page.tsx - Dynamic Home Page

'use client';

import { useEffect, useState } from 'react';
import { homeService } from '@/lib/api/home.service';
import { HeroSection } from '@/components/home/HeroSection';
import { HomeBlockRenderer } from '@/components/home/HomeBlockRenderer';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error || 'No se pudo cargar la configuración'}</p>
        </div>
      </div>
    );
  }

  // Ordenar bloques por order
  const sortedBlocks = [...config.blocks].sort((a, b) => a.order - b.order);

  // Debug: Log configuration
  console.log('Home Config:', config);
  console.log('Sorted Blocks:', sortedBlocks);

  // Obtener imágenes del hero: usar heroImages si existe, sino heroImage como fallback
  const heroImages = config.heroImages || (config.heroImage ? [config.heroImage] : []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section con Slider */}
      <HeroSection
        images={heroImages}
        title={config.heroTitle}
        subtitle={config.heroSubtitle}
      />

      {/* Bloques dinámicos */}
      <div className="relative">
        {sortedBlocks.map((block) => {
          console.log('Rendering block:', block.id, block.type, 'visible:', block.visible, 'config:', block.config);
          return <HomeBlockRenderer key={block.id} block={block} />;
        })}
      </div>

      {/* Fallback si no hay bloques */}
      {sortedBlocks.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-gray-500">
            La home está en configuración. Pronto habrá contenido aquí.
          </p>
        </div>
      )}
    </main>
  );
}

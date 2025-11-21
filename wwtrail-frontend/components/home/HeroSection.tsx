// components/home/HeroSection.tsx

'use client';

import Image from 'next/image';
import { MountainDivider } from '@/components/MountainDivider';

interface HeroSectionProps {
  image?: string;
  title?: string;
  subtitle?: string;
}

export function HeroSection({ image, title, subtitle }: HeroSectionProps) {
  // Si no hay nada configurado, mostrar hero por defecto
  const defaultImage = '/images/hero-default.jpg';
  const defaultTitle = 'Bienvenido a WWTRAIL';
  const defaultSubtitle = 'La plataforma para trail runners';

  const heroImage = image || defaultImage;
  const heroTitle = title || defaultTitle;
  const heroSubtitle = subtitle || defaultSubtitle;

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={heroTitle}
          fill
          className="object-cover"
          priority
          onError={(e) => {
            // Si falla la carga, usar imagen por defecto
            const target = e.target as HTMLImageElement;
            target.src = defaultImage;
          }}
        />
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Contenido del hero */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {heroTitle}
          </h1>
          {heroSubtitle && (
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
              {heroSubtitle}
            </p>
          )}
        </div>
      </div>

      {/* Divisor de montaña */}
      <MountainDivider fillColor="#000000" position="bottom" />
    </div>
  );
}

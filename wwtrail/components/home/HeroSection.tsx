// components/home/HeroSection.tsx

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  images?: string[];
  title?: string;
  subtitle?: string;
  autoPlayInterval?: number; // Intervalo en milisegundos (default: 5000)
}

export function HeroSection({
  images = [],
  title,
  subtitle,
  autoPlayInterval = 5000
}: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Defaults
  const defaultImage = '/images/hero-default.jpg';
  const defaultTitle = 'Bienvenido a WWTRAIL';
  const defaultSubtitle = 'La plataforma para trail runners';

  // Si no hay imágenes, usar la imagen por defecto
  const heroImages = images.length > 0 ? images : [defaultImage];
  const heroTitle = title || defaultTitle;
  const heroSubtitle = subtitle || defaultSubtitle;

  // Navigation functions
  const goToNext = useCallback(() => {
    if (heroImages.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, [heroImages.length]);

  const goToPrev = useCallback(() => {
    if (heroImages.length <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  }, [heroImages.length]);

  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [currentIndex]);

  // Auto-play effect
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [goToNext, autoPlayInterval, heroImages.length]);

  // Reset transition state
  useEffect(() => {
    if (isTransitioning) {
      const timeout = setTimeout(() => setIsTransitioning(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [isTransitioning]);

  return (
    <div className="relative h-[500px] md:h-[600px] w-full overflow-hidden">
      {/* Images */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={image}
            alt={`${heroTitle} - Slide ${index + 1}`}
            fill
            className="object-cover"
            priority={index === 0}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultImage;
            }}
          />
        </div>
      ))}

      {/* Overlay oscuro para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-black/40 z-20" />

      {/* Contenido del hero */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 z-30">
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

      {/* Navigation arrows (only show if more than 1 image) */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots indicator (only show if more than 1 image) */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-40">
          <div
            className="h-full bg-white/60 transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / heroImages.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

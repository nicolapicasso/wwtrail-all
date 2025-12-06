'use client';

import { Stars } from './Stars';
import { Fireflies } from './Fireflies';

interface PlainsSceneProps {
  isNight: boolean;
}

export function PlainsScene({ isNight }: PlainsSceneProps) {
  if (isNight) {
    return (
      <div className="plains-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient - deep blue prairie night */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #0a1018 0%,
              #101820 25%,
              #182028 50%,
              #202830 75%,
              #283038 100%
            )`,
          }}
        />

        {/* Stars */}
        <Stars count={60} />

        {/* Moon - centered low on horizon */}
        <div className="moon absolute top-[40px] left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#0a1018] rounded-full" />
        </div>

        {/* Rolling hills silhouettes */}
        <div
          className="absolute bottom-0 left-0 w-full h-[140px] bg-[#181e25]"
          style={{ clipPath: 'polygon(0% 100%, 0% 65%, 15% 55%, 30% 62%, 50% 48%, 70% 58%, 85% 50%, 100% 55%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[110px] bg-[#10151a]"
          style={{ clipPath: 'polygon(0% 100%, 0% 55%, 20% 48%, 40% 55%, 60% 42%, 80% 52%, 100% 45%, 100% 100%)' }}
        />

        {/* Dark grass/prairie foreground */}
        <div
          className="absolute bottom-0 left-0 w-full h-[80px] bg-[#08101]"
          style={{ clipPath: 'polygon(0% 100%, 0% 40%, 100% 45%, 100% 100%)' }}
        />

        {/* Fireflies */}
        <Fireflies count={12} />
      </div>
    );
  }

  return (
    <div className="plains-day absolute inset-0 overflow-hidden">
      {/* Photographic prairie sunset - warm golden tones */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #5a7090 0%,
            #7a90a8 12%,
            #9aa8b8 22%,
            #c8b8a8 35%,
            #d8c098 45%,
            #e8c888 55%,
            #f0c878 65%,
            #f5c868 75%,
            #f8c858 85%,
            #fac848 100%
          )`,
        }}
      />

      {/* Sun - setting on horizon, centered */}
      <div
        className="absolute bottom-[95px] left-1/2 -translate-x-1/2 w-[100px] h-[50px] opacity-80"
        style={{
          background: 'radial-gradient(ellipse at center bottom, rgba(255,220,150,1) 0%, rgba(255,200,100,0.6) 40%, transparent 70%)',
        }}
      />

      {/* Atmospheric golden haze */}
      <div
        className="absolute bottom-[50px] left-0 w-full h-[130px] opacity-35"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200,180,120,0.5) 100%)',
        }}
      />

      {/* Rolling hills silhouettes - far */}
      <div
        className="absolute bottom-0 left-0 w-full h-[150px]"
        style={{
          background: 'linear-gradient(to bottom, #7a7060 0%, #6a6050 100%)',
          clipPath: 'polygon(0% 100%, 0% 62%, 12% 52%, 28% 60%, 45% 48%, 62% 58%, 78% 45%, 100% 52%, 100% 100%)',
        }}
      />

      {/* Rolling hills silhouettes - mid */}
      <div
        className="absolute bottom-0 left-0 w-full h-[115px]"
        style={{
          background: 'linear-gradient(to bottom, #5a5040 0%, #4a4030 100%)',
          clipPath: 'polygon(0% 100%, 0% 52%, 18% 45%, 38% 55%, 58% 40%, 78% 50%, 100% 42%, 100% 100%)',
        }}
      />

      {/* Prairie/grass foreground - darkest silhouette */}
      <div
        className="absolute bottom-0 left-0 w-full h-[80px]"
        style={{
          background: 'linear-gradient(to bottom, #3a3020 0%, #2a2010 100%)',
          clipPath: 'polygon(0% 100%, 0% 38%, 100% 42%, 100% 100%)',
        }}
      />

      {/* Subtle grass texture on foreground */}
      <div
        className="absolute bottom-0 left-0 w-full h-[50px] opacity-30"
        style={{
          background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 3px, #1a1008 3px, #1a1008 4px)',
          clipPath: 'polygon(0% 100%, 0% 0%, 1% 40%, 2% 0%, 3% 35%, 4% 0%, 5% 42%, 6% 0%, 7% 38%, 8% 0%, 9% 45%, 10% 0%, 11% 40%, 12% 0%, 13% 35%, 14% 0%, 15% 42%, 16% 0%, 17% 38%, 18% 0%, 19% 45%, 20% 0%, 21% 40%, 22% 0%, 23% 35%, 24% 0%, 25% 42%, 26% 0%, 27% 38%, 28% 0%, 29% 45%, 30% 0%, 31% 40%, 32% 0%, 33% 35%, 34% 0%, 35% 42%, 36% 0%, 37% 38%, 38% 0%, 39% 45%, 40% 0%, 41% 40%, 42% 0%, 43% 35%, 44% 0%, 45% 42%, 46% 0%, 47% 38%, 48% 0%, 49% 45%, 50% 0%, 51% 40%, 52% 0%, 53% 35%, 54% 0%, 55% 42%, 56% 0%, 57% 38%, 58% 0%, 59% 45%, 60% 0%, 61% 40%, 62% 0%, 63% 35%, 64% 0%, 65% 42%, 66% 0%, 67% 38%, 68% 0%, 69% 45%, 70% 0%, 71% 40%, 72% 0%, 73% 35%, 74% 0%, 75% 42%, 76% 0%, 77% 38%, 78% 0%, 79% 45%, 80% 0%, 81% 40%, 82% 0%, 83% 35%, 84% 0%, 85% 42%, 86% 0%, 87% 38%, 88% 0%, 89% 45%, 90% 0%, 91% 40%, 92% 0%, 93% 35%, 94% 0%, 95% 42%, 96% 0%, 97% 38%, 98% 0%, 99% 45%, 100% 0%, 100% 100%)',
        }}
      />
    </div>
  );
}

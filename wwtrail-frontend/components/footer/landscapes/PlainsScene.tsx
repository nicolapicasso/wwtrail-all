'use client';

import { Stars } from './Stars';
import { Fireflies } from './Fireflies';
import { Birds } from './Birds';

interface PlainsSceneProps {
  isNight: boolean;
}

export function PlainsScene({ isNight }: PlainsSceneProps) {
  // Grass blades clip-path (shared between day and night)
  const grassBladesClipPath = 'polygon(0% 100%, 0% 60%, 1% 40%, 2% 60%, 3% 35%, 4% 58%, 5% 42%, 6% 62%, 7% 38%, 8% 55%, 9% 45%, 10% 60%, 11% 40%, 12% 58%, 13% 35%, 14% 62%, 15% 42%, 16% 55%, 17% 38%, 18% 60%, 19% 45%, 20% 58%, 21% 40%, 22% 62%, 23% 35%, 24% 55%, 25% 42%, 26% 60%, 27% 38%, 28% 58%, 29% 45%, 30% 62%, 31% 40%, 32% 55%, 33% 35%, 34% 60%, 35% 42%, 36% 58%, 37% 38%, 38% 62%, 39% 45%, 40% 55%, 41% 40%, 42% 60%, 43% 35%, 44% 58%, 45% 42%, 46% 62%, 47% 38%, 48% 55%, 49% 45%, 50% 60%, 51% 40%, 52% 58%, 53% 35%, 54% 62%, 55% 42%, 56% 55%, 57% 38%, 58% 60%, 59% 45%, 60% 58%, 61% 40%, 62% 62%, 63% 35%, 64% 55%, 65% 42%, 66% 60%, 67% 38%, 68% 58%, 69% 45%, 70% 62%, 71% 40%, 72% 55%, 73% 35%, 74% 60%, 75% 42%, 76% 58%, 77% 38%, 78% 62%, 79% 45%, 80% 55%, 81% 40%, 82% 60%, 83% 35%, 84% 58%, 85% 42%, 86% 62%, 87% 38%, 88% 55%, 89% 45%, 90% 60%, 91% 40%, 92% 58%, 93% 35%, 94% 62%, 95% 42%, 96% 55%, 97% 38%, 98% 60%, 99% 45%, 100% 55%, 100% 100%)';

  if (isNight) {
    return (
      <div className="plains-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700" />

        {/* Stars */}
        <Stars count={60} />

        {/* Moon - centered */}
        <div className="moon absolute top-[40px] left-1/2 -translate-x-1/2 w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-slate-900 rounded-full" />
        </div>

        {/* Hills back layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[140px] bg-slate-800"
          style={{ clipPath: 'polygon(0% 100%, 0% 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 45%, 100% 100%)' }}
        />

        {/* Hills front layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[110px] bg-slate-700"
          style={{ clipPath: 'polygon(0% 100%, 0% 60%, 15% 50%, 35% 58%, 55% 45%, 75% 55%, 100% 40%, 100% 100%)' }}
        />

        {/* Grass */}
        <div className="absolute bottom-0 left-0 w-full h-[80px] bg-gradient-to-b from-slate-700 to-slate-800">
          {/* Grass blades */}
          <div
            className="absolute bottom-0 left-0 w-full h-[80px] opacity-40"
            style={{
              background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, #0f172a 8px, #0f172a 10px)',
              clipPath: grassBladesClipPath,
            }}
          />
        </div>

        {/* Fireflies */}
        <Fireflies count={12} />
      </div>
    );
  }

  return (
    <div className="plains-day absolute inset-0 overflow-hidden">
      {/* Sunset sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-orange-300 to-orange-500" />

      {/* Sun - setting, centered */}
      <div className="absolute bottom-[120px] left-1/2 -translate-x-1/2 w-[70px] h-[70px] bg-amber-400 rounded-full shadow-[0_0_80px_#fbbf24,0_0_120px_#f59e0b]" />

      {/* Hills back layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[140px] bg-amber-700"
        style={{ clipPath: 'polygon(0% 100%, 0% 70%, 20% 55%, 40% 65%, 60% 50%, 80% 60%, 100% 45%, 100% 100%)' }}
      />

      {/* Hills front layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[110px] bg-amber-800"
        style={{ clipPath: 'polygon(0% 100%, 0% 60%, 15% 50%, 35% 58%, 55% 45%, 75% 55%, 100% 40%, 100% 100%)' }}
      />

      {/* Grass */}
      <div className="absolute bottom-0 left-0 w-full h-[80px] bg-gradient-to-b from-lime-700 to-green-900">
        {/* Grass blades */}
        <div
          className="absolute bottom-0 left-0 w-full h-[80px] opacity-50"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, #3f6212 8px, #3f6212 10px)',
            clipPath: grassBladesClipPath,
          }}
        />
      </div>

      {/* Birds flying in the distance */}
      <Birds count={5} color="#78350f" />
    </div>
  );
}

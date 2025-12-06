'use client';

import { Stars } from './Stars';
import { Clouds } from './Clouds';

interface MountainsSceneProps {
  isNight: boolean;
}

export function MountainsScene({ isNight }: MountainsSceneProps) {
  if (isNight) {
    return (
      <div className="mountains-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700" />

        {/* Stars */}
        <Stars count={55} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[14%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-slate-900 rounded-full" />
        </div>

        {/* Snow-capped peak (tallest mountain) */}
        <div
          className="absolute bottom-0 left-[38%] w-[24%] h-[220px]"
          style={{
            background: 'linear-gradient(to bottom, #e2e8f0 0%, #94a3b8 25%, #64748b 50%, #475569 100%)',
            clipPath: 'polygon(50% 0%, 15% 100%, 85% 100%)',
          }}
        />

        {/* Mountains back layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[170px] bg-slate-800"
          style={{ clipPath: 'polygon(0% 100%, 0% 55%, 8% 42%, 16% 52%, 26% 28%, 36% 48%, 46% 22%, 56% 42%, 66% 18%, 76% 38%, 86% 12%, 100% 32%, 100% 100%)' }}
        />

        {/* Mountains mid layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[135px] bg-slate-700"
          style={{ clipPath: 'polygon(0% 100%, 0% 58%, 12% 42%, 24% 55%, 36% 32%, 50% 48%, 62% 28%, 76% 44%, 88% 24%, 100% 38%, 100% 100%)' }}
        />

        {/* Mountains front layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[105px] bg-slate-600"
          style={{ clipPath: 'polygon(0% 100%, 0% 52%, 14% 38%, 30% 50%, 44% 32%, 54% 46%, 70% 28%, 84% 42%, 100% 30%, 100% 100%)' }}
        />
      </div>
    );
  }

  return (
    <div className="mountains-day absolute inset-0 overflow-hidden">
      {/* Day sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100" />

      {/* Sun */}
      <div className="absolute top-[35px] right-[14%] w-[50px] h-[50px] bg-amber-400 rounded-full shadow-[0_0_50px_#fbbf24]" />

      {/* Animated Clouds */}
      <Clouds count={3} />

      {/* Snow-capped peak (tallest mountain) - behind other mountains */}
      <div
        className="absolute bottom-0 left-[38%] w-[24%] h-[220px]"
        style={{
          background: 'linear-gradient(to bottom, #ffffff 0%, #e5e7eb 15%, #9ca3af 40%, #6b7280 70%, #4b5563 100%)',
          clipPath: 'polygon(50% 0%, 15% 100%, 85% 100%)',
        }}
      />

      {/* Mountains back layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[170px] bg-gray-500"
        style={{ clipPath: 'polygon(0% 100%, 0% 55%, 8% 42%, 16% 52%, 26% 28%, 36% 48%, 46% 22%, 56% 42%, 66% 18%, 76% 38%, 86% 12%, 100% 32%, 100% 100%)' }}
      />

      {/* Mountains mid layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[135px] bg-gray-600"
        style={{ clipPath: 'polygon(0% 100%, 0% 58%, 12% 42%, 24% 55%, 36% 32%, 50% 48%, 62% 28%, 76% 44%, 88% 24%, 100% 38%, 100% 100%)' }}
      />

      {/* Mountains front layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[105px] bg-gray-700"
        style={{ clipPath: 'polygon(0% 100%, 0% 52%, 14% 38%, 30% 50%, 44% 32%, 54% 46%, 70% 28%, 84% 42%, 100% 30%, 100% 100%)' }}
      />

      {/* Trees layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[65px] bg-emerald-800"
        style={{ clipPath: 'polygon(0% 100%, 0% 50%, 2% 28%, 4% 50%, 6% 22%, 8% 48%, 10% 32%, 12% 52%, 14% 26%, 16% 48%, 18% 18%, 20% 44%, 22% 32%, 24% 52%, 26% 24%, 28% 48%, 30% 28%, 32% 52%, 34% 32%, 36% 48%, 38% 18%, 40% 44%, 42% 28%, 44% 52%, 46% 22%, 48% 48%, 50% 32%, 52% 52%, 54% 26%, 56% 48%, 58% 18%, 60% 44%, 62% 32%, 64% 52%, 66% 24%, 68% 48%, 70% 28%, 72% 52%, 74% 32%, 76% 48%, 78% 18%, 80% 44%, 82% 28%, 84% 52%, 86% 22%, 88% 48%, 90% 32%, 92% 52%, 94% 26%, 96% 48%, 98% 22%, 100% 38%, 100% 100%)' }}
      />
    </div>
  );
}

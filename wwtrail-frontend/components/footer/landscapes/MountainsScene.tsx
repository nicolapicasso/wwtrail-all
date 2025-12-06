'use client';

import { Stars } from './Stars';

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

      {/* Clouds */}
      <div className="cloud absolute top-[22px] w-[85px] h-[26px] bg-white/90 rounded-[50px] animate-cloud-float" style={{ animationDuration: '50s' }} />
      <div className="cloud absolute top-[50px] w-[65px] h-[20px] bg-white/90 rounded-[50px] animate-cloud-float" style={{ animationDuration: '60s', animationDelay: '-20s' }} />
      <div className="cloud absolute top-[35px] w-[45px] h-[16px] bg-white/90 rounded-[50px] animate-cloud-float" style={{ animationDuration: '55s', animationDelay: '-35s' }} />

      {/* Mountains back layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[170px] bg-gray-500"
        style={{ clipPath: 'polygon(0% 100%, 0% 55%, 8% 42%, 16% 52%, 26% 28%, 36% 48%, 46% 22%, 56% 42%, 66% 18%, 76% 38%, 86% 12%, 100% 32%, 100% 100%)' }}
      />

      {/* Snow caps */}
      <div
        className="absolute bottom-0 left-0 w-full h-[170px] bg-white opacity-90"
        style={{ clipPath: 'polygon(26% 28%, 28% 36%, 24% 36%, 46% 22%, 48% 32%, 44% 32%, 66% 18%, 68% 28%, 64% 28%, 86% 12%, 88% 24%, 84% 24%)' }}
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

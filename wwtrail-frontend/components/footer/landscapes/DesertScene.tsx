'use client';

import { Stars } from './Stars';

interface DesertSceneProps {
  isNight: boolean;
}

function Cactus({ position, scale = 1 }: { position: string; scale?: number }) {
  return (
    <div
      className="absolute bottom-[70px]"
      style={{ left: position, transform: `scale(${scale})` }}
    >
      <div className="w-2 h-[45px] bg-emerald-800 rounded relative">
        {/* Left arm */}
        <div className="absolute left-[-10px] top-[10px] w-1.5 h-[25px] bg-emerald-800 rounded" />
        {/* Right arm */}
        <div className="absolute right-[-10px] top-[15px] w-1.5 h-[20px] bg-emerald-800 rounded" />
      </div>
    </div>
  );
}

function CactusNight({ position, scale = 1 }: { position: string; scale?: number }) {
  return (
    <div
      className="absolute bottom-[70px]"
      style={{ left: position, transform: `scale(${scale})` }}
    >
      <div className="w-2 h-[45px] bg-indigo-950 rounded relative">
        {/* Left arm */}
        <div className="absolute left-[-10px] top-[10px] w-1.5 h-[25px] bg-indigo-950 rounded" />
        {/* Right arm */}
        <div className="absolute right-[-10px] top-[15px] w-1.5 h-[20px] bg-indigo-950 rounded" />
      </div>
    </div>
  );
}

export function DesertScene({ isNight }: DesertSceneProps) {
  if (isNight) {
    return (
      <div className="desert-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-indigo-900 to-purple-900" />

        {/* Stars */}
        <Stars count={70} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[18%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-indigo-950 rounded-full" />
        </div>

        {/* Dunes back layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[160px] bg-gradient-to-b from-indigo-700 to-indigo-900"
          style={{ clipPath: 'polygon(0% 100%, 0% 70%, 15% 50%, 35% 65%, 55% 45%, 75% 60%, 95% 40%, 100% 55%, 100% 100%)' }}
        />

        {/* Dunes mid layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[130px] bg-gradient-to-b from-indigo-600 to-indigo-700"
          style={{ clipPath: 'polygon(0% 100%, 0% 55%, 20% 40%, 40% 55%, 60% 35%, 80% 50%, 100% 38%, 100% 100%)' }}
        />

        {/* Dunes front layer */}
        <div
          className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-b from-indigo-500 to-indigo-600"
          style={{ clipPath: 'polygon(0% 100%, 0% 50%, 25% 38%, 45% 52%, 65% 32%, 85% 48%, 100% 35%, 100% 100%)' }}
        />

        {/* Cacti */}
        <CactusNight position="12%" />
        <CactusNight position="78%" scale={0.7} />
        <CactusNight position="35%" scale={0.5} />
      </div>
    );
  }

  return (
    <div className="desert-day absolute inset-0 overflow-hidden">
      {/* Day sky gradient - hot desert */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-100 via-amber-200 to-amber-500" />

      {/* Sun - intense */}
      <div className="absolute top-[30px] right-[18%] w-[60px] h-[60px] bg-orange-50 rounded-full shadow-[0_0_80px_#fbbf24,0_0_120px_#f59e0b]" />

      {/* Dunes back layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[160px] bg-gradient-to-b from-amber-600 to-amber-700"
        style={{ clipPath: 'polygon(0% 100%, 0% 70%, 15% 50%, 35% 65%, 55% 45%, 75% 60%, 95% 40%, 100% 55%, 100% 100%)' }}
      />

      {/* Dunes mid layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[130px] bg-gradient-to-b from-amber-500 to-amber-600"
        style={{ clipPath: 'polygon(0% 100%, 0% 55%, 20% 40%, 40% 55%, 60% 35%, 80% 50%, 100% 38%, 100% 100%)' }}
      />

      {/* Dunes front layer */}
      <div
        className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-b from-amber-400 to-amber-500"
        style={{ clipPath: 'polygon(0% 100%, 0% 50%, 25% 38%, 45% 52%, 65% 32%, 85% 48%, 100% 35%, 100% 100%)' }}
      />

      {/* Cacti */}
      <Cactus position="12%" />
      <Cactus position="78%" scale={0.7} />
      <Cactus position="35%" scale={0.5} />
    </div>
  );
}

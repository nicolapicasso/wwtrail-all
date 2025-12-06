'use client';

import { Stars } from './Stars';

interface CoastSceneProps {
  isNight: boolean;
}

function Palm({ position, flip = false }: { position: string; flip?: boolean }) {
  return (
    <div
      className="absolute bottom-[65px]"
      style={{ left: position, transform: flip ? 'scale(0.8) scaleX(-1)' : undefined }}
    >
      {/* Trunk */}
      <div className="w-1.5 h-[50px] bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded -rotate-[5deg]" />
      {/* Leaves container */}
      <div className="absolute -top-[15px] -left-5 w-[50px] h-[30px]">
        <div className="absolute w-[25px] h-2 bg-green-700 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right -rotate-[60deg] left-[10px]" />
        <div className="absolute w-[25px] h-2 bg-green-700 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right -rotate-[30deg] left-[15px] top-[5px]" />
        <div className="absolute w-[25px] h-2 bg-green-700 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right rotate-0 left-[18px] top-[10px]" />
        <div className="absolute w-[25px] h-2 bg-green-700 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right rotate-[30deg] left-[15px] top-[15px]" />
        <div className="absolute w-[25px] h-2 bg-green-700 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right rotate-[60deg] left-[10px] top-[20px]" />
      </div>
    </div>
  );
}

function PalmNight({ position, flip = false }: { position: string; flip?: boolean }) {
  return (
    <div
      className="absolute bottom-[65px]"
      style={{ left: position, transform: flip ? 'scale(0.8) scaleX(-1)' : undefined }}
    >
      {/* Trunk */}
      <div className="w-1.5 h-[50px] bg-slate-800 rounded -rotate-[5deg]" />
      {/* Leaves container */}
      <div className="absolute -top-[15px] -left-5 w-[50px] h-[30px]">
        <div className="absolute w-[25px] h-2 bg-slate-900 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right -rotate-[60deg] left-[10px]" />
        <div className="absolute w-[25px] h-2 bg-slate-900 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right -rotate-[30deg] left-[15px] top-[5px]" />
        <div className="absolute w-[25px] h-2 bg-slate-900 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right rotate-0 left-[18px] top-[10px]" />
        <div className="absolute w-[25px] h-2 bg-slate-900 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right rotate-[30deg] left-[15px] top-[15px]" />
        <div className="absolute w-[25px] h-2 bg-slate-900 rounded-[50%_50%_50%_50%/80%_80%_20%_20%] origin-right rotate-[60deg] left-[10px] top-[20px]" />
      </div>
    </div>
  );
}

export function CoastScene({ isNight }: CoastSceneProps) {
  if (isNight) {
    return (
      <div className="coast-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-blue-900" />

        {/* Stars */}
        <Stars count={45} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[20%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-slate-900 rounded-full" />
        </div>

        {/* Sea */}
        <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-blue-900 to-blue-800">
          {/* Waves */}
          <div className="absolute bottom-[110px] w-[200%] h-5 bg-blue-300/10 rounded-full animate-wave" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-[95px] w-[200%] h-5 bg-blue-300/10 rounded-full animate-wave-reverse opacity-60" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-[80px] w-[200%] h-5 bg-blue-300/10 rounded-full animate-wave opacity-40" style={{ animationDuration: '10s' }} />

          {/* Moon reflection */}
          <div className="absolute bottom-[90px] right-[18%] w-[60px] h-[80px] bg-gradient-to-b from-amber-100/30 to-transparent blur-lg scale-y-150" />
        </div>

        {/* Beach */}
        <div
          className="absolute bottom-0 left-0 w-full h-[85px] bg-gradient-to-b from-slate-600 to-slate-700"
          style={{ clipPath: 'polygon(0% 100%, 0% 30%, 10% 45%, 25% 25%, 40% 40%, 55% 20%, 70% 35%, 85% 15%, 100% 30%, 100% 100%)' }}
        />

        {/* Palms */}
        <PalmNight position="8%" />
        <PalmNight position="85%" flip />
      </div>
    );
  }

  return (
    <div className="coast-day absolute inset-0 overflow-hidden">
      {/* Day sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-cyan-500" />

      {/* Sun */}
      <div className="absolute top-[30px] right-[20%] w-[50px] h-[50px] bg-amber-400 rounded-full shadow-[0_0_50px_#fbbf24]" />

      {/* Clouds */}
      <div className="cloud absolute top-[20px] w-[80px] h-[24px] bg-white/90 rounded-[50px] animate-cloud-float" style={{ animationDuration: '55s' }} />
      <div className="cloud absolute top-[48px] w-[60px] h-[18px] bg-white/90 rounded-[50px] animate-cloud-float" style={{ animationDuration: '65s', animationDelay: '-25s' }} />

      {/* Sea */}
      <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-sky-600 to-sky-700">
        {/* Waves */}
        <div className="absolute bottom-[110px] w-[200%] h-5 bg-white/15 rounded-full animate-wave" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[95px] w-[200%] h-5 bg-white/15 rounded-full animate-wave-reverse opacity-70" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-[80px] w-[200%] h-5 bg-white/15 rounded-full animate-wave opacity-50" style={{ animationDuration: '10s' }} />
      </div>

      {/* Beach */}
      <div
        className="absolute bottom-0 left-0 w-full h-[85px] bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300"
        style={{ clipPath: 'polygon(0% 100%, 0% 30%, 10% 45%, 25% 25%, 40% 40%, 55% 20%, 70% 35%, 85% 15%, 100% 30%, 100% 100%)' }}
      />

      {/* Palms */}
      <Palm position="8%" />
      <Palm position="85%" flip />
    </div>
  );
}

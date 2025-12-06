'use client';

import { Stars } from './Stars';
import { Clouds } from './Clouds';
import { Waves } from './Waves';

interface CoastSceneProps {
  isNight: boolean;
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
          {/* Animated Waves */}
          <Waves variant="night" />

          {/* Moon reflection */}
          <div className="absolute bottom-[90px] right-[18%] w-[60px] h-[80px] bg-gradient-to-b from-amber-100/30 to-transparent blur-lg scale-y-150" />
        </div>

        {/* Beach */}
        <div
          className="absolute bottom-0 left-0 w-full h-[85px] bg-gradient-to-b from-slate-600 to-slate-700"
          style={{ clipPath: 'polygon(0% 100%, 0% 30%, 10% 45%, 25% 25%, 40% 40%, 55% 20%, 70% 35%, 85% 15%, 100% 30%, 100% 100%)' }}
        />
      </div>
    );
  }

  return (
    <div className="coast-day absolute inset-0 overflow-hidden">
      {/* Day sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-cyan-500" />

      {/* Sun */}
      <div className="absolute top-[30px] right-[20%] w-[50px] h-[50px] bg-amber-400 rounded-full shadow-[0_0_50px_#fbbf24]" />

      {/* Animated Clouds */}
      <Clouds count={2} />

      {/* Sea */}
      <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-b from-sky-600 to-sky-700">
        {/* Animated Waves */}
        <Waves variant="day" />
      </div>

      {/* Beach */}
      <div
        className="absolute bottom-0 left-0 w-full h-[85px] bg-gradient-to-b from-amber-100 via-amber-200 to-amber-300"
        style={{ clipPath: 'polygon(0% 100%, 0% 30%, 10% 45%, 25% 25%, 40% 40%, 55% 20%, 70% 35%, 85% 15%, 100% 30%, 100% 100%)' }}
      />
    </div>
  );
}

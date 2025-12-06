'use client';

import { Stars } from './Stars';

interface DesertSceneProps {
  isNight: boolean;
}

export function DesertScene({ isNight }: DesertSceneProps) {
  if (isNight) {
    return (
      <div className="desert-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient - deep purple desert night */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #0f0a1a 0%,
              #1a1428 20%,
              #251e38 40%,
              #352a4a 60%,
              #453858 80%,
              #554668 100%
            )`,
          }}
        />

        {/* Stars */}
        <Stars count={70} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[18%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#0f0a1a] rounded-full" />
        </div>

        {/* Desert mesa silhouettes */}
        <div
          className="absolute bottom-0 left-0 w-full h-[160px]"
          style={{
            background: '#2a2040',
            clipPath: 'polygon(0% 100%, 0% 65%, 8% 65%, 10% 45%, 18% 45%, 20% 65%, 35% 65%, 38% 40%, 48% 40%, 50% 65%, 65% 65%, 70% 50%, 85% 50%, 88% 65%, 100% 65%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[120px]"
          style={{
            background: '#1a1530',
            clipPath: 'polygon(0% 100%, 0% 55%, 15% 55%, 18% 35%, 28% 35%, 30% 55%, 50% 55%, 55% 42%, 65% 42%, 68% 55%, 100% 55%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[80px] bg-[#0f0a20]"
          style={{ clipPath: 'polygon(0% 100%, 0% 45%, 25% 50%, 50% 42%, 75% 48%, 100% 40%, 100% 100%)' }}
        />
      </div>
    );
  }

  return (
    <div className="desert-day absolute inset-0 overflow-hidden">
      {/* Photographic desert sunset - warm gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #4a6b8a 0%,
            #6a8aaa 12%,
            #8aa5b8 22%,
            #c4a890 35%,
            #d4a878 45%,
            #e8a860 55%,
            #f0a050 65%,
            #f59840 75%,
            #f89030 85%,
            #fa8820 100%
          )`,
        }}
      />

      {/* Sun glow near horizon */}
      <div
        className="absolute bottom-[90px] left-[30%] w-[180px] h-[100px] opacity-70"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,200,100,0.8) 0%, rgba(255,160,80,0.4) 40%, transparent 70%)',
        }}
      />

      {/* Atmospheric dust haze */}
      <div
        className="absolute bottom-[60px] left-0 w-full h-[120px] opacity-30"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200,150,100,0.6) 100%)',
        }}
      />

      {/* Mesa silhouettes - far */}
      <div
        className="absolute bottom-0 left-0 w-full h-[180px]"
        style={{
          background: 'linear-gradient(to bottom, #7a6a5a 0%, #6a5a4a 100%)',
          clipPath: 'polygon(0% 100%, 0% 60%, 5% 60%, 8% 38%, 18% 38%, 22% 60%, 40% 60%, 45% 45%, 55% 45%, 58% 60%, 75% 60%, 80% 35%, 92% 35%, 95% 60%, 100% 60%, 100% 100%)',
        }}
      />

      {/* Mesa silhouettes - mid */}
      <div
        className="absolute bottom-0 left-0 w-full h-[140px]"
        style={{
          background: 'linear-gradient(to bottom, #5a4a3a 0%, #4a3a2a 100%)',
          clipPath: 'polygon(0% 100%, 0% 52%, 12% 52%, 15% 32%, 25% 32%, 28% 52%, 48% 52%, 52% 38%, 62% 38%, 65% 52%, 85% 52%, 88% 42%, 95% 42%, 98% 52%, 100% 52%, 100% 100%)',
        }}
      />

      {/* Desert floor silhouette - near */}
      <div
        className="absolute bottom-0 left-0 w-full h-[90px]"
        style={{
          background: 'linear-gradient(to bottom, #3a2a1a 0%, #2a1a0a 100%)',
          clipPath: 'polygon(0% 100%, 0% 42%, 20% 48%, 40% 40%, 60% 45%, 80% 38%, 100% 42%, 100% 100%)',
        }}
      />
    </div>
  );
}

'use client';

import { Stars } from './Stars';
import { NoiseTexture } from './NoiseTexture';

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
              #1a1525 0%,
              #252035 30%,
              #352845 60%,
              #453555 100%
            )`,
          }}
        />

        {/* Stars */}
        <Stars count={70} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[18%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#1a1525] rounded-full" />
        </div>

        {/* Desert mesa silhouettes */}
        <div
          className="absolute bottom-0 left-0 w-full h-[150px] bg-[#2a2040]"
          style={{
            clipPath: 'polygon(0% 100%, 0% 65%, 10% 65%, 12% 42%, 22% 42%, 25% 65%, 45% 65%, 48% 38%, 58% 38%, 60% 65%, 80% 65%, 85% 48%, 95% 48%, 98% 65%, 100% 65%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[100px] bg-[#1a1530]"
          style={{ clipPath: 'polygon(0% 100%, 0% 50%, 30% 55%, 60% 45%, 100% 52%, 100% 100%)' }}
        />

        <NoiseTexture opacity={0.1} />
      </div>
    );
  }

  return (
    <div className="desert-day absolute inset-0 overflow-hidden">
      {/* Watercolor desert sky - warm terracotta tones */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #c8d5dc 0%,
            #d5dce0 15%,
            #e2ddd5 30%,
            #e8d5c5 45%,
            #e5c8b2 60%,
            #ddb8a0 75%,
            #d5a890 90%,
            #c89880 100%
          )`,
        }}
      />

      {/* Soft sun glow */}
      <div
        className="absolute bottom-[100px] left-[25%] w-[120px] h-[80px] opacity-45"
        style={{
          background: 'radial-gradient(ellipse, rgba(248,220,180,0.8) 0%, rgba(240,200,150,0.3) 60%, transparent 85%)',
          filter: 'blur(10px)',
        }}
      />

      {/* Dust haze */}
      <div
        className="absolute bottom-[60px] left-0 w-full h-[100px] opacity-30"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(210,180,150,0.5) 100%)',
        }}
      />

      {/* Mesa formations - watercolor style */}
      {/* Far mesas - hazy */}
      <div
        className="absolute bottom-0 left-0 w-full h-[170px]"
        style={{
          background: 'linear-gradient(to bottom, #c5b5a5 0%, #b5a595 50%, #a59585 100%)',
          clipPath: 'polygon(0% 100%, 0% 62%, 8% 62%, 10% 38%, 20% 38%, 23% 62%, 42% 62%, 46% 45%, 56% 45%, 58% 62%, 78% 62%, 82% 35%, 94% 35%, 96% 62%, 100% 62%, 100% 100%)',
        }}
      />

      {/* Mid mesas */}
      <div
        className="absolute bottom-0 left-0 w-full h-[130px]"
        style={{
          background: 'linear-gradient(to bottom, #a08878 0%, #907868 50%, #806858 100%)',
          clipPath: 'polygon(0% 100%, 0% 55%, 15% 55%, 18% 35%, 30% 35%, 32% 55%, 55% 55%, 60% 42%, 72% 42%, 75% 55%, 100% 55%, 100% 100%)',
        }}
      />

      {/* Near desert floor */}
      <div
        className="absolute bottom-0 left-0 w-full h-[85px]"
        style={{
          background: 'linear-gradient(to bottom, #785848 0%, #685040 50%, #584838 100%)',
          clipPath: 'polygon(0% 100%, 0% 45%, 25% 50%, 50% 42%, 75% 48%, 100% 44%, 100% 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <NoiseTexture opacity={0.15} />
    </div>
  );
}

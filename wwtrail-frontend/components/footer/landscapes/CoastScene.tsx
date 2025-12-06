'use client';

import { Stars } from './Stars';
import { NoiseTexture } from './NoiseTexture';

interface CoastSceneProps {
  isNight: boolean;
}

export function CoastScene({ isNight }: CoastSceneProps) {
  if (isNight) {
    return (
      <div className="coast-night absolute inset-0 overflow-hidden">
        {/* Night sky gradient - deep blue ocean night */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #0a1520 0%,
              #102030 25%,
              #183040 50%,
              #204050 75%,
              #285060 100%
            )`,
          }}
        />

        {/* Stars */}
        <Stars count={45} />

        {/* Moon */}
        <div className="moon absolute top-[30px] right-[20%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#0a1520] rounded-full" />
        </div>

        {/* Ocean - dark */}
        <div
          className="absolute bottom-0 left-0 w-full h-[150px]"
          style={{
            background: `linear-gradient(to bottom, #1a3040 0%, #152535 50%, #101a25 100%)`,
          }}
        >
          {/* Moon reflection */}
          <div
            className="absolute bottom-[50px] right-[18%] w-[60px] h-[80px] opacity-25"
            style={{
              background: 'linear-gradient(to bottom, rgba(254,243,199,0.4) 0%, transparent 100%)',
              filter: 'blur(6px)',
            }}
          />
        </div>

        {/* Rocky coastline silhouette */}
        <div
          className="absolute bottom-0 left-0 w-full h-[85px] bg-[#0a1018]"
          style={{
            clipPath: 'polygon(0% 100%, 0% 38%, 8% 42%, 15% 28%, 22% 40%, 30% 22%, 38% 38%, 48% 30%, 58% 42%, 68% 25%, 78% 40%, 88% 32%, 100% 38%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.08} />
      </div>
    );
  }

  return (
    <div className="coast-day absolute inset-0 overflow-hidden">
      {/* Watercolor coastal sky - soft blues and pinks */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #b5c8d5 0%,
            #c5d5de 15%,
            #d5dde5 30%,
            #e2ddd8 45%,
            #e5d8d2 55%,
            #e2d0c8 65%,
            #dcc5bc 78%,
            #d5b8b0 90%,
            #c8a8a0 100%
          )`,
        }}
      />

      {/* Soft sun glow - diffused */}
      <div
        className="absolute bottom-[115px] left-[38%] w-[100px] h-[60px] opacity-40"
        style={{
          background: 'radial-gradient(ellipse, rgba(250,230,200,0.8) 0%, rgba(240,210,180,0.3) 60%, transparent 90%)',
          filter: 'blur(12px)',
        }}
      />

      {/* Sea mist */}
      <div
        className="absolute bottom-[80px] left-0 w-full h-[70px] opacity-35"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(190,200,205,0.5) 100%)',
        }}
      />

      {/* Ocean - watercolor blues/greens */}
      <div
        className="absolute bottom-0 left-0 w-full h-[145px]"
        style={{
          background: `linear-gradient(to bottom,
            #95a8b5 0%,
            #88a0ad 25%,
            #7a95a5 50%,
            #6c8898 75%,
            #5e7a8a 100%
          )`,
        }}
      >
        {/* Subtle light on water */}
        <div
          className="absolute top-[15px] left-[32%] w-[180px] h-[50px] opacity-20"
          style={{
            background: 'linear-gradient(to bottom, rgba(220,210,200,0.5) 0%, transparent 100%)',
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* Rocky coastline - organic watercolor shapes */}
      <div
        className="absolute bottom-0 left-0 w-full h-[95px]"
        style={{
          background: 'linear-gradient(to bottom, #6a7570 0%, #5a6560 50%, #4a5550 100%)',
          clipPath: 'polygon(0% 100%, 0% 35%, 6% 40%, 12% 25%, 20% 38%, 28% 20%, 36% 35%, 45% 28%, 54% 42%, 62% 22%, 70% 38%, 80% 30%, 88% 42%, 95% 28%, 100% 35%, 100% 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <NoiseTexture opacity={0.12} />
    </div>
  );
}

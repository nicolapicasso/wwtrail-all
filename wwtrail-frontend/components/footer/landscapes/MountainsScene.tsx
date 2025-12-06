'use client';

import { Stars } from './Stars';
import { NoiseTexture } from './NoiseTexture';

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

        {/* Mountains - silhouettes with atmospheric perspective */}
        <div
          className="absolute bottom-0 left-0 w-full h-[180px] bg-slate-700/60"
          style={{ clipPath: 'polygon(0% 100%, 0% 55%, 8% 42%, 16% 52%, 26% 28%, 36% 48%, 46% 22%, 56% 42%, 66% 18%, 76% 38%, 86% 12%, 100% 32%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[145px] bg-slate-800/80"
          style={{ clipPath: 'polygon(0% 100%, 0% 58%, 12% 42%, 24% 55%, 36% 32%, 50% 48%, 62% 28%, 76% 44%, 88% 24%, 100% 38%, 100% 100%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[110px] bg-slate-900"
          style={{ clipPath: 'polygon(0% 100%, 0% 52%, 14% 38%, 30% 50%, 44% 32%, 54% 46%, 70% 28%, 84% 42%, 100% 30%, 100% 100%)' }}
        />

        <NoiseTexture opacity={0.08} />
      </div>
    );
  }

  return (
    <div className="mountains-day absolute inset-0 overflow-hidden">
      {/* Watercolor sky - soft muted tones */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            #a8c4d4 0%,
            #c5d5df 20%,
            #dde5e8 40%,
            #e8ddd5 55%,
            #e5d5c5 70%,
            #dfc8b5 85%,
            #d8bca5 100%
          )`,
        }}
      />

      {/* Soft sun glow - watercolor style */}
      <div
        className="absolute bottom-[120px] right-[18%] w-[100px] h-[100px] rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(245,225,195,0.9) 0%, rgba(235,210,175,0.4) 50%, transparent 75%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Mist layer between mountains */}
      <div
        className="absolute bottom-[90px] left-0 w-full h-[80px] opacity-40"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200,210,215,0.7) 50%, transparent 100%)',
        }}
      />

      {/* Mountains - muted watercolor tones with soft edges */}
      {/* Far mountains - hazy, lighter */}
      <div
        className="absolute bottom-0 left-0 w-full h-[190px]"
        style={{
          background: 'linear-gradient(to bottom, #b8c5cc 0%, #a5b5bf 50%, #98a8b2 100%)',
          clipPath: 'polygon(0% 100%, 0% 52%, 6% 42%, 14% 50%, 22% 35%, 32% 48%, 42% 28%, 52% 45%, 62% 22%, 72% 42%, 82% 18%, 92% 38%, 100% 28%, 100% 100%)',
        }}
      />

      {/* Mid mountains */}
      <div
        className="absolute bottom-0 left-0 w-full h-[155px]"
        style={{
          background: 'linear-gradient(to bottom, #8a9da8 0%, #7a8d98 50%, #6a7d88 100%)',
          clipPath: 'polygon(0% 100%, 0% 55%, 10% 42%, 25% 55%, 38% 32%, 52% 50%, 65% 28%, 78% 48%, 90% 25%, 100% 40%, 100% 100%)',
        }}
      />

      {/* Near mountains - darker, more saturated */}
      <div
        className="absolute bottom-0 left-0 w-full h-[115px]"
        style={{
          background: 'linear-gradient(to bottom, #5a6d75 0%, #4a5d65 50%, #3a4d55 100%)',
          clipPath: 'polygon(0% 100%, 0% 50%, 12% 35%, 30% 52%, 45% 30%, 58% 48%, 72% 28%, 88% 45%, 100% 32%, 100% 100%)',
        }}
      />

      {/* Forest silhouette - organic edge */}
      <div
        className="absolute bottom-0 left-0 w-full h-[65px]"
        style={{
          background: 'linear-gradient(to bottom, #3a4540 0%, #2a3530 100%)',
          clipPath: 'polygon(0% 100%, 0% 55%, 3% 38%, 6% 55%, 9% 32%, 12% 52%, 15% 40%, 18% 58%, 21% 35%, 24% 52%, 27% 28%, 30% 50%, 33% 42%, 36% 55%, 39% 32%, 42% 52%, 45% 38%, 48% 58%, 51% 35%, 54% 52%, 57% 28%, 60% 50%, 63% 42%, 66% 55%, 69% 32%, 72% 52%, 75% 38%, 78% 58%, 81% 35%, 84% 52%, 87% 28%, 90% 50%, 93% 42%, 96% 55%, 100% 38%, 100% 100%)',
        }}
      />

      {/* Noise texture overlay */}
      <NoiseTexture opacity={0.12} />
    </div>
  );
}

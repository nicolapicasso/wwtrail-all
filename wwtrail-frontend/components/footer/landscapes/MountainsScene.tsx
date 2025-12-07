'use client';

import { Stars } from './Stars';
import { NoiseTexture } from './NoiseTexture';
import { TimeOfDay } from './LandscapeBackground';

interface MountainsSceneProps {
  timeOfDay: TimeOfDay;
}

export function MountainsScene({ timeOfDay }: MountainsSceneProps) {
  if (timeOfDay === 'night') {
    return (
      <div className="mountains-night absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700" />
        <Stars count={55} />
        <div className="moon absolute top-[30px] right-[14%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-slate-900 rounded-full" />
        </div>
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

  if (timeOfDay === 'sunrise') {
    return (
      <div className="mountains-sunrise absolute inset-0 overflow-hidden">
        {/* Sunrise sky - cool blues to warm pinks */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #4a5568 0%,
              #667788 12%,
              #8899a8 24%,
              #a8b0b8 36%,
              #c8b8b0 48%,
              #d8b8a8 58%,
              #e8b898 68%,
              #f0b088 78%,
              #f5a878 88%,
              #f8a068 100%
            )`,
          }}
        />

        {/* Rising sun glow - left side, low */}
        <div
          className="absolute bottom-[80px] left-[12%] w-[100px] h-[60px] opacity-70"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,200,150,1) 0%, rgba(255,180,120,0.5) 50%, transparent 80%)',
            filter: 'blur(8px)',
          }}
        />

        {/* Morning mist - stronger */}
        <div
          className="absolute bottom-[70px] left-0 w-full h-[100px] opacity-50"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(180,190,200,0.6) 50%, rgba(160,170,180,0.4) 100%)',
          }}
        />

        {/* Mountains - cool tones catching first light */}
        <div
          className="absolute bottom-0 left-0 w-full h-[190px]"
          style={{
            background: 'linear-gradient(to bottom, #9aa5b0 0%, #8a95a0 50%, #7a8590 100%)',
            clipPath: 'polygon(0% 100%, 0% 52%, 6% 42%, 14% 50%, 22% 35%, 32% 48%, 42% 28%, 52% 45%, 62% 22%, 72% 42%, 82% 18%, 92% 38%, 100% 28%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[155px]"
          style={{
            background: 'linear-gradient(to bottom, #6a7580 0%, #5a6570 50%, #4a5560 100%)',
            clipPath: 'polygon(0% 100%, 0% 55%, 10% 42%, 25% 55%, 38% 32%, 52% 50%, 65% 28%, 78% 48%, 90% 25%, 100% 40%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[115px]"
          style={{
            background: 'linear-gradient(to bottom, #3a4550 0%, #2a3540 50%, #1a2530 100%)',
            clipPath: 'polygon(0% 100%, 0% 50%, 12% 35%, 30% 52%, 45% 30%, 58% 48%, 72% 28%, 88% 45%, 100% 32%, 100% 100%)',
          }}
        />

        {/* Forest silhouette */}
        <div
          className="absolute bottom-0 left-0 w-full h-[65px]"
          style={{
            background: 'linear-gradient(to bottom, #2a3530 0%, #1a2520 100%)',
            clipPath: 'polygon(0% 100%, 0% 55%, 3% 38%, 6% 55%, 9% 32%, 12% 52%, 15% 40%, 18% 58%, 21% 35%, 24% 52%, 27% 28%, 30% 50%, 33% 42%, 36% 55%, 39% 32%, 42% 52%, 45% 38%, 48% 58%, 51% 35%, 54% 52%, 57% 28%, 60% 50%, 63% 42%, 66% 55%, 69% 32%, 72% 52%, 75% 38%, 78% 58%, 81% 35%, 84% 52%, 87% 28%, 90% 50%, 93% 42%, 96% 55%, 100% 38%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.12} />
      </div>
    );
  }

  if (timeOfDay === 'sunset') {
    return (
      <div className="mountains-sunset absolute inset-0 overflow-hidden">
        {/* Sunset sky - warm oranges to purples */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #4a4565 0%,
              #5a5075 10%,
              #6a5580 20%,
              #8a6088 30%,
              #a86888 40%,
              #c87888 50%,
              #d88878 60%,
              #e89868 70%,
              #f0a858 80%,
              #f5b848 90%,
              #f8c838 100%
            )`,
          }}
        />

        {/* Setting sun glow - right side */}
        <div
          className="absolute bottom-[90px] right-[15%] w-[120px] h-[70px] opacity-75"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,220,150,1) 0%, rgba(255,180,100,0.5) 50%, transparent 80%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Warm atmospheric haze */}
        <div
          className="absolute bottom-[60px] left-0 w-full h-[100px] opacity-40"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(200,150,120,0.5) 100%)',
          }}
        />

        {/* Mountains - warm tones in sunset light */}
        <div
          className="absolute bottom-0 left-0 w-full h-[190px]"
          style={{
            background: 'linear-gradient(to bottom, #8a7580 0%, #7a6570 50%, #6a5560 100%)',
            clipPath: 'polygon(0% 100%, 0% 52%, 6% 42%, 14% 50%, 22% 35%, 32% 48%, 42% 28%, 52% 45%, 62% 22%, 72% 42%, 82% 18%, 92% 38%, 100% 28%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[155px]"
          style={{
            background: 'linear-gradient(to bottom, #5a4550 0%, #4a3540 50%, #3a2530 100%)',
            clipPath: 'polygon(0% 100%, 0% 55%, 10% 42%, 25% 55%, 38% 32%, 52% 50%, 65% 28%, 78% 48%, 90% 25%, 100% 40%, 100% 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-full h-[115px]"
          style={{
            background: 'linear-gradient(to bottom, #2a2025 0%, #1a1520 50%, #0a0a15 100%)',
            clipPath: 'polygon(0% 100%, 0% 50%, 12% 35%, 30% 52%, 45% 30%, 58% 48%, 72% 28%, 88% 45%, 100% 32%, 100% 100%)',
          }}
        />

        {/* Forest silhouette - dark */}
        <div
          className="absolute bottom-0 left-0 w-full h-[65px] bg-[#0a0a10]"
          style={{
            clipPath: 'polygon(0% 100%, 0% 55%, 3% 38%, 6% 55%, 9% 32%, 12% 52%, 15% 40%, 18% 58%, 21% 35%, 24% 52%, 27% 28%, 30% 50%, 33% 42%, 36% 55%, 39% 32%, 42% 52%, 45% 38%, 48% 58%, 51% 35%, 54% 52%, 57% 28%, 60% 50%, 63% 42%, 66% 55%, 69% 32%, 72% 52%, 75% 38%, 78% 58%, 81% 35%, 84% 52%, 87% 28%, 90% 50%, 93% 42%, 96% 55%, 100% 38%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.12} />
      </div>
    );
  }

  // Day
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

      {/* Soft sun glow */}
      <div
        className="absolute bottom-[120px] right-[18%] w-[100px] h-[100px] rounded-full opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(245,225,195,0.9) 0%, rgba(235,210,175,0.4) 50%, transparent 75%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Mist layer */}
      <div
        className="absolute bottom-[90px] left-0 w-full h-[80px] opacity-40"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(200,210,215,0.7) 50%, transparent 100%)',
        }}
      />

      {/* Mountains - muted watercolor tones */}
      <div
        className="absolute bottom-0 left-0 w-full h-[190px]"
        style={{
          background: 'linear-gradient(to bottom, #b8c5cc 0%, #a5b5bf 50%, #98a8b2 100%)',
          clipPath: 'polygon(0% 100%, 0% 52%, 6% 42%, 14% 50%, 22% 35%, 32% 48%, 42% 28%, 52% 45%, 62% 22%, 72% 42%, 82% 18%, 92% 38%, 100% 28%, 100% 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[155px]"
        style={{
          background: 'linear-gradient(to bottom, #8a9da8 0%, #7a8d98 50%, #6a7d88 100%)',
          clipPath: 'polygon(0% 100%, 0% 55%, 10% 42%, 25% 55%, 38% 32%, 52% 50%, 65% 28%, 78% 48%, 90% 25%, 100% 40%, 100% 100%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-full h-[115px]"
        style={{
          background: 'linear-gradient(to bottom, #5a6d75 0%, #4a5d65 50%, #3a4d55 100%)',
          clipPath: 'polygon(0% 100%, 0% 50%, 12% 35%, 30% 52%, 45% 30%, 58% 48%, 72% 28%, 88% 45%, 100% 32%, 100% 100%)',
        }}
      />

      {/* Forest silhouette */}
      <div
        className="absolute bottom-0 left-0 w-full h-[65px]"
        style={{
          background: 'linear-gradient(to bottom, #3a4540 0%, #2a3530 100%)',
          clipPath: 'polygon(0% 100%, 0% 55%, 3% 38%, 6% 55%, 9% 32%, 12% 52%, 15% 40%, 18% 58%, 21% 35%, 24% 52%, 27% 28%, 30% 50%, 33% 42%, 36% 55%, 39% 32%, 42% 52%, 45% 38%, 48% 58%, 51% 35%, 54% 52%, 57% 28%, 60% 50%, 63% 42%, 66% 55%, 69% 32%, 72% 52%, 75% 38%, 78% 58%, 81% 35%, 84% 52%, 87% 28%, 90% 50%, 93% 42%, 96% 55%, 100% 38%, 100% 100%)',
        }}
      />

      <NoiseTexture opacity={0.12} />
    </div>
  );
}

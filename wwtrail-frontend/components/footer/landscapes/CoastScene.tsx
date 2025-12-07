'use client';

import { Stars } from './Stars';
import { NoiseTexture } from './NoiseTexture';
import { TimeOfDay } from './LandscapeBackground';

interface CoastSceneProps {
  timeOfDay: TimeOfDay;
}

export function CoastScene({ timeOfDay }: CoastSceneProps) {
  if (timeOfDay === 'night') {
    return (
      <div className="coast-night absolute inset-0 overflow-hidden">
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
        <Stars count={45} />
        <div className="moon absolute top-[30px] right-[20%] w-10 h-10 bg-amber-100 rounded-full shadow-[0_0_25px_rgba(254,243,199,0.4)]">
          <div className="absolute top-[3px] left-[-7px] w-9 h-9 bg-[#0a1520] rounded-full" />
        </div>
        <div
          className="absolute bottom-0 left-0 w-full h-[150px]"
          style={{
            background: `linear-gradient(to bottom, #1a3040 0%, #152535 50%, #101a25 100%)`,
          }}
        >
          <div
            className="absolute bottom-[50px] right-[18%] w-[60px] h-[80px] opacity-25"
            style={{
              background: 'linear-gradient(to bottom, rgba(254,243,199,0.4) 0%, transparent 100%)',
              filter: 'blur(6px)',
            }}
          />
        </div>
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

  if (timeOfDay === 'sunrise') {
    return (
      <div className="coast-sunrise absolute inset-0 overflow-hidden">
        {/* Sunrise sky - pale pinks and blues */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #4a5565 0%,
              #6a7585 12%,
              #8a95a5 24%,
              #a8a8b5 36%,
              #c0b0b8 48%,
              #d0b0a8 58%,
              #dca898 68%,
              #e8a088 78%,
              #f09878 88%,
              #f59068 100%
            )`,
          }}
        />

        {/* Rising sun over ocean - left side */}
        <div
          className="absolute bottom-[90px] left-[20%] w-[120px] h-[65px] opacity-70"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,200,150,1) 0%, rgba(255,180,120,0.5) 50%, transparent 80%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Morning sea mist */}
        <div
          className="absolute bottom-[70px] left-0 w-full h-[80px] opacity-45"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(180,190,200,0.5) 100%)',
          }}
        />

        {/* Ocean - cool morning tones with warm reflection */}
        <div
          className="absolute bottom-0 left-0 w-full h-[145px]"
          style={{
            background: `linear-gradient(to bottom,
              #7a8a98 0%,
              #6a7a88 30%,
              #5a6a78 60%,
              #4a5a68 100%
            )`,
          }}
        >
          {/* Sun reflection on water */}
          <div
            className="absolute top-[10px] left-[15%] w-[150px] h-[50px] opacity-30"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,200,160,0.5) 0%, transparent 100%)',
              filter: 'blur(8px)',
            }}
          />
        </div>

        {/* Rocky coastline */}
        <div
          className="absolute bottom-0 left-0 w-full h-[95px]"
          style={{
            background: 'linear-gradient(to bottom, #5a6058 0%, #4a5048 50%, #3a4038 100%)',
            clipPath: 'polygon(0% 100%, 0% 35%, 6% 40%, 12% 25%, 20% 38%, 28% 20%, 36% 35%, 45% 28%, 54% 42%, 62% 22%, 70% 38%, 80% 30%, 88% 42%, 95% 28%, 100% 35%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.12} />
      </div>
    );
  }

  if (timeOfDay === 'sunset') {
    return (
      <div className="coast-sunset absolute inset-0 overflow-hidden">
        {/* Sunset sky - dramatic oranges and purples */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom,
              #3a4058 0%,
              #5a4568 10%,
              #7a5078 20%,
              #9a5880 30%,
              #b86080 40%,
              #d07078 50%,
              #e08068 60%,
              #e89058 70%,
              #f0a048 80%,
              #f5b038 90%,
              #f8c028 100%
            )`,
          }}
        />

        {/* Setting sun glow over ocean */}
        <div
          className="absolute bottom-[95px] right-[25%] w-[150px] h-[80px] opacity-80"
          style={{
            background: 'radial-gradient(ellipse at center bottom, rgba(255,220,140,1) 0%, rgba(255,180,100,0.5) 50%, transparent 80%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Warm atmospheric haze */}
        <div
          className="absolute bottom-[60px] left-0 w-full h-[90px] opacity-40"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(200,140,100,0.5) 100%)',
          }}
        />

        {/* Ocean - warm reflections */}
        <div
          className="absolute bottom-0 left-0 w-full h-[145px]"
          style={{
            background: `linear-gradient(to bottom,
              #6a6878 0%,
              #5a5868 30%,
              #4a4858 60%,
              #3a3848 100%
            )`,
          }}
        >
          {/* Sunset reflection on water */}
          <div
            className="absolute top-[5px] right-[20%] w-[200px] h-[70px] opacity-35"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,200,140,0.6) 0%, rgba(255,160,100,0.2) 100%)',
              filter: 'blur(10px)',
            }}
          />
        </div>

        {/* Rocky coastline - silhouette */}
        <div
          className="absolute bottom-0 left-0 w-full h-[95px]"
          style={{
            background: 'linear-gradient(to bottom, #2a2830 0%, #1a1820 50%, #0a0810 100%)',
            clipPath: 'polygon(0% 100%, 0% 35%, 6% 40%, 12% 25%, 20% 38%, 28% 20%, 36% 35%, 45% 28%, 54% 42%, 62% 22%, 70% 38%, 80% 30%, 88% 42%, 95% 28%, 100% 35%, 100% 100%)',
          }}
        />

        <NoiseTexture opacity={0.12} />
      </div>
    );
  }

  // Day
  return (
    <div className="coast-day absolute inset-0 overflow-hidden">
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

      <div
        className="absolute bottom-[115px] left-[38%] w-[100px] h-[60px] opacity-40"
        style={{
          background: 'radial-gradient(ellipse, rgba(250,230,200,0.8) 0%, rgba(240,210,180,0.3) 60%, transparent 90%)',
          filter: 'blur(12px)',
        }}
      />

      <div
        className="absolute bottom-[80px] left-0 w-full h-[70px] opacity-35"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(190,200,205,0.5) 100%)',
        }}
      />

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
        <div
          className="absolute top-[15px] left-[32%] w-[180px] h-[50px] opacity-20"
          style={{
            background: 'linear-gradient(to bottom, rgba(220,210,200,0.5) 0%, transparent 100%)',
            filter: 'blur(8px)',
          }}
        />
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-[95px]"
        style={{
          background: 'linear-gradient(to bottom, #6a7570 0%, #5a6560 50%, #4a5550 100%)',
          clipPath: 'polygon(0% 100%, 0% 35%, 6% 40%, 12% 25%, 20% 38%, 28% 20%, 36% 35%, 45% 28%, 54% 42%, 62% 22%, 70% 38%, 80% 30%, 88% 42%, 95% 28%, 100% 35%, 100% 100%)',
        }}
      />

      <NoiseTexture opacity={0.12} />
    </div>
  );
}

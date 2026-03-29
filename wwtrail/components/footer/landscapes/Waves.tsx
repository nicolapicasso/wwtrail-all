'use client';

interface WavesProps {
  variant: 'day' | 'night';
}

export function Waves({ variant }: WavesProps) {
  const waveColor = variant === 'day' ? 'rgba(255,255,255,0.15)' : 'rgba(147,197,253,0.1)';

  return (
    <>
      <style jsx>{`
        @keyframes wave-motion {
          0%, 100% {
            transform: translateX(-25%);
          }
          50% {
            transform: translateX(0%);
          }
        }
        @keyframes wave-motion-reverse {
          0%, 100% {
            transform: translateX(0%);
          }
          50% {
            transform: translateX(-25%);
          }
        }
        .wave {
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .wave-1 {
          animation-name: wave-motion;
        }
        .wave-2 {
          animation-name: wave-motion-reverse;
        }
        .wave-3 {
          animation-name: wave-motion;
        }
      `}</style>
      <div
        className="wave wave-1 absolute w-[200%] h-5 rounded-full"
        style={{
          bottom: '110px',
          backgroundColor: waveColor,
          animationDuration: '8s',
        }}
      />
      <div
        className="wave wave-2 absolute w-[200%] h-5 rounded-full"
        style={{
          bottom: '95px',
          backgroundColor: waveColor,
          opacity: variant === 'day' ? 0.7 : 0.6,
          animationDuration: '6s',
        }}
      />
      <div
        className="wave wave-3 absolute w-[200%] h-5 rounded-full"
        style={{
          bottom: '80px',
          backgroundColor: waveColor,
          opacity: variant === 'day' ? 0.5 : 0.4,
          animationDuration: '10s',
        }}
      />
    </>
  );
}

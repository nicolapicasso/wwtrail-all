'use client';

import { useMemo } from 'react';

interface BirdsProps {
  count?: number;
  color?: string;
}

export function Birds({ count = 5, color = '#1c1917' }: BirdsProps) {
  const birds = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: 4 + Math.random() * 4, // 4-8px wingspan
      top: 60 + Math.random() * 80, // 60-140px from top
      delay: Math.random() * 30, // Random start delay
      duration: 25 + Math.random() * 20, // 25-45s to cross screen
      flapSpeed: 0.3 + Math.random() * 0.3, // 0.3-0.6s flap cycle
    }));
  }, [count]);

  return (
    <>
      <style jsx>{`
        @keyframes fly-across {
          0% {
            left: -30px;
          }
          100% {
            left: 100%;
          }
        }
        @keyframes flap {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(0.5);
          }
        }
        .bird {
          animation-name: fly-across;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        .bird-svg {
          animation-name: flap;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
      {birds.map((bird) => (
        <div
          key={bird.id}
          className="bird absolute"
          style={{
            top: `${bird.top}px`,
            animationDuration: `${bird.duration}s`,
            animationDelay: `${bird.delay}s`,
          }}
        >
          {/* Simple V-shape bird */}
          <svg
            width={bird.size * 3}
            height={bird.size * 2}
            viewBox="0 0 24 16"
            fill="none"
            className="bird-svg"
            style={{
              animationDuration: `${bird.flapSpeed}s`,
            }}
          >
            <path
              d="M0 8 L12 0 L24 8"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </>
  );
}

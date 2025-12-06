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
    }));
  }, [count]);

  return (
    <>
      {birds.map((bird) => (
        <div
          key={bird.id}
          className="bird absolute animate-bird-fly"
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
            className="animate-bird-flap"
            style={{
              animationDuration: '0.4s',
              animationDelay: `${Math.random() * 0.4}s`,
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

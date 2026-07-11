// components/InsiderBadge.tsx
'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';

interface InsiderBadgeProps {
  badgeUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const positionClasses = {
  sm: '-bottom-0.5 -right-0.5',
  md: '-bottom-1 -right-1',
  lg: '-bottom-1.5 -right-1.5',
};

/**
 * InsiderBadge component - displays the insider badge overlay
 * Use this as an absolute positioned element inside a relative parent
 */
export function InsiderBadge({ badgeUrl, size = 'md', className = '' }: InsiderBadgeProps) {
  const sizeClass = sizeClasses[size];
  const positionClass = positionClasses[size];

  return (
    <div className={`absolute ${positionClass} ${sizeClass} z-10 ${className}`}>
      {badgeUrl ? (
        <Image
          src={badgeUrl}
          alt="Insider"
          width={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          height={size === 'sm' ? 16 : size === 'md' ? 24 : 32}
          className="object-contain"
        />
      ) : (
        <div className={`${sizeClass} bg-yellow-500 rounded-full flex items-center justify-center`}>
          <Star className="w-2/3 h-2/3 text-white fill-white" />
        </div>
      )}
    </div>
  );
}

export default InsiderBadge;

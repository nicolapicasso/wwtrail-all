'use client';

import React from 'react';
import Link from 'next/link';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  link?: {
    href: string;
    label: string;
  };
  colorClass?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend,
  link,
  colorClass = 'text-primary-600',
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className={`text-3xl font-semibold ${colorClass}`}>{value}</p>
            {trend && (
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            )}
          </div>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {icon && (
          <div className={`flex-shrink-0 ${colorClass}`}>{icon}</div>
        )}
      </div>
      
      {link && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href={link.href}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            {link.label} →
          </Link>
        </div>
      )}
    </div>
  );
}

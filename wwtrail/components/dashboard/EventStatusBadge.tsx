'use client';

import { useTranslations } from 'next-intl';
import { EventStatus } from '@/types/event';

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export function EventStatusBadge({ status, className = '' }: EventStatusBadgeProps) {
  const t = useTranslations('boAdmin');
  const statusConfig = {
    [EventStatus.DRAFT]: {
      label: t('statusDraft'),
      className: 'bg-black text-white'
    },
    [EventStatus.PUBLISHED]: {
      label: t('statusPublished'),
      className: 'bg-[#0E612F] text-white'
    },
    [EventStatus.CANCELLED]: {
      label: t('statusCancelled'),
      className: 'bg-[#991B1B] text-white'
    },
    [EventStatus.ARCHIVED]: {
      label: t('statusArchived'),
      className: 'bg-[#B66916] text-white'
    }
  };

  const config = statusConfig[status] || statusConfig[EventStatus.DRAFT];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-semibold ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}

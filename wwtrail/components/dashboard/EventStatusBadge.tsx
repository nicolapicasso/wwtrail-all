import { EventStatus } from '@/types/event';

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export function EventStatusBadge({ status, className = '' }: EventStatusBadgeProps) {
  const statusConfig = {
    [EventStatus.DRAFT]: {
      label: 'Borrador',
      className: 'bg-black text-white'
    },
    [EventStatus.PUBLISHED]: {
      label: 'Publicado',
      className: 'bg-[#0E612F] text-white'
    },
    [EventStatus.CANCELLED]: {
      label: 'Cancelado',
      className: 'bg-[#991B1B] text-white'
    },
    [EventStatus.ARCHIVED]: {
      label: 'Archivado',
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

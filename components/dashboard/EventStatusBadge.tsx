import { EventStatus } from '@/types/event';

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export function EventStatusBadge({ status, className = '' }: EventStatusBadgeProps) {
  const statusConfig = {
    [EventStatus.DRAFT]: {
      label: 'Borrador',
      className: 'bg-gray-100 text-gray-800 border-gray-200'
    },
    [EventStatus.PUBLISHED]: {
      label: 'Publicado',
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    [EventStatus.CANCELLED]: {
      label: 'Cancelado',
      className: 'bg-red-100 text-red-800 border-red-200'
    },
    [EventStatus.ARCHIVED]: {
      label: 'Archivado',
      className: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  };

  const config = statusConfig[status] || statusConfig[EventStatus.DRAFT];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.className} ${className}`}>
      {config.label}
    </span>
  );
}

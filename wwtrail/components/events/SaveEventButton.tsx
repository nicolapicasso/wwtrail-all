// components/events/SaveEventButton.tsx
// "Guardar evento" CTA for the event detail sidebar.
// NOTE: event favorites are not yet backed by an API (the spec marks this as
// pending backend). For now this toggles local UI state so the interaction is
// complete; wire it to a favorites endpoint when available.

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SaveEventButton({ eventId }: { eventId: string }) {
  const t = useTranslations('cmpLayout');
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSaved((s) => !s)}
      aria-pressed={saved}
      data-event-id={eventId}
      className={cn(
        'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-[15px] font-bold transition-colors',
        saved
          ? 'border border-green-brand bg-green-tint-bg text-green-brand'
          : 'bg-green-brand text-white hover:opacity-90'
      )}
    >
      <Star className={cn('h-4.5 w-4.5', saved && 'fill-current')} />
      {saved ? t('eventSaved') : t('saveEvent')}
    </button>
  );
}

export default SaveEventButton;

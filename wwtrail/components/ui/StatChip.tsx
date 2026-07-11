// components/ui/StatChip.tsx
// Reusable "sport stat" chip used across the redesign (event cards, detail
// pages, etc.). The numeric value is rendered in Barlow Semi Condensed.

import { cn } from '@/lib/utils';

export interface StatChipProps {
  /** Uppercase label, e.g. "Carreras", "Dist. máx", "Desnivel+" */
  label: string;
  /** Main figure (already formatted), e.g. "171", "5" or "—" */
  value: React.ReactNode;
  /** Small dimmed suffix after the value, e.g. "km", "m" */
  suffix?: string;
  /** Orange "elevation" styling instead of the neutral look */
  variant?: 'neutral' | 'elevation';
  className?: string;
}

export function StatChip({
  label,
  value,
  suffix,
  variant = 'neutral',
  className,
}: StatChipProps) {
  const isElevation = variant === 'elevation';
  return (
    <div
      className={cn(
        'flex-1 rounded-sm px-3 py-2.5',
        isElevation ? 'bg-orange-tint-bg' : 'bg-surface-alt',
        className
      )}
    >
      <div
        className={cn(
          'text-[10px] font-bold uppercase tracking-[0.08em]',
          isElevation ? 'text-orange-text' : 'text-text-faint'
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          'font-stat font-bold leading-none',
          'text-[22px]',
          isElevation ? 'text-orange-strong' : 'text-ink-2'
        )}
      >
        {value}
        {suffix && (
          <span className="ml-0.5 text-[13px] font-semibold text-text-faint">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatChip;

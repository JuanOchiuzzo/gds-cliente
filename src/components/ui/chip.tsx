'use client';

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function Chip({ className, active, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all press',
        active
          ? 'border-transparent bg-[linear-gradient(135deg,#9d8cff,#5a46e0)] text-white shadow-[0_6px_18px_rgba(129,110,255,0.4)]'
          : 'border-line bg-white/[0.04] text-fg-soft hover:border-line-strong hover:text-fg',
        className,
      )}
      {...props}
    />
  );
}

'use client';

import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badge = cva(
  'inline-flex items-center gap-1 font-medium whitespace-nowrap select-none',
  {
    variants: {
      variant: {
        neutral:
          'bg-white/[0.06] text-fg-soft border border-line',
        iris:
          'bg-iris/15 text-iris-hi border border-iris/30',
        cyan:
          'bg-cyanx/15 text-cyanx border border-cyanx/30',
        ok: 'bg-ok/15 text-ok border border-ok/30',
        warn: 'bg-warn/15 text-warn border border-warn/30',
        bad: 'bg-bad/15 text-bad border border-bad/30',
        info: 'bg-info/15 text-info border border-info/30',
        hot: 'bg-hot/15 text-hot border border-hot/30',
        warm: 'bg-warm/15 text-warm border border-warm/30',
        cold: 'bg-cold/15 text-cold border border-cold/30',
        solid: 'bg-white text-ink-950 border border-white',
      },
      size: {
        xs: 'h-5 px-1.5 text-[10px] rounded-[6px]',
        sm: 'h-6 px-2 text-[11px] rounded-[7px]',
        md: 'h-7 px-2.5 text-xs rounded-[8px]',
        lg: 'h-8 px-3 text-sm rounded-[10px]',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'sm' },
  },
);

export type BadgeVariant =
  | 'neutral'
  | 'iris'
  | 'cyan'
  | 'ok'
  | 'warn'
  | 'bad'
  | 'info'
  | 'hot'
  | 'warm'
  | 'cold'
  | 'solid';

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badge> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badge({ variant, size }), className)} {...props} />;
}

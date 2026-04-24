import { forwardRef, type HTMLAttributes } from 'react';
import { cva, cn, type VariantProps } from '@/lib/cva';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        solar: 'bg-solar/15 text-white border border-solar/40',
        aurora: 'bg-white/[0.08] text-white border border-white/[0.16]',
        success: 'bg-success/15 text-success border border-success/25',
        warning: 'bg-warning/15 text-warning border border-warning/25',
        danger: 'bg-danger/15 text-danger border border-danger/25',
        info: 'bg-white/[0.08] text-white border border-white/[0.16]',
        neutral: 'bg-white/[0.055] text-text-soft border border-white/[0.12]',
        ghost: 'bg-transparent text-text-soft border border-white/[0.1]',
        hot: 'bg-hot/15 text-hot border border-hot/25',
        warm: 'bg-warm/15 text-warm border border-warm/25',
        cold: 'bg-cold/15 text-cold border border-cold/25',
        // Legacy aliases for smooth migration
        cyan: 'bg-info/15 text-info border border-info/25',
        violet: 'bg-white/[0.08] text-white border border-white/[0.16]',
        emerald: 'bg-success/15 text-success border border-success/25',
        amber: 'bg-warning/15 text-warning border border-warning/25',
        red: 'bg-danger/15 text-danger border border-danger/25',
        zinc: 'bg-white/[0.055] text-text-soft border border-white/[0.12]',
      },
      size: {
        xs: 'h-5 px-2 text-[10px]',
        sm: 'h-6 px-2.5 text-xs',
        md: 'h-7 px-3 text-[13px]',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'sm' },
  }
);

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, size, className, ...rest }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...rest} />
  )
);
Badge.displayName = 'Badge';

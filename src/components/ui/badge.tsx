import { forwardRef, type HTMLAttributes } from 'react';
import { cva, cn, type VariantProps } from '@/lib/cva';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        solar: 'bg-solar/15 text-solar border border-solar/25',
        aurora: 'bg-aurora-1/15 text-aurora-1 border border-aurora-1/25',
        success: 'bg-success/15 text-success border border-success/25',
        warning: 'bg-warning/15 text-warning border border-warning/25',
        danger: 'bg-danger/15 text-danger border border-danger/25',
        info: 'bg-info/15 text-info border border-info/25',
        neutral: 'bg-surface-2 text-text-soft border border-border-strong',
        ghost: 'bg-transparent text-text-soft border border-border',
        hot: 'bg-hot/15 text-hot border border-hot/25',
        warm: 'bg-warm/15 text-warm border border-warm/25',
        cold: 'bg-cold/15 text-cold border border-cold/25',
        // Legacy aliases for smooth migration
        cyan: 'bg-info/15 text-info border border-info/25',
        violet: 'bg-aurora-1/15 text-aurora-1 border border-aurora-1/25',
        emerald: 'bg-success/15 text-success border border-success/25',
        amber: 'bg-warning/15 text-warning border border-warning/25',
        red: 'bg-danger/15 text-danger border border-danger/25',
        zinc: 'bg-surface-2 text-text-soft border border-border-strong',
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

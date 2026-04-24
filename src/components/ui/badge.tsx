import { forwardRef, type HTMLAttributes } from 'react';
import { cva, cn, type VariantProps } from '@/lib/cva';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border font-semibold whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        solar: 'bg-solar/15 text-solar border-solar/40',
        aurora: 'bg-aurora-1/15 text-aurora-1 border-aurora-1/30',
        success: 'bg-success/15 text-success border-success/25',
        warning: 'bg-warning/15 text-warning border-warning/25',
        danger: 'bg-danger/15 text-danger border-danger/25',
        info: 'bg-info/15 text-info border-info/25',
        neutral: 'bg-white/[0.065] text-text-soft border-white/[0.12]',
        ghost: 'bg-transparent text-text-soft border-white/[0.1]',
        hot: 'bg-hot/15 text-hot border-hot/25',
        warm: 'bg-warm/15 text-warm border-warm/25',
        cold: 'bg-cold/15 text-cold border-cold/25',
        // Legacy aliases for smooth migration
        cyan: 'bg-info/15 text-info border-info/25',
        violet: 'bg-aurora-2/15 text-aurora-2 border-aurora-2/25',
        emerald: 'bg-success/15 text-success border-success/25',
        amber: 'bg-warning/15 text-warning border-warning/25',
        red: 'bg-danger/15 text-danger border-danger/25',
        zinc: 'bg-white/[0.065] text-text-soft border-white/[0.12]',
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

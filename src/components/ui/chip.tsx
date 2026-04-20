'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, cn, type VariantProps } from '@/lib/cva';
import { spring } from '@/lib/motion';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer select-none border',
  {
    variants: {
      variant: {
        default:
          'bg-surface-1 text-text-soft border-border-strong hover:text-text hover:border-border-glow',
        active:
          'bg-solar/15 text-solar border-solar/40',
        ghost:
          'bg-transparent text-text-soft border-transparent hover:bg-surface-1 hover:text-text',
      },
      size: {
        sm: 'h-7 px-3 text-xs',
        md: 'h-8 px-3.5 text-[13px]',
        lg: 'h-9 px-4 text-sm',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

export interface ChipProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'>,
    VariantProps<typeof chipVariants> {
  active?: boolean;
}

export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ variant, size, active, className, children, ...rest }, ref) => (
    <motion.button
      ref={ref}
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
      className={cn(chipVariants({ variant: active ? 'active' : variant, size }), className)}
      {...rest}
    >
      {children}
    </motion.button>
  )
);
Chip.displayName = 'Chip';

'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, cn, type VariantProps } from '@/lib/cva';
import { spring } from '@/lib/motion';

const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border font-semibold whitespace-nowrap transition-all cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-white/[0.06] text-text-soft border-white/[0.12] shadow-inset backdrop-blur-md hover:text-text hover:border-solar/40 hover:bg-white/[0.1]',
        active:
          'bg-solar-gradient text-[#06110f] border-transparent shadow-glow',
        ghost:
          'bg-transparent text-text-soft border-transparent hover:bg-white/[0.07] hover:text-text',
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

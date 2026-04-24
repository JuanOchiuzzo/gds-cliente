'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, cn, type VariantProps } from '@/lib/cva';
import { spring } from '@/lib/motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap select-none transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        solar:
          'bg-solar-gradient text-white shadow-md hover:shadow-glow',
        aurora:
          'bg-white text-canvas shadow-md hover:bg-white/90',
        primary:
          'bg-white text-canvas border border-white hover:bg-white/90',
        ghost:
          'bg-transparent text-text-soft hover:bg-white/[0.06] hover:text-text',
        subtle:
          'bg-white/[0.06] text-text-soft hover:bg-white/[0.1] hover:text-text',
        outline:
          'bg-transparent text-text border border-white/[0.16] hover:border-white/30 hover:bg-white/[0.06]',
        danger:
          'bg-danger/90 text-white hover:bg-danger',
        neon:
          'bg-solar-gradient text-white shadow-md hover:shadow-glow',
        secondary:
          'bg-surface-1 text-text border border-white/[0.12] hover:bg-surface-2',
      },
      size: {
        xs: 'h-8 px-2.5 text-xs',
        sm: 'h-9 px-3 text-[13px]',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, loading, disabled, children, ...rest }, ref) => (
    <motion.button
      ref={ref}
      whileTap={disabled || loading ? undefined : { scale: 0.96 }}
      whileHover={disabled || loading ? undefined : { y: -1 }}
      transition={spring}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{children}</>}
    </motion.button>
  )
);
Button.displayName = 'Button';

export { buttonVariants };

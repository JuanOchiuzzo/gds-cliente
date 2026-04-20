'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cva, cn, type VariantProps } from '@/lib/cva';
import { spring } from '@/lib/motion';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap select-none transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        solar:
          'bg-gradient-to-br from-solar to-solar-hot text-canvas shadow-md hover:shadow-glow',
        aurora:
          'bg-aurora-gradient text-canvas shadow-md hover:shadow-glow',
        primary:
          'bg-surface-2 text-text border border-border-strong hover:bg-surface-3 hover:border-border-glow',
        ghost:
          'bg-transparent text-text-soft hover:bg-surface-1 hover:text-text',
        subtle:
          'bg-surface-1 text-text-soft hover:bg-surface-2 hover:text-text',
        outline:
          'bg-transparent text-text border border-border-strong hover:border-border-glow hover:bg-surface-1',
        danger:
          'bg-danger/90 text-white hover:bg-danger',
        neon:
          'bg-gradient-to-br from-solar to-solar-hot text-canvas shadow-md hover:shadow-glow',
        secondary:
          'bg-surface-1 text-text border border-border-strong hover:bg-surface-2',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs',
        sm: 'h-8 px-3 text-[13px]',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-[15px]',
        icon: 'h-9 w-9',
        'icon-sm': 'h-7 w-7',
        'icon-lg': 'h-11 w-11',
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

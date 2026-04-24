'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cva, cn, type VariantProps } from '@/lib/cva';
import { spring } from '@/lib/motion';

const surfaceVariants = cva(
  'relative isolate rounded-lg border transition-colors duration-200',
  {
    variants: {
      variant: {
        flat: 'bg-surface-0 border-white/[0.08]',
        elevated: 'bg-surface-1 border-white/[0.12] shadow-md',
        glow: 'bg-surface-0 border-solar/40 shadow-glow',
        aurora: 'bg-surface-0 border-transparent aurora-border',
        ghost: 'bg-transparent border-white/[0.08]',
        glass: 'glass',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true: 'cursor-pointer hover:border-white/25 hover:bg-surface-2',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'flat',
      padding: 'md',
      interactive: false,
    },
  }
);

type SurfaceBaseProps = VariantProps<typeof surfaceVariants> & {
  children?: ReactNode;
  className?: string;
  asMotion?: boolean;
};

type SurfaceProps = SurfaceBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, keyof SurfaceBaseProps>;

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ variant, padding, interactive, className, children, asMotion, ...rest }, ref) => {
    if (asMotion) {
      return (
        <motion.div
          ref={ref}
          className={cn(surfaceVariants({ variant, padding, interactive }), className)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
          {...(rest as MotionProps)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(surfaceVariants({ variant, padding, interactive }), className)}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Surface.displayName = 'Surface';

export { surfaceVariants };

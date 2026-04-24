'use client';

import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cva, cn, type VariantProps } from '@/lib/cva';
import { spring } from '@/lib/motion';

const surfaceVariants = cva(
  'relative isolate rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        flat:
          'bg-[rgba(11,15,18,0.72)] border-white/[0.08] shadow-inset backdrop-blur-md',
        elevated:
          'native-panel',
        glow:
          'bg-[linear-gradient(180deg,rgba(91,241,198,0.13),rgba(11,15,18,0.78))] border-solar/40 shadow-glow backdrop-blur-xl',
        aurora:
          'bg-[rgba(11,15,18,0.78)] border-transparent aurora-border shadow-md backdrop-blur-xl',
        ghost:
          'bg-transparent border-white/[0.08]',
        glass:
          'glass',
        slate:
          'bg-[linear-gradient(180deg,rgba(255,255,255,0.065),rgba(255,255,255,0.025))] border-white/[0.1] shadow-sm',
      },
      padding: {
        none: 'p-0',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
        xl: 'p-8',
      },
      interactive: {
        true:
          'cursor-pointer hover:-translate-y-0.5 hover:border-solar/40 hover:bg-white/[0.08] hover:shadow-glow',
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

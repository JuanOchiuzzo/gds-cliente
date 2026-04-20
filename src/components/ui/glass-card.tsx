'use client';

// Backwards-compatible shim — delegates to Surface.
// Prefer importing Surface directly in new code.
import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  hover?: boolean;
  padding?: boolean;
  glow?: boolean;
  children?: ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, padding = true, glow, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      whileHover={hover ? { y: -2 } : undefined}
      transition={spring}
      className={cn(
        'bg-surface-0 border border-border-strong rounded-lg shadow-md transition-colors',
        hover && 'hover:border-border-glow',
        glow && 'shadow-glow',
        padding && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
);
GlassCard.displayName = 'GlassCard';

'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  hover?: boolean;
  padding?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hover = true, padding = true, glow, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-card-hover)' } : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'bg-[var(--bg-card)] rounded-[var(--radius-lg)] border border-[var(--border)]',
          'shadow-[var(--shadow-card)] transition-shadow duration-300',
          glow && 'ring-1 ring-[var(--accent-soft)]',
          padding && 'p-5',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

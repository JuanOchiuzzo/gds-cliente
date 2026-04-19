'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  glow?: 'cyan' | 'violet' | 'emerald' | 'none';
  hover?: boolean;
  padding?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = 'none', hover = true, padding = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { scale: 1.008, y: -1 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          // Base glass
          'relative bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)]',
          'border border-[var(--sf-border)] rounded-[var(--sf-radius)]',
          'shadow-[var(--sf-shadow-glass)]',
          'transition-all duration-200',
          // Hover
          hover && 'hover:bg-[var(--sf-surface-hover)] hover:border-[var(--sf-border-hover)] hover:shadow-[var(--sf-shadow-lg)]',
          // Padding
          padding && 'p-5 lg:p-6',
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

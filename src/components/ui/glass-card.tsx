'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface GlassCardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  glow?: boolean;
  hover?: boolean;
  padding?: boolean;
  elevation?: 1 | 2 | 3;
  children?: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow = false, hover = true, padding = true, elevation = 2, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { scale: 1.006, y: -1 } : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={cn(
          'relative overflow-hidden',
          // Glass surface
          'bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)]',
          // Double border technique — inner glow + outer definition
          'border border-[var(--sf-border)]',
          'rounded-[var(--sf-radius)]',
          // Shadow with depth
          elevation === 1 && 'shadow-[var(--sf-shadow-sm)]',
          elevation === 2 && 'shadow-[var(--sf-shadow-glass)]',
          elevation === 3 && 'shadow-[var(--sf-shadow-lg)]',
          // Hover
          hover && [
            'transition-all duration-300 ease-out',
            'hover:bg-[var(--sf-surface-hover)]',
            'hover:border-[var(--sf-border-hover)]',
            'hover:shadow-[var(--sf-shadow-lg)]',
          ],
          // Glow
          glow && 'shadow-[0_0_24px_rgba(var(--sf-accent-rgb),0.12)]',
          // Padding
          padding && 'p-5 lg:p-6',
          className
        )}
        {...props}
      >
        {/* Liquid Glass refraction highlight — top edge light */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.5) 30%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.5) 70%, transparent 90%)',
          }}
        />
        {/* Subtle inner gradient for depth */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%)',
          }}
        />
        {/* Content */}
        <div className="relative z-[1]">
          {children}
        </div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';

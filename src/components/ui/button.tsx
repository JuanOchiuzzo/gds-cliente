'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'neon';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const variants = {
      primary:
        'bg-[var(--sf-accent-light)] text-[var(--sf-accent)] border border-[var(--sf-accent)]/20 hover:bg-[var(--sf-accent-medium)]',
      secondary:
        'bg-[var(--sf-surface)] text-[var(--sf-text-secondary)] border border-[var(--sf-border)] hover:bg-[var(--sf-surface-hover)] hover:border-[var(--sf-border-hover)]',
      ghost: 'text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)]',
      danger:
        'bg-red-500/10 text-[var(--sf-red)] border border-red-500/20 hover:bg-red-500/20',
      neon: 'bg-gradient-to-r from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 text-white font-semibold hover:shadow-lg border-0',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs rounded-xl',
      md: 'px-4 py-2 text-sm rounded-2xl',
      lg: 'px-6 py-3 text-base rounded-2xl',
      icon: 'p-2.5 rounded-2xl',
    };

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

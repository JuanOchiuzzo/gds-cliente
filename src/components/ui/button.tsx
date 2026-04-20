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
        'bg-[var(--sf-accent-light)] text-[var(--sf-accent)] border border-[rgba(var(--sf-accent-rgb),0.15)] hover:bg-[var(--sf-accent-medium)] hover:shadow-[0_0_16px_rgba(var(--sf-accent-rgb),0.1)]',
      secondary:
        'bg-[var(--sf-surface)] text-[var(--sf-text-secondary)] border border-[var(--sf-border-outer)] hover:bg-[var(--sf-surface-hover)] hover:border-[var(--sf-border-hover)]',
      ghost: 'text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)]',
      danger:
        'bg-red-500/8 text-[var(--sf-red)] border border-red-500/15 hover:bg-red-500/15',
      neon: 'bg-[var(--sf-gradient-accent)] text-white font-semibold hover:shadow-[0_4px_20px_rgba(var(--sf-accent-rgb),0.3)] border-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400',
    };

    const sizes = {
      sm: 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5',
      md: 'px-4 py-2.5 text-sm rounded-2xl gap-2',
      lg: 'px-6 py-3 text-base rounded-2xl gap-2',
      icon: 'p-2.5 rounded-2xl',
    };

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.975 }}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
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

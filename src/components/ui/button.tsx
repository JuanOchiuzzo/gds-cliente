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
    const v = {
      primary: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-sm hover:shadow-md',
      secondary: 'bg-[var(--bg-card)] text-[var(--text-secondary)] border border-[var(--border-strong)] hover:bg-[var(--bg-hover)] shadow-xs',
      ghost: 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]',
      danger: 'bg-red-50 text-[var(--red)] border border-red-200 hover:bg-red-100',
      neon: 'bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-semibold shadow-md hover:shadow-[0_4px_20px_var(--accent-glow)]',
    };
    const s = {
      sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
      md: 'px-4 py-2 text-sm rounded-[var(--radius)] gap-2',
      lg: 'px-5 py-2.5 text-sm rounded-[var(--radius)] gap-2',
      icon: 'p-2 rounded-xl',
    };

    return (
      <motion.button
        ref={ref as React.Ref<HTMLButtonElement>}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        className={cn('inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed', v[variant], s[size], className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

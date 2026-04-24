'use client';

import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const button = cva(
  'relative inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap select-none ' +
    'transition-[transform,background,box-shadow,border-color,color] duration-200 ease-spring press ' +
    'disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none',
  {
    variants: {
      variant: {
        primary:
          'text-white bg-[linear-gradient(135deg,#9d8cff,#5a46e0_55%,#4638b8)] ' +
          'shadow-[0_10px_30px_rgba(129,110,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] ' +
          'hover:brightness-110',
        secondary:
          'text-fg bg-white/[0.06] border border-line-strong hover:bg-white/[0.1] hover:border-white/20',
        ghost:
          'text-fg-soft hover:text-fg hover:bg-white/[0.06]',
        outline:
          'text-fg border border-line-strong hover:bg-white/[0.04] hover:border-white/20',
        danger:
          'text-white bg-[linear-gradient(135deg,#ff8a9c,#ff4d66_55%,#d63148)] ' +
          'shadow-[0_10px_24px_rgba(255,77,102,0.35)] hover:brightness-110',
        glass:
          'text-fg bg-white/[0.08] backdrop-blur-xl border border-white/15 hover:bg-white/[0.14]',
      },
      size: {
        xs: 'h-7 px-2.5 text-xs rounded-[8px]',
        sm: 'h-9 px-3.5 text-sm rounded-[10px]',
        md: 'h-11 px-4 text-sm rounded-[12px]',
        lg: 'h-12 px-5 text-base rounded-[14px]',
        xl: 'h-14 px-6 text-base rounded-[16px]',
        icon: 'h-10 w-10 rounded-[12px]',
        'icon-sm': 'h-8 w-8 rounded-[10px]',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant, size, block, asChild, loading, disabled, children, ...props },
    ref,
  ) {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(button({ variant, size, block }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden
            className="h-4 w-4 rounded-full border-[1.8px] border-white/30 border-t-white animate-spin"
          />
        ) : null}
        {children}
      </Comp>
    );
  },
);

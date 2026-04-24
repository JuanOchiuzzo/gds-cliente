'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const card = cva('relative overflow-hidden transition-colors', {
  variants: {
    variant: {
      solid:
        'bg-ink-900 border border-line rounded-[18px]',
      glass:
        'glass rounded-[20px]',
      strong:
        'glass-strong rounded-[22px]',
      ghost:
        'bg-white/[0.03] border border-line rounded-[16px]',
      plain: 'rounded-[18px]',
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5',
      xl: 'p-6',
    },
    interactive: {
      true: 'press hover:bg-white/[0.035] hover:border-line-strong cursor-pointer',
    },
  },
  defaultVariants: {
    variant: 'solid',
    padding: 'md',
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof card> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, variant, padding, interactive, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(card({ variant, padding, interactive }), className)}
      {...props}
    />
  );
});

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-3 flex items-start justify-between gap-3', className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-base font-semibold tracking-tight text-fg', className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-fg-muted', className)} {...props} />;
}

'use client';

import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  formatFn?: (n: number) => string;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  formatFn,
  className,
}: AnimatedCounterProps) {
  if (formatFn) {
    return <span className={cn('tabular-nums', className)}>{prefix}{formatFn(value)}{suffix}</span>;
  }

  return (
    <NumberFlow
      value={value}
      prefix={prefix}
      suffix={suffix}
      locales="pt-BR"
      className={cn('tabular-nums', className)}
    />
  );
}

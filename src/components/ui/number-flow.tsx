'use client';

import NumberFlowPrimitive, { type Format } from '@number-flow/react';
import { cn } from '@/lib/utils';

interface NumberFlowProps {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: Format;
  className?: string;
  locales?: string;
}

export function NumberFlow({
  value,
  prefix,
  suffix,
  format,
  className,
  locales = 'pt-BR',
}: NumberFlowProps) {
  return (
    <NumberFlowPrimitive
      value={value}
      prefix={prefix}
      suffix={suffix}
      format={format}
      locales={locales}
      className={cn('tabular-nums', className)}
    />
  );
}

export function CurrencyFlow({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  return (
    <NumberFlow
      value={value}
      format={{
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }}
      className={className}
    />
  );
}

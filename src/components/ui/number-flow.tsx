'use client';

import NumberFlowLib from '@number-flow/react';

export function NumberFlow({
  value,
  prefix,
  suffix,
  format,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  format?: Intl.NumberFormatOptions;
  className?: string;
}) {
  return (
    <NumberFlowLib
      value={value}
      prefix={prefix}
      suffix={suffix}
      format={format as never}
      locales="pt-BR"
      className={className}
    />
  );
}

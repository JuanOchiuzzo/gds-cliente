'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuroraBorderProps {
  children: ReactNode;
  className?: string;
  active?: boolean;
  radius?: string;
}

export function AuroraBorder({ children, className, active, radius = 'var(--r-lg)' }: AuroraBorderProps) {
  return (
    <div
      className={cn('aurora-border relative', className)}
      data-active={active ? 'true' : undefined}
      style={{ borderRadius: radius }}
    >
      {children}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('mb-5 flex items-end justify-between gap-4', className)}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[26px] leading-tight tracking-[-0.02em] text-fg lg:text-[34px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-fg-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </motion.header>
  );
}

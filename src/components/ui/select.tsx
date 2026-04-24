'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, label, hint, error, id, children, ...props },
  ref,
) {
  const sId = id ?? props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={sId} className="mb-1.5 block text-xs font-medium text-fg-muted">
          {label}
        </label>
      )}
      <div
        className={cn(
          'group relative flex items-center rounded-[14px] border border-line bg-ink-800 px-3.5 pr-10',
          'transition-all focus-within:border-iris/60 focus-within:bg-ink-700 focus-within:shadow-[0_0_0_4px_rgba(129,110,255,0.18)]',
          error && 'border-bad/60',
        )}
      >
        <select
          ref={ref}
          id={sId}
          className={cn(
            'peer h-11 w-full appearance-none bg-transparent text-sm text-fg outline-none',
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-fg-muted" />
      </div>
      {(hint || error) && (
        <p className={cn('mt-1.5 text-[11px]', error ? 'text-bad' : 'text-fg-muted')}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

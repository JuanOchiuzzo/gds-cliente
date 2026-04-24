'use client';

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type InputBase = {
  icon?: ReactNode;
  trailing?: ReactNode;
  label?: string;
  hint?: string;
  error?: string;
};

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputBase {}

const wrapper =
  'group relative flex items-center gap-2 rounded-[14px] border border-line bg-ink-800 ' +
  'px-3.5 transition-all duration-200 focus-within:border-iris/60 focus-within:bg-ink-700 ' +
  'focus-within:shadow-[0_0_0_4px_rgba(129,110,255,0.18)]';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, icon, trailing, label, hint, error, id, ...props },
  ref,
) {
  const inputId = id ?? props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-xs font-medium text-fg-muted">
          {label}
        </label>
      )}
      <div className={cn(wrapper, error && 'border-bad/60 focus-within:border-bad/70 focus-within:shadow-[0_0_0_4px_rgba(255,99,122,0.18)]')}>
        {icon && (
          <span className="text-fg-muted group-focus-within:text-iris-hi transition-colors">{icon}</span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'peer w-full h-11 bg-transparent text-sm text-fg placeholder:text-fg-faint outline-none',
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
      {(hint || error) && (
        <p className={cn('mt-1.5 text-[11px]', error ? 'text-bad' : 'text-fg-muted')}>
          {error || hint}
        </p>
      )}
    </div>
  );
});

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    InputBase {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, label, hint, error, id, rows = 4, ...props }, ref) {
    const tId = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={tId} className="mb-1.5 block text-xs font-medium text-fg-muted">
            {label}
          </label>
        )}
        <div className={cn(wrapper, 'py-2.5 items-start', error && 'border-bad/60')}>
          <textarea
            ref={ref}
            id={tId}
            rows={rows}
            className={cn(
              'w-full bg-transparent text-sm text-fg placeholder:text-fg-faint outline-none resize-none leading-relaxed',
              className,
            )}
            {...props}
          />
        </div>
        {(hint || error) && (
          <p className={cn('mt-1.5 text-[11px]', error ? 'text-bad' : 'text-fg-muted')}>
            {error || hint}
          </p>
        )}
      </div>
    );
  },
);

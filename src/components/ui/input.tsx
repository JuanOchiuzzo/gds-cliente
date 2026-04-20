'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode;
  suffix?: ReactNode;
  error?: boolean | string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, suffix, error, label, type = 'text', ...rest }, ref) => {
    const errorText = typeof error === 'string' ? error : undefined;
    const hasError = Boolean(error);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-text-soft tracking-wide">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full h-10 bg-surface-1 rounded-md border px-3 py-2 text-sm text-text placeholder:text-text-faint',
              'focus:outline-none focus:border-solar focus:bg-surface-2',
              'transition-colors duration-150',
              hasError ? 'border-danger' : 'border-border-strong hover:border-border-glow',
              icon && 'pl-9',
              suffix && 'pr-9',
              className
            )}
            {...rest}
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {errorText && <p className="text-xs text-danger">{errorText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string;
  label?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...rest }, ref) => {
    const errorText = typeof error === 'string' ? error : undefined;
    const hasError = Boolean(error);
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-medium text-text-soft tracking-wide">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-surface-1 rounded-md border px-3 py-2 text-sm text-text placeholder:text-text-faint',
            'focus:outline-none focus:border-solar focus:bg-surface-2',
            'transition-colors duration-150 resize-none',
            hasError ? 'border-danger' : 'border-border-strong hover:border-border-glow',
            className
          )}
          {...rest}
        />
        {errorText && <p className="text-xs text-danger">{errorText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

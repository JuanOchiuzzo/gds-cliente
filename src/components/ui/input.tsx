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
          <label className="text-xs font-medium text-text-soft">{label}</label>
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
              'w-full h-11 bg-white/[0.055] rounded-lg border px-3 py-2 text-sm text-text placeholder:text-text-faint',
              'focus:outline-none focus:border-solar focus:bg-white/[0.08]',
              'transition-colors duration-150',
              hasError ? 'border-danger' : 'border-white/[0.12] hover:border-white/25',
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
          <label className="text-xs font-medium text-text-soft">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-white/[0.055] rounded-lg border px-3 py-2 text-sm text-text placeholder:text-text-faint',
            'focus:outline-none focus:border-solar focus:bg-white/[0.08]',
            'transition-colors duration-150 resize-none',
            hasError ? 'border-danger' : 'border-white/[0.12] hover:border-white/25',
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

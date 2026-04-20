'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  label?: string;
}

export function Select({ value, onChange, options, placeholder = 'Selecionar...', className, label }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">{label}</label>}
      <div ref={ref} className={cn('relative', className)}>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 text-sm text-left',
            'bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl',
            'transition-all outline-none',
            open && 'ring-2 ring-blue-500/20 dark:ring-cyan-500/20 border-blue-500/30 dark:border-cyan-500/30',
            selected ? 'text-[var(--sf-text-primary)]' : 'text-[var(--sf-text-muted)]'
          )}
        >
          <span className="truncate">{selected?.label || placeholder}</span>
          <ChevronDown className={cn('w-4 h-4 text-[var(--sf-text-muted)] transition-transform', open && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1.5 bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded-2xl shadow-[var(--sf-shadow-lg)] overflow-hidden max-h-60 overflow-y-auto"
            >
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => { onChange(option.value); setOpen(false); }}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors',
                      isSelected
                        ? 'bg-[var(--sf-accent-light)] text-[var(--sf-accent)] font-medium'
                        : 'text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)] active:bg-[var(--sf-accent-medium)]'
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="w-4 h-4 flex-shrink-0" />}
                  </button>
                );
              })}
              {options.length === 0 && (
                <div className="px-4 py-3 text-sm text-[var(--sf-text-muted)] text-center">Nenhuma opção</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

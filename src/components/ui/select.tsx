'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Selecionar…',
  label,
  className,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="text-xs font-semibold text-text-soft">{label}</label>}
      <div ref={ref} className={cn('relative', className)}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(!open)}
          className={cn(
            'flex h-12 w-full items-center justify-between rounded-lg border bg-white/[0.065] px-3 text-left text-sm shadow-inset backdrop-blur-md transition-all',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            open
              ? 'border-solar/60 bg-white/[0.1]'
              : 'border-white/[0.12] hover:border-white/25',
            selected ? 'text-text' : 'text-text-faint'
          )}
        >
          <span className="truncate">{selected?.label || placeholder}</span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-text-faint transition-transform',
              open && 'rotate-180'
            )}
          />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={spring}
              className="native-panel absolute z-50 mt-1 max-h-60 w-full overflow-hidden overflow-y-auto rounded-lg p-1 shadow-lg"
            >
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors',
                    o.value === value
                      ? 'bg-solar/15 text-white'
                      : 'text-text-soft hover:bg-white/[0.06] hover:text-text'
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {o.value === value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
              {options.length === 0 && (
                <div className="px-3 py-4 text-sm text-text-faint text-center">
                  Nenhuma opção
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

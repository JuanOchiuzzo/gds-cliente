'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption { value: string; label: string; }
interface SelectProps { value: string; onChange: (v: string) => void; options: SelectOption[]; placeholder?: string; label?: string; className?: string; }

export function Select({ value, onChange, options, placeholder = 'Selecionar...', label, className }: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  return (
    <div className="space-y-1">
      {label && <label className="text-xs font-medium text-[var(--text-secondary)]">{label}</label>}
      <div ref={ref} className={cn('relative', className)}>
        <button type="button" onClick={() => setOpen(!open)}
          className={cn('w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-[var(--radius)] transition-all',
            open && 'ring-2 ring-[var(--accent-soft)] border-[var(--accent)]',
            selected ? 'text-[var(--text)]' : 'text-[var(--text-faint)]')}>
          <span className="truncate">{selected?.label || placeholder}</span>
          <ChevronDown className={cn('w-4 h-4 text-[var(--text-muted)] transition-transform', open && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
              className="absolute z-50 w-full mt-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius)] shadow-[var(--shadow-lg)] overflow-hidden max-h-56 overflow-y-auto">
              {options.map((o) => (
                <button key={o.value} type="button" onClick={() => { onChange(o.value); setOpen(false); }}
                  className={cn('w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors',
                    o.value === value ? 'bg-[var(--accent-soft)] text-[var(--accent)] font-medium' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]')}>
                  <span className="truncate">{o.label}</span>
                  {o.value === value && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
              {options.length === 0 && <div className="px-3.5 py-3 text-sm text-[var(--text-muted)] text-center">Nenhuma opção</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

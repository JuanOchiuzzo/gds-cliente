'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps { value: number; max?: number; className?: string; showLabel?: boolean; }

export function ProgressBar({ value, max = 100, className, showLabel }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  const color = pct >= 100 ? 'from-emerald-400 to-emerald-500' : pct >= 70 ? 'from-indigo-400 to-violet-500' : pct >= 40 ? 'from-amber-400 to-amber-500' : 'from-red-400 to-red-500';
  return (
    <div className={cn('w-full', className)}>
      <div className="h-1.5 bg-[var(--bg-inset)] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn('h-full rounded-full bg-gradient-to-r', color)} />
      </div>
      {showLabel && <span className="text-[10px] text-[var(--text-muted)] mt-1 block">{Math.round(pct)}%</span>}
    </div>
  );
}

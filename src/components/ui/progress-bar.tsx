'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, max = 100, className, showLabel }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const color = percent >= 100
    ? 'from-emerald-400 to-emerald-500'
    : percent >= 70
    ? 'from-indigo-400 to-violet-500'
    : percent >= 40
    ? 'from-amber-400 to-amber-500'
    : 'from-red-400 to-red-500';

  return (
    <div className={cn('w-full', className)}>
      <div className="h-[5px] bg-black/[0.04] dark:bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          className={cn('h-full rounded-full bg-gradient-to-r', color)}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] text-[var(--sf-text-muted)] mt-1 block">{Math.round(percent)}%</span>
      )}
    </div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'red';
  className?: string;
  showLabel?: boolean;
}

const colorMap = {
  cyan: 'from-blue-500 to-blue-400 dark:from-cyan-500 dark:to-cyan-400',
  violet: 'from-violet-500 to-violet-400',
  emerald: 'from-emerald-500 to-emerald-400',
  amber: 'from-amber-500 to-amber-400',
  red: 'from-red-500 to-red-400',
};

export function ProgressBar({ value, max = 100, color = 'cyan', className, showLabel }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);
  const dynamicColor = percent >= 100 ? 'emerald' : percent >= 70 ? color : percent >= 40 ? 'amber' : 'red';

  return (
    <div className={cn('w-full', className)}>
      <div className="h-2 bg-black/[0.04] dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={cn('h-full rounded-full bg-gradient-to-r', colorMap[dynamicColor])}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-[var(--sf-text-tertiary)] mt-1 block">{Math.round(percent)}%</span>
      )}
    </div>
  );
}

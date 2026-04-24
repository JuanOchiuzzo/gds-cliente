'use client';
import { motion } from 'framer-motion';
import { cn, normalizeNumber } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'solar' | 'aurora' | 'success' | 'danger';
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel,
  variant,
}: ProgressBarProps) {
  const safeValue = normalizeNumber(value);
  const safeMax = Math.max(normalizeNumber(max, 100), 1);
  const pct = Math.max(0, Math.min((safeValue / safeMax) * 100, 100));
  const autoVariant: ProgressBarProps['variant'] =
    variant ??
    (pct >= 100 ? 'success' : pct >= 70 ? 'solar' : pct >= 40 ? 'aurora' : 'danger');

  const gradients = {
    solar: 'from-white to-solar',
    aurora: 'from-white to-aurora-2',
    success: 'from-success to-success',
    danger: 'from-danger to-danger',
  };

  return (
    <div className={cn('w-full', className)}>
      <div className="relative h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'absolute inset-y-0 left-0 rounded-full bg-gradient-to-r',
            gradients[autoVariant]
          )}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full opacity-40',
            'bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer'
          )}
          style={{ width: `${pct}%`, backgroundSize: '200% 100%' }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] text-text-faint mt-1 block font-mono">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

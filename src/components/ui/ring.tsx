'use client';

import { motion } from 'framer-motion';
import { cn, normalizeNumber } from '@/lib/utils';

interface RingProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
  variant?: 'solar' | 'aurora' | 'success' | 'danger';
}

export function Ring({
  value,
  size = 44,
  strokeWidth = 4,
  className,
  showLabel = true,
  label,
  variant = 'solar',
}: RingProps) {
  const safeValue = Math.min(Math.max(normalizeNumber(value), 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safeValue / 100) * circumference;

  const gradientId = `ring-grad-${variant}`;
  const colors = {
    solar: ['#f0d994', '#5bf1c6'],
    aurora: ['#5bf1c6', '#8fb7ff'],
    success: ['#5bf1c6', '#5bf1c6'],
    danger: ['#ff4d61', '#ff4d61'],
  }[variant];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-mono font-medium text-text tabular-nums">
            {label ?? Math.round(safeValue)}
          </span>
        </div>
      )}
    </div>
  );
}

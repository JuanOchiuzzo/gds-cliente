'use client';

import { motion } from 'framer-motion';
import { cn, normalizeNumber } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  variant?: 'solar' | 'aurora' | 'success' | 'danger';
  showFill?: boolean;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  className,
  variant = 'solar',
  showFill = true,
}: SparklineProps) {
  const safeData = data
    .map((value) => normalizeNumber(value, Number.NaN))
    .filter((value) => Number.isFinite(value));

  if (safeData.length < 2) return null;

  const min = Math.min(...safeData);
  const max = Math.max(...safeData);
  const range = max - min || 1;
  const stepX = width / (safeData.length - 1);

  const points = safeData.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / range) * height;
    return [x, y];
  });

  const pathD = points.reduce(
    (acc, [x, y], i) => (i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`),
    ''
  );
  const fillD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const id = `spark-${variant}`;

  const colors = {
    solar: ['#f0d994', '#5bf1c6'],
    aurora: ['#5bf1c6', '#8fb7ff'],
    success: ['#5bf1c6', '#5bf1c6'],
    danger: ['#ff4d61', '#ff4d61'],
  }[variant];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn('overflow-visible', className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0%" x2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} stopOpacity="0.25" />
          <stop offset="100%" stopColor={colors[0]} stopOpacity="0" />
        </linearGradient>
      </defs>
      {showFill && <path d={fillD} fill={`url(#${id}-fill)`} />}
      <motion.path
        d={pathD}
        fill="none"
        stroke={`url(#${id}-stroke)`}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

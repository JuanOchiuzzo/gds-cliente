'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export function Sparkline({
  data,
  width = 160,
  height = 40,
  gradient = 'iris',
  className,
}: {
  data: number[];
  width?: number;
  height?: number;
  gradient?: 'iris' | 'cyan' | 'ok' | 'hot';
  className?: string;
}) {
  const { path, area, maxY } = useMemo(() => {
    if (!data.length) return { path: '', area: '', maxY: 0 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const step = width / Math.max(1, data.length - 1);
    const pts = data.map((v, i) => {
      const x = i * step;
      const y = height - 6 - ((v - min) / range) * (height - 12);
      return [x, y] as const;
    });
    const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
    const a = `${d} L ${width} ${height} L 0 ${height} Z`;
    return { path: d, area: a, maxY: pts[pts.length - 1][1] };
  }, [data, width, height]);

  const id = `spark-${gradient}`;
  const colors: Record<string, [string, string]> = {
    iris: ['#9d8cff', '#60deff'],
    cyan: ['#60deff', '#2a7fff'],
    ok: ['#86efac', '#139e6b'],
    hot: ['#ffb29a', '#ff3e78'],
  };
  const [c1, c2] = colors[gradient];

  return (
    <svg width={width} height={height} className={cn('overflow-visible', className)}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c1} stopOpacity={0.36} />
          <stop offset="100%" stopColor={c1} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id}-area)`} />
      <path d={path} fill="none" stroke={`url(#${id})`} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {data.length > 0 && (
        <circle cx={width} cy={maxY} r={3} fill="#fff" />
      )}
    </svg>
  );
}

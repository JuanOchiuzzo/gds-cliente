'use client';

import { cn } from '@/lib/utils';

export function Ring({
  value,
  size = 48,
  stroke = 4,
  gradient = 'iris',
  label,
  className,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  gradient?: 'iris' | 'cyan' | 'ok' | 'hot';
  label?: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = Math.PI * 2 * r;
  const dash = (v / 100) * c;

  const gradId = `ring-${gradient}`;
  const colors: Record<string, [string, string]> = {
    iris: ['#9d8cff', '#60deff'],
    cyan: ['#60deff', '#2a7fff'],
    ok: ['#86efac', '#139e6b'],
    hot: ['#ffb29a', '#ff3e78'],
  };
  const [c1, c2] = colors[gradient];

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: 'stroke-dasharray 600ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-fg">
        {label ?? `${Math.round(v)}%`}
      </span>
    </div>
  );
}

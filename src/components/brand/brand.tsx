'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const BOX: Record<Size, string> = {
  xs: 'h-7 w-7 rounded-[8px]',
  sm: 'h-9 w-9 rounded-[10px]',
  md: 'h-11 w-11 rounded-[12px]',
  lg: 'h-14 w-14 rounded-[16px]',
  xl: 'h-20 w-20 rounded-[22px]',
};

const TITLE: Record<Size, string> = {
  xs: 'text-sm',
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-xl',
  xl: 'text-3xl',
};

/**
 * StandForge monogram — "SF" interlocked, forged edge.
 * Pure SVG, scales infinitely.
 */
export function Monogram({
  size = 'md',
  className,
}: {
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden',
        BOX[size],
        className,
      )}
    >
      {/* gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 0% 0%, #9d8cff 0%, #5a46e0 48%, #1d1546 100%)',
        }}
      />
      {/* glass highlight */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'linear-gradient(155deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.04) 38%, rgba(0,0,0,0.2) 100%)',
        }}
      />
      {/* cyan spark */}
      <div
        className="pointer-events-none absolute -right-2 -bottom-2 h-1/2 w-1/2 rounded-full opacity-70 blur-[10px]"
        style={{ background: 'radial-gradient(#60deff, transparent 65%)' }}
      />
      {/* monogram */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative h-full w-full"
      >
        <defs>
          <linearGradient id="sf-mono-stroke" x1="0" y1="0" x2="64" y2="64">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c8f0ff" />
          </linearGradient>
        </defs>
        {/* S curve */}
        <path
          d="M44 18c-3.6-3-8-4.3-12.8-4.1-6.6.3-11.4 3.8-11.4 9 0 4.3 3 6.6 10 8.2l3.6.8c5.5 1.3 7 2.2 7 4.1 0 2.2-2.6 3.7-6.9 3.7-4 0-7.6-1.2-11-3.8"
          stroke="url(#sf-mono-stroke)"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* F arm */}
        <path
          d="M26 28h22M26 40V20h22"
          stroke="url(#sf-mono-stroke)"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.18"
        />
        {/* forge spark dot */}
        <circle cx="51" cy="50" r="2.4" fill="#60deff" />
      </svg>
    </div>
  );
}

type BrandProps = {
  size?: Size;
  showWordmark?: boolean;
  href?: string | null;
  tone?: 'light' | 'muted';
  className?: string;
};

export function Brand({
  size = 'md',
  showWordmark = true,
  href = '/dashboard',
  tone = 'light',
  className,
}: BrandProps) {
  const content = (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <Monogram size={size} />
      {showWordmark && (
        <div className="min-w-0 leading-none">
          <p
            className={cn(
              'font-semibold tracking-tight',
              TITLE[size],
              tone === 'light' ? 'text-fg' : 'text-fg-soft',
            )}
          >
            Stand<span className="text-iris">Forge</span>
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-fg-faint">
            Stand CRM · 2026
          </p>
        </div>
      )}
    </div>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex shrink-0">
      {content}
    </Link>
  );
}

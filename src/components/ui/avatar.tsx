'use client';

import { cn, getInitials } from '@/lib/utils';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<Size, string> = {
  xs: 'h-6 w-6 text-[10px] rounded-[8px]',
  sm: 'h-8 w-8 text-xs rounded-[10px]',
  md: 'h-10 w-10 text-sm rounded-[12px]',
  lg: 'h-12 w-12 text-base rounded-[14px]',
  xl: 'h-16 w-16 text-lg rounded-[18px]',
};

const HUES = [
  'from-[#9d8cff] to-[#5a46e0]',
  'from-[#60deff] to-[#2a7fff]',
  'from-[#ff7a59] to-[#ff3e78]',
  'from-[#4ade80] to-[#139e6b]',
  'from-[#fbbf24] to-[#d97706]',
  'from-[#ff8bd0] to-[#a533a1]',
];

function hash(s: string) {
  let n = 0;
  for (let i = 0; i < s.length; i++) n = (n * 31 + s.charCodeAt(i)) >>> 0;
  return n;
}

export function Avatar({
  name,
  src,
  size = 'md',
  className,
  dot,
}: {
  name?: string | null;
  src?: string | null;
  size?: Size;
  className?: string;
  dot?: 'ok' | 'warn' | 'bad' | null;
}) {
  const initials = getInitials(name || '?');
  const hue = HUES[hash(name || 'x') % HUES.length];

  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center overflow-hidden border border-white/10 font-semibold text-white',
          SIZE[size],
          !src && 'bg-gradient-to-br',
          !src && hue,
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={name || ''} className="h-full w-full object-cover" />
        ) : (
          <span className="tracking-tight">{initials}</span>
        )}
      </div>
      {dot && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink-900',
            dot === 'ok' && 'bg-ok',
            dot === 'warn' && 'bg-warn',
            dot === 'bad' && 'bg-bad',
          )}
        />
      )}
    </div>
  );
}

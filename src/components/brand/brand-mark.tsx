'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

type BrandMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
};

const sizes = {
  sm: { box: 'h-9 w-9', image: 36, title: 'text-sm', caption: 'text-[9px]' },
  md: { box: 'h-11 w-11', image: 44, title: 'text-base', caption: 'text-[10px]' },
  lg: { box: 'h-14 w-14', image: 56, title: 'text-xl', caption: 'text-[11px]' },
};

export function BrandMark({ size = 'md', showWordmark = true, className }: BrandMarkProps) {
  const config = sizes[size];

  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <div
        className={cn(
          'relative shrink-0 overflow-hidden rounded-lg border border-white/[0.14] bg-white/[0.06] shadow-glow',
          config.box
        )}
      >
        <Image
          src="/brand/gds-prism-icon-512.png"
          alt="GDS"
          width={config.image}
          height={config.image}
          priority={size !== 'sm'}
          className="h-full w-full object-cover"
        />
      </div>
      {showWordmark && (
        <div className="min-w-0">
          <p className={cn('font-semibold leading-none text-white', config.title)}>GDS</p>
          <p className={cn('mt-1 font-semibold uppercase text-text-faint', config.caption)}>
            Command CRM
          </p>
        </div>
      )}
    </div>
  );
}

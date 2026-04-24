'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { cva, cn, type VariantProps } from '@/lib/cva';
import { getInitials } from '@/lib/utils';

const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-lg font-semibold select-none shadow-inset',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-xs',
        lg: 'w-12 h-12 text-sm',
        xl: 'w-16 h-16 text-base',
        '2xl': 'w-20 h-20 text-lg',
      },
      ring: {
        none: '',
        solar: 'ring-2 ring-solar ring-offset-2 ring-offset-canvas',
        aurora: 'ring-2 ring-aurora-1 ring-offset-2 ring-offset-canvas',
        success: 'ring-2 ring-success ring-offset-2 ring-offset-canvas',
        subtle: 'ring-1 ring-white/20',
      },
    },
    defaultVariants: { size: 'md', ring: 'none' },
  }
);

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'size'>,
    VariantProps<typeof avatarVariants> {
  src?: string | null;
  name?: string;
  status?: 'online' | 'offline' | 'busy';
}

const statusColors = {
  online: 'bg-success',
  offline: 'bg-text-faint',
  busy: 'bg-warning',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ size, ring, src, name = '', status, className, ...rest }, ref) => {
    const initials = getInitials(name);
    const bgGradient = 'bg-gradient-to-br from-aurora-1 via-solar to-surface-2 text-[#06110f]';

    return (
      <div className="relative inline-block flex-shrink-0" ref={ref}>
        <div className={cn(avatarVariants({ size, ring }), !src && bgGradient, className)} {...rest}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full ring-2 ring-canvas',
              statusColors[status],
              size === 'xs' || size === 'sm'
                ? 'w-2 h-2'
                : size === 'xl' || size === '2xl'
                ? 'w-3.5 h-3.5'
                : 'w-2.5 h-2.5'
            )}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';

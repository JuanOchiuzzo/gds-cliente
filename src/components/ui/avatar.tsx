import { cn, getInitials } from '@/lib/utils';

interface AvatarProps { name: string; src?: string | null; size?: 'sm' | 'md' | 'lg'; className?: string; }

const sizeMap = { sm: 'w-8 h-8 text-[10px]', md: 'w-10 h-10 text-xs', lg: 'w-14 h-14 text-base' };

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {src ? (
        <img src={src} alt={name} className={cn('rounded-full object-cover ring-1 ring-[var(--border)]', sizeMap[size])} />
      ) : (
        <div className={cn('rounded-full flex items-center justify-center font-bold bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600', sizeMap[size])}>
          {getInitials(name)}
        </div>
      )}
    </div>
  );
}

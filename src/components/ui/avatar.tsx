import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'em_atendimento';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-xs',
  lg: 'w-14 h-14 text-base',
};

const statusColors = {
  online: 'bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.5)]',
  offline: 'bg-zinc-300 dark:bg-zinc-600',
  em_atendimento: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]',
};

export function Avatar({ name, src, size = 'md', status, className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-2xl object-cover border border-[var(--sf-border-outer)]', sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-2xl flex items-center justify-center font-bold tracking-tight',
            'bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600',
            'dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-indigo-300',
            'border border-[var(--sf-border-outer)]',
            sizeMap[size]
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[var(--sf-bg)]',
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'offline' | 'em_atendimento';
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

const statusColors = {
  online: 'bg-emerald-500',
  offline: 'bg-zinc-400 dark:bg-zinc-500',
  em_atendimento: 'bg-amber-500',
};

export function Avatar({ name, src, size = 'md', status, className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover border border-[var(--sf-border)]', sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full flex items-center justify-center font-semibold',
            'bg-gradient-to-br from-blue-100 to-violet-100 text-blue-700 border border-blue-200/50',
            'dark:from-cyan-500/30 dark:to-violet-500/30 dark:text-cyan-200 dark:border-white/10',
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

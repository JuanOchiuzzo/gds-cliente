import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'red' | 'zinc';
  className?: string;
}

const variantStyles = {
  cyan: 'bg-sky-50 text-sky-600 border-sky-200/60 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/20',
  violet: 'bg-violet-50 text-violet-600 border-violet-200/60 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/20',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20',
  amber: 'bg-amber-50 text-amber-600 border-amber-200/60 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
  red: 'bg-red-50 text-red-600 border-red-200/60 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/20',
  zinc: 'bg-zinc-50 text-zinc-500 border-zinc-200/60 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20',
};

export function Badge({ children, variant = 'cyan', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-lg border tracking-wide',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

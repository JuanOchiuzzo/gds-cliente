import { cn } from '@/lib/utils';

interface BadgeProps { children: React.ReactNode; variant?: 'cyan' | 'violet' | 'emerald' | 'amber' | 'red' | 'zinc'; className?: string; }

const styles = {
  cyan: 'bg-sky-50 text-sky-700 ring-sky-600/10',
  violet: 'bg-violet-50 text-violet-700 ring-violet-600/10',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  red: 'bg-red-50 text-red-700 ring-red-600/10',
  zinc: 'bg-zinc-100 text-zinc-600 ring-zinc-500/10',
};

export function Badge({ children, variant = 'cyan', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md ring-1 ring-inset', styles[variant], className)}>
      {children}
    </span>
  );
}

import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-2xl bg-gradient-to-r from-zinc-800/50 via-zinc-700/50 to-zinc-800/50 bg-[length:200%_100%]',
        className
      )}
    />
  );
}

export function KPISkeleton() {
  return (
    <div className="bg-zinc-950/60 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

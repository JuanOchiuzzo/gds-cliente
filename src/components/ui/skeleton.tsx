import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-shimmer rounded-md bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1',
        className
      )}
    />
  );
}

export function KPISkeleton() {
  return (
    <div className="bg-surface-0 border border-border rounded-lg p-5 space-y-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-2.5 w-16" />
    </div>
  );
}

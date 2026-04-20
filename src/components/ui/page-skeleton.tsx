'use client';

export function PageSkeleton({ lines = 5 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-7 w-40 bg-[var(--sf-surface)] rounded-2xl" />
      <div className="h-4 w-56 bg-[var(--sf-surface)] rounded-xl" />
      <div className="mt-4 space-y-2.5">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="h-16 bg-[var(--sf-surface)] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

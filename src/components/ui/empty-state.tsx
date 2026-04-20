import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="w-14 h-14 rounded-full bg-surface-1 border border-border-strong flex items-center justify-center text-text-faint mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-text mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-soft max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}

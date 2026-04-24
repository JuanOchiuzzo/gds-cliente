'use client';

import { Drawer as VaulDrawer } from 'vaul';
import { cn } from '@/lib/utils';

export const Sheet = VaulDrawer.Root;
export const SheetTrigger = VaulDrawer.Trigger;
export const SheetClose = VaulDrawer.Close;

export function SheetContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <VaulDrawer.Portal>
      <VaulDrawer.Overlay className="fixed inset-0 z-50 bg-ink-950/75 backdrop-blur-md" />
      <VaulDrawer.Content
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mt-24 flex flex-col rounded-t-[28px] bg-ink-900 border-t border-line-strong',
          'focus:outline-none',
          className,
        )}
      >
        <div className="mx-auto mt-2.5 mb-1 h-1.5 w-10 flex-none rounded-full bg-white/15" />
        {children}
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
  );
}

export function SheetHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('px-5 pt-2 pb-3', className)}>
      <VaulDrawer.Title className="text-lg font-semibold tracking-tight text-fg">
        {title}
      </VaulDrawer.Title>
      {description && (
        <VaulDrawer.Description className="mt-1 text-sm text-fg-muted">
          {description}
        </VaulDrawer.Description>
      )}
    </div>
  );
}

export function SheetBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-5 pb-[max(env(safe-area-inset-bottom),20px)] overflow-y-auto max-h-[75dvh]', className)}>
      {children}
    </div>
  );
}

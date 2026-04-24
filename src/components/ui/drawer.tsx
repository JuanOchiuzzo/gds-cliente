'use client';

import { Drawer as VaulDrawer } from 'vaul';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const Drawer = VaulDrawer.Root;
export const DrawerTrigger = VaulDrawer.Trigger;
export const DrawerClose = VaulDrawer.Close;
export const DrawerPortal = VaulDrawer.Portal;

export function DrawerContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <DrawerPortal>
      <VaulDrawer.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md" />
      <VaulDrawer.Content
        className={cn(
          'fixed bottom-0 left-0 right-0 z-50 max-h-[92vh] rounded-t-lg',
          'native-panel border-x-0 border-b-0 shadow-xl',
          'flex flex-col outline-none',
          className
        )}
      >
        <div className="mx-auto mt-2.5 mb-1.5 h-1 w-10 rounded-full bg-white/20" />
        {children}
      </VaulDrawer.Content>
    </DrawerPortal>
  );
}

export function DrawerHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('px-5 pt-4 pb-2', className)}>{children}</div>;
}

export function DrawerTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <VaulDrawer.Title className={cn('text-base font-semibold text-text', className)}>
      {children}
    </VaulDrawer.Title>
  );
}

export function DrawerDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <VaulDrawer.Description className={cn('text-sm text-text-soft mt-1', className)}>
      {children}
    </VaulDrawer.Description>
  );
}

export function DrawerBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex-1 overflow-y-auto px-5 pt-2 pb-6', className)}>{children}</div>
  );
}

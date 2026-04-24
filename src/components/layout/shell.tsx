'use client';

import type { ReactNode } from 'react';
import { BottomDock } from './bottom-dock';
import { TopBar, DesktopTopBar } from './top-bar';
import { Sidebar } from './sidebar';
import { PageTransition } from './page-transition';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] text-fg">
      <Sidebar />
      <div className="flex min-h-[100dvh] flex-col lg:pl-[260px]">
        <TopBar />
        <DesktopTopBar />
        <main className="mx-auto w-full max-w-[640px] flex-1 px-4 pt-4 pb-safe-dock lg:max-w-[1280px] lg:px-8 lg:pt-8 lg:pb-10">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomDock />
    </div>
  );
}

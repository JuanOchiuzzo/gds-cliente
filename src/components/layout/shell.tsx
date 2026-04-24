'use client';

import type { ReactNode } from 'react';
import { BottomDock } from './bottom-dock';
import { TopBar, DesktopTopBar } from './top-bar';
import { Sidebar } from './sidebar';
import { PageTransition } from './page-transition';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative text-fg">
      <Sidebar />
      <div className="lg:pl-[260px]">
        <TopBar />
        <DesktopTopBar />
        <main className="mx-auto w-full max-w-[640px] px-4 pt-4 pb-safe-dock lg:max-w-[1280px] lg:px-8 lg:pt-8 lg:pb-14">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
      <BottomDock />
    </div>
  );
}

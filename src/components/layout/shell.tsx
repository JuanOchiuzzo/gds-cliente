'use client';

import type { ReactNode } from 'react';
import { OrbitRail } from './orbit-rail';
import { ContextPanel } from './context-panel';
import { CommandBar } from './command-bar';
import { MobileDock } from './mobile-dock';
import { PageTransition } from './page-transition';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[100dvh] bg-canvas text-text">
      <OrbitRail />
      <ContextPanel />

      <div className="lg:pl-[72px] xl:pl-[332px] flex flex-col min-h-[100dvh]">
        <CommandBar />
        <main className="flex-1 px-4 lg:px-6 pt-4 pb-28 lg:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <MobileDock />
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { OrbitRail } from './orbit-rail';
import { ContextPanel } from './context-panel';
import { CommandBar } from './command-bar';
import { MobileDock } from './mobile-dock';
import { PageTransition } from './page-transition';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-app-frame relative min-h-[100dvh] text-text">
      <OrbitRail />
      <ContextPanel />

      <div className="flex min-h-[100dvh] flex-col lg:pl-[72px] xl:pl-[332px]">
        <CommandBar />
        <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-28 pt-4 sm:px-5 lg:max-w-[1400px] lg:px-6 lg:pb-8">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <MobileDock />
    </div>
  );
}

'use client';

import type { ReactNode } from 'react';
import { OrbitRail } from './orbit-rail';
import { CommandBar } from './command-bar';
import { MobileDock } from './mobile-dock';
import { PageTransition } from './page-transition';

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-app-frame relative min-h-[100dvh] overflow-x-hidden text-text">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,rgba(6,8,10,0.1)_0%,#06080a_72%)] lg:bg-[linear-gradient(90deg,#06080a_0%,rgba(6,8,10,0.86)_45%,#06080a_100%)]" />
      <OrbitRail />

      <div className="relative z-10 flex min-h-[100dvh] flex-col lg:pl-[292px]">
        <CommandBar />
        <main className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-28 pt-4 sm:px-5 lg:max-w-[1240px] lg:px-8 lg:pb-10 lg:pt-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>

      <MobileDock />
    </div>
  );
}

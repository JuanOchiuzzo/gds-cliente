'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';
import { MOBILE_PRIMARY, NAV_ITEMS } from './nav-config';

export function MobileDock() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {sheetOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={spring}
              className="absolute bottom-0 left-0 right-0 rounded-t-lg border-t border-white/[0.12] bg-surface-0 p-4 pb-[max(22px,env(safe-area-inset-bottom))] shadow-xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase text-text-faint">GDS</p>
                  <h2 className="text-xl font-semibold text-text">Menu</h2>
                </div>
                <button
                  onClick={() => setSheetOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.055] text-text-soft"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {NAV_ITEMS.map((item) => {
                  const active =
                    item.href === '/dashboard'
                      ? pathname === '/dashboard'
                      : pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSheetOpen(false)}>
                      <motion.div
                        whileTap={{ scale: 0.94 }}
                        className={cn(
                          'flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-lg border p-2 text-center transition-colors',
                          active
                            ? 'border-solar/50 bg-solar/15 text-white'
                            : 'border-white/[0.08] bg-white/[0.035] text-text-soft'
                        )}
                      >
                        <item.icon className={cn('h-5 w-5', active && 'text-solar')} />
                        <span className="max-w-full truncate text-[10px] font-semibold">
                          {item.shortLabel || item.label}
                        </span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <nav
        className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-24px)] max-w-[520px] -translate-x-1/2 lg:hidden"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid h-[66px] grid-cols-6 gap-1 rounded-lg border border-white/[0.12] bg-[rgba(11,12,16,0.92)] p-1.5 shadow-xl backdrop-blur-xl">
          {MOBILE_PRIMARY.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            const isAI = item.href === '/dashboard/ai';

            return (
              <Link key={item.href} href={item.href} className="min-w-0">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    'relative flex h-full min-w-0 flex-col items-center justify-center gap-1 rounded-md transition-colors',
                    active
                      ? 'bg-white text-canvas'
                      : isAI
                      ? 'bg-solar text-white shadow-glow'
                      : 'text-text-faint hover:text-text'
                  )}
                >
                  <item.icon className="h-[19px] w-[19px]" />
                  <span className="max-w-full truncate px-0.5 text-[9px] font-semibold leading-none">
                    {item.shortLabel || item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
          <button
            onClick={() => setSheetOpen(true)}
            aria-label="Abrir menu"
            className="min-w-0"
          >
            <motion.div
              whileTap={{ scale: 0.92 }}
              className="flex h-full min-w-0 flex-col items-center justify-center gap-1 rounded-md text-text-faint transition-colors hover:text-text"
            >
              <LayoutGrid className="h-[20px] w-[20px]" />
              <span className="text-[9px] font-semibold leading-none">Menu</span>
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
}

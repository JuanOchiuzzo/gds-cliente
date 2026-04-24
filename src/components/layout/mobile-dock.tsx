'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid3X3, X } from 'lucide-react';
import { BrandMark } from '@/components/brand/brand-mark';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';
import { NAV_ITEMS } from './nav-config';

const PRIMARY_HREFS = ['/dashboard', '/dashboard/wallet', '/dashboard/ai', '/dashboard/appointments'];

export function MobileDock() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const primary = PRIMARY_HREFS.map((href) => NAV_ITEMS.find((item) => item.href === href)!);

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
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={spring}
              className="native-panel absolute bottom-0 left-0 right-0 rounded-t-lg border-x-0 border-b-0 p-4 pb-[max(22px,env(safe-area-inset-bottom))]"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />
              <div className="mb-5 flex items-center justify-between">
                <BrandMark size="sm" />
                <button
                  onClick={() => setSheetOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.06] text-text-soft"
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
                          'flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-lg border p-2 text-center transition-all',
                          active
                            ? 'border-transparent bg-solar-gradient text-[#06110f] shadow-glow'
                            : 'border-white/[0.1] bg-white/[0.055] text-text-soft'
                        )}
                      >
                        <item.icon className="h-5 w-5" />
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
        className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-22px)] max-w-[520px] -translate-x-1/2 lg:hidden"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid h-[68px] grid-cols-5 gap-1 rounded-lg border border-white/[0.14] bg-[rgba(6,8,10,0.78)] p-1.5 shadow-xl backdrop-blur-2xl">
          {primary.map((item) => {
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
                    'relative flex h-full min-w-0 flex-col items-center justify-center gap-1 rounded-lg transition-all',
                    active
                      ? 'bg-white text-canvas shadow-sm'
                      : isAI
                      ? 'bg-solar-gradient text-[#06110f] shadow-glow'
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
          <button onClick={() => setSheetOpen(true)} aria-label="Abrir módulos" className="min-w-0">
            <motion.div
              whileTap={{ scale: 0.92 }}
              className="flex h-full min-w-0 flex-col items-center justify-center gap-1 rounded-lg text-text-faint transition-colors hover:text-text"
            >
              <Grid3X3 className="h-[20px] w-[20px]" />
              <span className="text-[9px] font-semibold leading-none">Menu</span>
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';
import { NAV_ITEMS, MOBILE_PRIMARY } from './nav-config';

export function MobileDock() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {sheetOpen && (
          <div className="lg:hidden fixed inset-0 z-[70]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="absolute inset-0 bg-canvas/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={spring}
              className="absolute bottom-0 left-0 right-0 bg-surface-0 border-t border-border-strong rounded-t-2xl p-5 pb-10 shadow-xl"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border-strong" />
              <div className="flex items-center justify-between mb-4">
                <span className="font-display text-xl text-text">Navegar</span>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="w-8 h-8 rounded-md flex items-center justify-center text-text-faint hover:bg-surface-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {NAV_ITEMS.map((item) => {
                  const active = item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSheetOpen(false)}
                    >
                      <motion.div
                        whileTap={{ scale: 0.92 }}
                        className={cn(
                          'flex flex-col items-center justify-center gap-1.5 p-3 rounded-lg transition-colors',
                          active
                            ? 'bg-solar/10 text-solar border border-solar/30'
                            : 'text-text-soft border border-transparent hover:bg-surface-1'
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium text-center leading-tight">
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
        className={cn(
          'lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50',
          'flex items-center gap-1 px-2 h-14 rounded-full',
          'bg-surface-0/90 backdrop-blur-xl border border-border-strong shadow-xl'
        )}
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        {MOBILE_PRIMARY.map((item) => {
          const active =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          const isAI = item.href === '/dashboard/ai';

          if (isAI) {
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className="relative w-11 h-11 -mt-4 rounded-full bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow"
                >
                  <item.icon className="w-5 h-5 text-canvas" />
                  <span className="absolute inset-0 rounded-full bg-solar/40 animate-pulse-solar" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileTap={{ scale: 0.88 }}
                className={cn(
                  'relative w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  active ? 'text-text' : 'text-text-soft'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="dock-active"
                    className="absolute inset-0 rounded-full bg-surface-2"
                    transition={spring}
                  />
                )}
                <item.icon className="relative w-[18px] h-[18px]" />
              </motion.div>
            </Link>
          );
        })}
        <button
          onClick={() => setSheetOpen(true)}
          aria-label="Abrir menu"
          className="ml-1"
        >
          <motion.div
            whileTap={{ scale: 0.9 }}
            className={cn(
              'relative w-12 h-12 rounded-full flex items-center justify-center',
              'bg-surface-2 border border-border-strong text-text',
              'shadow-md'
            )}
          >
            <LayoutGrid className="w-[22px] h-[22px]" />
          </motion.div>
        </button>
      </nav>
    </>
  );
}

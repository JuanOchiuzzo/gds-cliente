'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Command as CommandIcon, Search } from 'lucide-react';
import { CommandPalette } from '@/components/command-palette';
import { NotificationsButton } from '@/components/layout/notifications-button';
import { cn } from '@/lib/utils';
import { findNavItem } from './nav-config';

export function CommandBar() {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);
  const item = findNavItem(pathname);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-20 border-b border-white/[0.08]',
          'bg-canvas/90 backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/75'
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[560px] items-center gap-3 px-4 sm:px-5 lg:max-w-none lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <Image
              src="/brand/gds-app-mark.webp"
              alt="GDS"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg border border-white/12 shadow-glow"
              priority
            />
          </Link>

          <div className="min-w-0 flex-1">
            <nav className="hidden items-center gap-1.5 text-[13px] lg:flex">
              <Link href="/dashboard" className="text-text-faint transition-colors hover:text-text">
                GDS
              </Link>
              <ChevronRight className="h-3 w-3 text-text-ghost" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={item?.href}
                  initial={{ opacity: 0, y: -3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 3 }}
                  transition={{ duration: 0.18 }}
                  className="font-medium text-text"
                >
                  {item?.label || 'Dashboard'}
                </motion.span>
              </AnimatePresence>
            </nav>

            <div className="lg:hidden">
              <p className="text-[10px] font-semibold uppercase text-text-faint">GDS Premium</p>
              <AnimatePresence mode="wait">
                <motion.h1
                  key={item?.href}
                  initial={{ opacity: 0, y: -2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  transition={{ duration: 0.18 }}
                  className="truncate text-lg font-semibold leading-tight text-text"
                >
                  {item?.label || 'Dashboard'}
                </motion.h1>
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setCmdOpen(true)}
            className="hidden h-9 w-72 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.055] px-3 text-[13px] text-text-faint transition-colors hover:border-white/25 hover:text-text md:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Buscar ou ir para...</span>
            <kbd className="flex h-5 items-center gap-0.5 rounded-sm bg-white/[0.08] px-1.5 font-mono text-[10px] text-text-soft">
              <CommandIcon className="h-2.5 w-2.5" />K
            </kbd>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setCmdOpen(true)}
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.055] text-text-soft md:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </motion.button>

          <NotificationsButton iconSize={16} className="h-10 w-10" />
        </div>
      </header>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

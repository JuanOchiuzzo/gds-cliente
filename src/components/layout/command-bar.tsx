'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, Command as CommandIcon, Sparkles, ChevronRight } from 'lucide-react';
import { findNavItem } from './nav-config';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/command-palette';

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
          'sticky top-0 z-20 h-14 flex items-center gap-3 px-4 lg:px-6',
          'bg-canvas/80 backdrop-blur-xl border-b border-border'
        )}
      >
        {/* Mobile logo */}
        <Link href="/dashboard" className="lg:hidden flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-canvas" />
          </div>
        </Link>

        {/* Breadcrumb (desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5 text-[13px] flex-shrink-0">
          <Link href="/dashboard" className="text-text-faint hover:text-text transition-colors">
            StandForge
          </Link>
          <ChevronRight className="w-3 h-3 text-text-ghost" />
          <AnimatePresence mode="wait">
            <motion.span
              key={item?.href}
              initial={{ opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 3 }}
              transition={{ duration: 0.2 }}
              className="text-text font-medium"
            >
              {item?.label || 'Dashboard'}
            </motion.span>
          </AnimatePresence>
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setCmdOpen(true)}
          className="hidden md:flex items-center gap-2 h-9 px-3 bg-surface-1 border border-border-strong rounded-md text-text-faint text-[13px] hover:border-border-glow transition-colors w-72"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Buscar ou ir para…</span>
          <kbd className="flex items-center gap-0.5 px-1.5 h-5 rounded bg-surface-3 text-[10px] text-text-soft font-mono">
            <CommandIcon className="w-2.5 h-2.5" />K
          </kbd>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setCmdOpen(true)}
          className="md:hidden w-9 h-9 rounded-md flex items-center justify-center text-text-soft hover:bg-surface-1"
        >
          <Search className="w-4 h-4" />
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="relative w-9 h-9 rounded-md flex items-center justify-center text-text-soft hover:bg-surface-1 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-solar animate-pulse-soft" />
        </motion.button>
      </header>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Command as CommandIcon, Search, Sparkles } from 'lucide-react';
import { BrandMark } from '@/components/brand/brand-mark';
import { CommandPalette } from '@/components/command-palette';
import { NotificationsButton } from '@/components/layout/notifications-button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { findNavItem } from './nav-config';

export function CommandBar() {
  const pathname = usePathname();
  const [cmdOpen, setCmdOpen] = useState(false);
  const item = findNavItem(pathname);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 px-4 pt-[max(12px,env(safe-area-inset-top))] sm:px-5 lg:px-8 lg:pt-5">
        <div
          className={cn(
            'mx-auto flex h-[62px] w-full max-w-[560px] items-center gap-3 rounded-lg border border-white/[0.12]',
            'bg-[rgba(6,8,10,0.72)] px-3 shadow-lg shadow-black/25 backdrop-blur-2xl',
            'lg:max-w-[1240px] lg:px-4'
          )}
        >
          <div className="lg:hidden">
            <BrandMark size="sm" showWordmark={false} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="hidden text-[11px] font-semibold uppercase text-text-faint lg:block">
              GDS Command
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={item?.href}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="min-w-0"
              >
                <h1 className="truncate text-[18px] font-semibold leading-tight text-text lg:text-2xl">
                  {item?.label || 'Dashboard'}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => setCmdOpen(true)}
            className="hidden h-11 w-[min(420px,38vw)] items-center gap-3 rounded-lg border border-white/[0.12] bg-white/[0.06] px-3 text-sm text-text-faint shadow-inset transition-colors hover:border-solar/40 hover:text-text md:flex"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Pesquisar no CRM</span>
            <kbd className="flex h-6 items-center gap-1 rounded bg-white/[0.08] px-2 font-mono text-[10px] text-text-soft">
              <CommandIcon className="h-3 w-3" /> K
            </kbd>
          </button>

          <Badge variant="aurora" size="sm" className="hidden h-8 gap-1.5 px-2.5 md:inline-flex">
            <Sparkles className="h-3.5 w-3.5" />
            AI
          </Badge>

          <button
            onClick={() => setCmdOpen(true)}
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.12] bg-white/[0.06] text-text-soft shadow-inset md:hidden"
          >
            <Search className="h-[18px] w-[18px]" />
          </button>

          <NotificationsButton
            iconSize={17}
            className="h-10 w-10 rounded-lg border border-white/[0.12] bg-white/[0.06] text-text-soft shadow-inset hover:border-solar/40 hover:bg-white/[0.1]"
          />
        </div>
      </header>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

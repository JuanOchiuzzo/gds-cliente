'use client';

import { useState } from 'react';
import { Search, Command } from 'lucide-react';
import { motion } from 'framer-motion';
import { CommandPalette } from '@/components/command-palette';
import { NotificationsButton } from '@/components/layout/notifications-button';

export function Topbar() {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-4 lg:px-5 h-12">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow">
              <span className="text-[9px] font-bold tracking-wider text-canvas">GDS</span>
            </div>
            <span className="text-[14px] font-bold text-[var(--text)] tracking-tight">GDS</span>
          </div>

          {/* Desktop search */}
          <button onClick={() => setCmdOpen(true)}
            className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 bg-[var(--bg-hover)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] text-[13px] hover:border-[var(--border-strong)] transition-colors w-64">
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="px-1.5 py-0.5 bg-[var(--bg-card)] rounded text-[9px] text-[var(--text-faint)] border border-[var(--border)]">
              <Command className="w-2.5 h-2.5 inline" /> K
            </kbd>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCmdOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[var(--text-muted)] active:bg-[var(--bg-hover)]">
              <Search className="w-[18px] h-[18px]" />
            </motion.button>
            <NotificationsButton />
          </div>
        </div>
      </header>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

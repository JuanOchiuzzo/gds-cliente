'use client';

import { useState } from 'react';
import { Search, Bell, Command, Sparkles, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { CommandPalette } from '@/components/command-palette';
import { useTheme } from '@/lib/theme-context';

export function Topbar() {
  const [cmdOpen, setCmdOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <header className="sticky top-0 z-30 bg-[var(--sf-bg)]/60 backdrop-blur-2xl border-b border-[var(--sf-border-outer)]">
        <div className="flex items-center justify-between px-4 lg:px-5 py-2.5">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-[14px] font-bold text-[var(--sf-text-primary)] leading-none tracking-tight">StandForge</h1>
              <p className="text-[8px] text-[var(--sf-text-muted)] uppercase tracking-[0.2em] mt-px">CRM</p>
            </div>
          </div>

          {/* Desktop search */}
          <motion.button
            whileHover={{ scale: 1.005 }}
            onClick={() => setCmdOpen(true)}
            className="hidden lg:flex items-center gap-3 px-3.5 py-[7px] bg-[var(--sf-surface)] border border-[var(--sf-border-outer)] rounded-xl text-[var(--sf-text-muted)] text-[13px] hover:border-[var(--sf-border-hover)] transition-colors w-72"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Buscar...</span>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--sf-bg-tertiary)] rounded-md text-[9px] text-[var(--sf-text-muted)] border border-[var(--sf-border-outer)]">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </motion.button>

          {/* Right actions */}
          <div className="flex items-center gap-0.5">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setCmdOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[var(--sf-text-tertiary)] active:bg-[var(--sf-accent-light)]">
              <Search className="w-[18px] h-[18px]" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme}
              className="p-2 rounded-xl text-[var(--sf-text-tertiary)] active:bg-[var(--sf-accent-light)]">
              {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }}
              className="relative p-2 rounded-xl text-[var(--sf-text-tertiary)] active:bg-[var(--sf-accent-light)]">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--sf-accent)]" />
            </motion.button>
          </div>
        </div>
      </header>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

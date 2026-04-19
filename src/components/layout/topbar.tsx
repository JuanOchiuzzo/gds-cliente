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
      <header className="sticky top-0 z-30 bg-[var(--sf-bg)]/70 backdrop-blur-2xl border-b border-[var(--sf-border)]">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Mobile header */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--sf-text-primary)] leading-tight tracking-tight">StandForge</h1>
              <p className="text-[9px] text-[var(--sf-text-tertiary)] uppercase tracking-[0.15em] leading-tight">CRM Premium</p>
            </div>
          </div>

          {/* Desktop search */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            onClick={() => setCmdOpen(true)}
            className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-[var(--sf-text-tertiary)] text-sm hover:border-[var(--sf-border-hover)] transition-colors w-80"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Buscar leads, stands...</span>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[var(--sf-bg-tertiary)] rounded-lg text-[10px] text-[var(--sf-text-tertiary)] border border-[var(--sf-border)]">
              <Command className="w-3 h-3" /> K
            </kbd>
          </motion.button>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setCmdOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl text-[var(--sf-text-tertiary)] active:bg-[var(--sf-accent-light)] transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {/* Mobile theme toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl text-[var(--sf-text-tertiary)] active:bg-[var(--sf-accent-light)] transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="relative p-2.5 rounded-2xl text-[var(--sf-text-tertiary)] active:bg-[var(--sf-accent-light)] transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 dark:bg-cyan-400" />
            </motion.button>
          </div>
        </div>
      </header>

      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

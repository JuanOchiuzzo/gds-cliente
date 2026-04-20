'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, KanbanSquare, Calendar,
  MessageSquare, BarChart3, Settings, Sparkles, UserCog, Menu, X,
  Wallet, CalendarCheck, ShieldCheck, UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// 2 left | Nexus center | 2 right (Agenda + Mais)
const leftNav = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet },
];

const rightNav = [
  { href: '/dashboard/appointments', label: 'Agenda', icon: CalendarCheck },
];

const moreNav = [
  { href: '/dashboard/plantao', label: 'Plantão', icon: UserCircle },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/stands', label: 'Stands', icon: Building2 },
  { href: '/dashboard/agents', label: 'Equipe', icon: UserCog },
  { href: '/dashboard/team', label: 'Roles', icon: ShieldCheck },
  { href: '/dashboard/calendar', label: 'Calendário', icon: Calendar },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Config', icon: Settings },
];

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) {
  const pathname = usePathname();
  const isActive = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <Link href={href} className="flex-1">
      <motion.div
        whileTap={{ scale: 0.85 }}
        className="flex flex-col items-center gap-1 py-1.5 relative"
      >
        {isActive && (
          <motion.div
            layoutId="mobile-nav-indicator"
            className="absolute -top-2 w-8 h-[3px] rounded-full bg-blue-500 dark:bg-cyan-400 shadow-sm"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <Icon
          className={cn(
            'w-[22px] h-[22px] transition-all duration-200',
            isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-[var(--sf-text-muted)]'
          )}
        />
        <span
          className={cn(
            'text-[10px] font-medium transition-colors',
            isActive ? 'text-blue-600 dark:text-cyan-400' : 'text-[var(--sf-text-muted)]'
          )}
        >
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* More menu sheet */}
      <AnimatePresence>
        {moreOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="absolute bottom-0 left-0 right-0 bg-[var(--sf-bg-secondary)] backdrop-blur-3xl border-t border-[var(--sf-border)] rounded-t-3xl p-6 pb-10"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Mais opções</h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-2 rounded-xl text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {moreNav.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}>
                      <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all',
                          isActive
                            ? 'bg-[var(--sf-accent-light)] border-[var(--sf-accent)]/20 text-[var(--sf-accent)]'
                            : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)] active:bg-[var(--sf-surface-hover)]'
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="text-[10px] font-medium">{item.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-[var(--sf-bg-secondary)]/80 backdrop-blur-2xl border-t border-[var(--sf-border)]" />

        <div className="relative flex items-end justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {/* Left 2 items */}
          {leftNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          {/* Center — Nexus AI */}
          <Link href="/dashboard/ai" className="flex-1 flex justify-center -mt-4">
            <motion.div whileTap={{ scale: 0.9 }} className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 dark:from-cyan-500 dark:to-violet-500 blur-lg opacity-40" />
              <div className={cn(
                'relative w-14 h-14 rounded-2xl flex items-center justify-center',
                'bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500',
                'shadow-lg dark:shadow-[0_4px_24px_rgb(103,232,249,0.35)]',
                'border border-white/20'
              )}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="block text-center text-[10px] font-semibold text-blue-600 dark:text-cyan-300 mt-1">
                Nexus
              </span>
            </motion.div>
          </Link>

          {/* Right: Agenda */}
          {rightNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}

          {/* Right: More button */}
          <button onClick={() => setMoreOpen(true)} className="flex-1">
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center gap-1 py-1.5"
            >
              <Menu className="w-[22px] h-[22px] text-[var(--sf-text-muted)]" />
              <span className="text-[10px] font-medium text-[var(--sf-text-muted)]">Mais</span>
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
}

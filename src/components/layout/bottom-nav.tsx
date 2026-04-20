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

const primaryNav = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet },
  { href: '/dashboard/ai', label: 'Nexus', icon: Sparkles, special: true },
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

export function BottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* More sheet */}
      <AnimatePresence>
        {moreOpen && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)} className="absolute inset-0 bg-black/30 dark:bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="absolute bottom-0 left-0 right-0 bg-[var(--sf-bg-secondary)]/95 backdrop-blur-3xl border-t border-[var(--sf-border-outer)] rounded-t-[28px] p-5 pb-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-semibold text-[var(--sf-text-secondary)]">Mais opções</h3>
                <button onClick={() => setMoreOpen(false)} className="p-2 rounded-xl text-[var(--sf-text-tertiary)] active:bg-[var(--sf-accent-light)]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {moreNav.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}>
                      <motion.div whileTap={{ scale: 0.93 }}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all',
                          isActive
                            ? 'bg-[var(--sf-accent-light)] border-[rgba(var(--sf-accent-rgb),0.15)] text-[var(--sf-accent)]'
                            : 'bg-[var(--sf-surface)] border-[var(--sf-border-outer)] text-[var(--sf-text-tertiary)] active:bg-[var(--sf-surface-hover)]'
                        )}>
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

      {/* Bottom bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-[var(--sf-bg-secondary)]/70 backdrop-blur-2xl border-t border-[var(--sf-border-outer)]" />
        <div className="relative flex items-end justify-around px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {primaryNav.map((item) => {
            const isActive = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

            if (item.special) {
              return (
                <Link key={item.href} href={item.href} className="flex-1 flex justify-center -mt-3">
                  <motion.div whileTap={{ scale: 0.9 }} className="relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 blur-lg opacity-30" />
                    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 shadow-[0_4px_16px_rgba(99,102,241,0.35)] border border-white/20">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="block text-center text-[9px] font-semibold text-[var(--sf-accent)] mt-1">{item.label}</span>
                  </motion.div>
                </Link>
              );
            }

            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-0.5 py-1.5 relative">
                  {isActive && (
                    <motion.div layoutId="mobile-nav-dot"
                      className="absolute -top-1.5 w-5 h-[2.5px] rounded-full bg-[var(--sf-accent)]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                  )}
                  <item.icon className={cn('w-5 h-5 transition-colors', isActive ? 'text-[var(--sf-accent)]' : 'text-[var(--sf-text-muted)]')} />
                  <span className={cn('text-[9px] font-medium transition-colors', isActive ? 'text-[var(--sf-accent)]' : 'text-[var(--sf-text-muted)]')}>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}

          {/* More */}
          <button onClick={() => setMoreOpen(true)} className="flex-1">
            <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-0.5 py-1.5">
              <Menu className="w-5 h-5 text-[var(--sf-text-muted)]" />
              <span className="text-[9px] font-medium text-[var(--sf-text-muted)]">Mais</span>
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
}

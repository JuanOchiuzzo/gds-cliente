'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, Calendar,
  MessageSquare, BarChart3, Settings, Sparkles, UserCog, Menu, X,
  Wallet, CalendarCheck, ShieldCheck, UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const primary = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet },
  { href: '/dashboard/ai', label: 'AI', icon: Sparkles, fab: true },
  { href: '/dashboard/appointments', label: 'Agenda', icon: CalendarCheck },
];

const more = [
  { href: '/dashboard/plantao', label: 'Plantão', icon: UserCircle },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/stands', label: 'Stands', icon: Building2 },
  { href: '/dashboard/agents', label: 'Ranking', icon: UserCog },
  { href: '/dashboard/team', label: 'Roles', icon: ShieldCheck },
  { href: '/dashboard/calendar', label: 'Calendário', icon: Calendar },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Config', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* More sheet */}
      <AnimatePresence>
        {open && (
          <div className="lg:hidden fixed inset-0 z-[60]">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="absolute bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border)] rounded-t-[var(--radius-xl)] p-5 pb-10 shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-[var(--text)]">Mais</span>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"><X className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {more.map((item) => {
                  const active = pathname.startsWith(item.href);
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                      <motion.div whileTap={{ scale: 0.93 }}
                        className={cn('flex flex-col items-center gap-1.5 p-3 rounded-[var(--radius)] transition-all',
                          active ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] active:bg-[var(--bg-hover)]')}>
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

      {/* Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-card)]/80 backdrop-blur-xl border-t border-[var(--border)]">
        <div className="flex items-end justify-around px-1 pt-1 pb-[max(6px,env(safe-area-inset-bottom))]">
          {primary.map((item) => {
            const active = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href);
            if (item.fab) {
              return (
                <Link key={item.href} href={item.href} className="flex-1 flex justify-center -mt-4">
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)] shadow-[0_4px_14px_var(--accent-glow)]">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="block text-center text-[9px] font-semibold text-[var(--accent)] mt-0.5">{item.label}</span>
                  </motion.div>
                </Link>
              );
            }
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-0.5 py-1 relative">
                  {active && <motion.div layoutId="bnav" className="absolute -top-1 w-5 h-[2px] rounded-full bg-[var(--accent)]" transition={{ type: 'spring', stiffness: 500, damping: 30 }} />}
                  <item.icon className={cn('w-5 h-5', active ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]')} />
                  <span className={cn('text-[9px] font-medium', active ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]')}>{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
          <button onClick={() => setOpen(true)} className="flex-1">
            <motion.div whileTap={{ scale: 0.85 }} className="flex flex-col items-center gap-0.5 py-1">
              <Menu className="w-5 h-5 text-[var(--text-faint)]" />
              <span className="text-[9px] font-medium text-[var(--text-faint)]">Mais</span>
            </motion.div>
          </button>
        </div>
      </nav>
    </>
  );
}

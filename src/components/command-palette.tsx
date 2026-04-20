'use client';

import { useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, KanbanSquare, UserCog,
  Calendar, BarChart3, Settings, Search, Sparkles, Wallet, CalendarCheck, MessageSquare, ShieldCheck, UserCircle,
} from 'lucide-react';

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

const items = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Carteira', icon: Wallet, href: '/dashboard/wallet' },
  { label: 'Agendamentos', icon: CalendarCheck, href: '/dashboard/appointments' },
  { label: 'Plantão', icon: UserCircle, href: '/dashboard/plantao' },
  { label: 'Leads', icon: Users, href: '/dashboard/leads' },
  { label: 'Pipeline', icon: KanbanSquare, href: '/dashboard/pipeline' },
  { label: 'Stands', icon: Building2, href: '/dashboard/stands' },
  { label: 'Ranking', icon: UserCog, href: '/dashboard/agents' },
  { label: 'Chat', icon: MessageSquare, href: '/dashboard/chat' },
  { label: 'Roles', icon: ShieldCheck, href: '/dashboard/team' },
  { label: 'Calendário', icon: Calendar, href: '/dashboard/calendar' },
  { label: 'Relatórios', icon: BarChart3, href: '/dashboard/reports' },
  { label: 'Nexus AI', icon: Sparkles, href: '/dashboard/ai' },
  { label: 'Configurações', icon: Settings, href: '/dashboard/settings' },
];

export function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onOpenChange(!open); } };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [open, onOpenChange]);

  const go = (href: string) => { router.push(href); onOpenChange(false); };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)} className="absolute inset-0 bg-black/15 backdrop-blur-[2px]" />
          <div className="flex items-start justify-center pt-[18vh]">
            <motion.div initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: -8 }}
              className="relative w-full max-w-lg mx-4">
              <Command className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] overflow-hidden">
                <div className="flex items-center gap-2.5 px-4 border-b border-[var(--border)]">
                  <Search className="w-4 h-4 text-[var(--text-muted)]" />
                  <Command.Input placeholder="Buscar..." className="flex-1 py-3 bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none" />
                </div>
                <Command.List className="max-h-72 overflow-y-auto p-1.5">
                  <Command.Empty className="py-6 text-center text-sm text-[var(--text-muted)]">Nada encontrado.</Command.Empty>
                  {items.map((item) => (
                    <Command.Item key={item.href} onSelect={() => go(item.href)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-[var(--text-secondary)] cursor-pointer data-[selected=true]:bg-[var(--accent-soft)] data-[selected=true]:text-[var(--accent)]">
                      <item.icon className="w-4 h-4" /> {item.label}
                    </Command.Item>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

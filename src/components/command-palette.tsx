'use client';

import { useEffect } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, KanbanSquare, UserCog,
  Calendar, BarChart3, Settings, Search, Sparkles, Wallet, CalendarCheck, MessageSquare,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const navigate = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)} className="absolute inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm" />
          <div className="flex items-start justify-center pt-[20vh]">
            <motion.div initial={{ opacity: 0, scale: 0.96, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: -10 }}
              className="relative w-full max-w-lg mx-4">
              <Command className="bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded-3xl shadow-[var(--sf-shadow-lg)] overflow-hidden">
                <div className="flex items-center gap-3 px-4 border-b border-[var(--sf-border)]">
                  <Search className="w-4 h-4 text-[var(--sf-text-tertiary)]" />
                  <Command.Input placeholder="Buscar páginas, ações..."
                    className="flex-1 py-4 bg-transparent text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none" />
                </div>
                <Command.List className="max-h-80 overflow-y-auto p-2">
                  <Command.Empty className="py-8 text-center text-sm text-[var(--sf-text-muted)]">Nenhum resultado.</Command.Empty>
                  <Command.Group heading="Navegação" className="px-2 py-1.5 text-xs text-[var(--sf-text-muted)] font-medium">
                    {[
                      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
                      { label: 'Carteira', icon: Wallet, href: '/dashboard/wallet' },
                      { label: 'Agendamentos', icon: CalendarCheck, href: '/dashboard/appointments' },
                      { label: 'Stands', icon: Building2, href: '/dashboard/stands' },
                      { label: 'Leads', icon: Users, href: '/dashboard/leads' },
                      { label: 'Pipeline', icon: KanbanSquare, href: '/dashboard/pipeline' },
                      { label: 'Equipe', icon: UserCog, href: '/dashboard/agents' },
                      { label: 'Calendário', icon: Calendar, href: '/dashboard/calendar' },
                      { label: 'Chat', icon: MessageSquare, href: '/dashboard/chat' },
                      { label: 'Relatórios', icon: BarChart3, href: '/dashboard/reports' },
                      { label: 'Configurações', icon: Settings, href: '/dashboard/settings' },
                      { label: 'Nexus AI', icon: Sparkles, href: '/dashboard/ai' },
                    ].map((item) => (
                      <Command.Item key={item.href} onSelect={() => navigate(item.href)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--sf-text-secondary)] cursor-pointer data-[selected=true]:bg-[var(--sf-accent-light)] data-[selected=true]:text-[var(--sf-accent)]">
                        <item.icon className="w-4 h-4" /> {item.label}
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>
              </Command>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

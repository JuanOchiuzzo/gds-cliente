'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, KanbanSquare, UserCog,
  Calendar, MessageSquare, BarChart3, Settings, Sparkles, Sun, Moon,
  Wallet, CalendarCheck, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet },
  { href: '/dashboard/appointments', label: 'Agendamentos', icon: CalendarCheck },
  { href: '/dashboard/stands', label: 'Stands', icon: Building2 },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: KanbanSquare },
  { href: '/dashboard/agents', label: 'Equipe', icon: UserCog },
  { href: '/dashboard/team', label: 'Gestão de Roles', icon: ShieldCheck },
  { href: '/dashboard/calendar', label: 'Calendário', icon: Calendar },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { profile } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-40 bg-[var(--sf-bg-secondary)]/80 backdrop-blur-2xl border-r border-[var(--sf-border)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--sf-border)]">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[var(--sf-text-primary)] tracking-tight">StandForge</h1>
          <p className="text-[10px] text-[var(--sf-text-tertiary)] uppercase tracking-widest">CRM Premium</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 relative',
                  isActive
                    ? 'text-[var(--sf-accent)] bg-[var(--sf-accent-light)]'
                    : 'text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-[var(--sf-accent)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer with theme toggle */}
      <div className="px-4 py-4 border-t border-[var(--sf-border)] space-y-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-2xl text-sm text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)] transition-all"
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>

        <div className="flex items-center gap-3 px-2">
          <Avatar name={profile?.full_name || 'U'} src={profile?.avatar_url} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--sf-text-primary)] truncate">{profile?.full_name || 'Usuário'}</p>
            <p className="text-xs text-[var(--sf-text-tertiary)] truncate">{profile?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

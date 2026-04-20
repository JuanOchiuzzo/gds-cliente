'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, KanbanSquare, UserCog,
  Calendar, MessageSquare, BarChart3, Settings, Sparkles, Sun, Moon,
  Wallet, CalendarCheck, ShieldCheck, UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/lib/theme-context';
import { useAuth } from '@/lib/auth-context';
import { Avatar } from '@/components/ui/avatar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet },
  { href: '/dashboard/appointments', label: 'Agendamentos', icon: CalendarCheck },
  { href: '/dashboard/plantao', label: 'Plantão', icon: UserCircle },
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
    <aside className="hidden lg:flex flex-col w-[260px] h-screen fixed left-0 top-0 z-40 bg-[var(--sf-bg-secondary)]/60 backdrop-blur-2xl border-r border-[var(--sf-border-outer)]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.3)]">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 className="text-[15px] font-bold text-[var(--sf-text-primary)] tracking-tight leading-none">StandForge</h1>
          <p className="text-[9px] text-[var(--sf-text-muted)] uppercase tracking-[0.2em] mt-0.5">CRM</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-[13px] font-medium transition-all duration-150 relative',
                  isActive
                    ? 'text-[var(--sf-accent)] bg-[var(--sf-accent-light)]'
                    : 'text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)]'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-[var(--sf-accent)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-[var(--sf-border-outer)] space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-[7px] rounded-xl text-[13px] text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)] transition-all"
        >
          {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
          <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
        </button>

        <div className="flex items-center gap-2.5 px-3 py-1">
          <Avatar name={profile?.full_name || 'U'} src={profile?.avatar_url} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-[var(--sf-text-primary)] truncate">{profile?.full_name || 'Usuário'}</p>
            <p className="text-[10px] text-[var(--sf-text-muted)] truncate">{profile?.email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Calendar,
  Wallet,
  UsersRound,
  Building2,
  Clock,
  Sparkles,
  MessagesSquare,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  short?: string;
  icon: LucideIcon;
};

/** Primary bottom nav (mobile) — máx 5 itens. */
export const primaryNav: NavItem[] = [
  { href: '/dashboard', label: 'Início', short: 'Início', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', short: 'Leads', icon: Users },
  { href: '/dashboard/appointments', label: 'Agenda', short: 'Agenda', icon: CalendarCheck },
  { href: '/dashboard/wallet', label: 'Carteira', short: 'Carteira', icon: Wallet },
  { href: '/dashboard/ai', label: 'Forge AI', short: 'AI', icon: Sparkles },
];

/** Full nav (sidebar desktop + menu mobile) */
export const fullNav: NavItem[] = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet },
  { href: '/dashboard/appointments', label: 'Agendamentos', icon: CalendarCheck },
  { href: '/dashboard/calendar', label: 'Calendário', icon: Calendar },
  { href: '/dashboard/plantao', label: 'Plantão', icon: Clock },
  { href: '/dashboard/stands', label: 'Stands', icon: Building2 },
  { href: '/dashboard/agents', label: 'Equipe', icon: UsersRound },
  { href: '/dashboard/team', label: 'Time', icon: UsersRound },
  { href: '/dashboard/chat', label: 'Chat', icon: MessagesSquare },
  { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
  { href: '/dashboard/ai', label: 'Forge AI', icon: Sparkles },
  { href: '/dashboard/settings', label: 'Ajustes', icon: Settings },
];

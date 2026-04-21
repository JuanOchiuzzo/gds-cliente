import {
  LayoutDashboard,
  Wallet,
  CalendarCheck,
  UserCircle,
  Users,
  KanbanSquare,
  Building2,
  UserCog,
  MessageSquare,
  ShieldCheck,
  Calendar,
  BarChart3,
  Sparkles,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  shortLabel?: string;
  icon: LucideIcon;
  shortcut?: string;
  group: 'main' | 'sales' | 'team' | 'other';
}

export const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard, shortcut: 'G D', group: 'main' },
  { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet, shortcut: 'G W', group: 'main' },
  { href: '/dashboard/appointments', label: 'Agendamentos', shortLabel: 'Agenda', icon: CalendarCheck, shortcut: 'G A', group: 'main' },
  { href: '/dashboard/plantao', label: 'Plantão', icon: UserCircle, shortcut: 'G P', group: 'main' },

  { href: '/dashboard/leads', label: 'Leads', icon: Users, shortcut: 'G L', group: 'sales' },
  { href: '/dashboard/pipeline', label: 'Pipeline', icon: KanbanSquare, shortcut: 'G K', group: 'sales' },
  { href: '/dashboard/stands', label: 'Stands', icon: Building2, shortcut: 'G S', group: 'sales' },

  { href: '/dashboard/agents', label: 'Ranking', icon: UserCog, shortcut: 'G R', group: 'team' },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare, shortcut: 'G C', group: 'team' },
  { href: '/dashboard/team', label: 'Roles', icon: ShieldCheck, shortcut: 'G T', group: 'team' },

  { href: '/dashboard/calendar', label: 'Calendário', shortLabel: 'Cal', icon: Calendar, shortcut: 'G Y', group: 'other' },
  { href: '/dashboard/reports', label: 'Relatórios', shortLabel: 'Report', icon: BarChart3, shortcut: 'G O', group: 'other' },
  { href: '/dashboard/ai', label: 'GDS AI', shortLabel: 'AI', icon: Sparkles, shortcut: 'G I', group: 'other' },
  { href: '/dashboard/settings', label: 'Configurações', shortLabel: 'Config', icon: Settings, shortcut: 'G ,', group: 'other' },
];

export const MOBILE_PRIMARY = [
  NAV_ITEMS.find((i) => i.href === '/dashboard')!,
  NAV_ITEMS.find((i) => i.href === '/dashboard/wallet')!,
  NAV_ITEMS.find((i) => i.href === '/dashboard/ai')!,
  NAV_ITEMS.find((i) => i.href === '/dashboard/appointments')!,
  NAV_ITEMS.find((i) => i.href === '/dashboard/plantao')!,
];

export function findNavItem(pathname: string): NavItem | undefined {
  const exact = NAV_ITEMS.find((i) => i.href === pathname);
  if (exact) return exact;
  return NAV_ITEMS.slice()
    .sort((a, b) => b.href.length - a.href.length)
    .find((i) => i.href !== '/dashboard' && pathname.startsWith(i.href));
}

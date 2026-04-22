'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, UserCog,
  Calendar, MessageSquare, BarChart3, Settings, Sparkles,
  Wallet, CalendarCheck, ShieldCheck, UserCircle, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

const nav = [
  { section: 'Principal', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/wallet', label: 'Carteira', icon: Wallet },
    { href: '/dashboard/appointments', label: 'Agendamentos', icon: CalendarCheck },
    { href: '/dashboard/plantao', label: 'Plantão', icon: UserCircle },
  ]},
  { section: 'Vendas', items: [
    { href: '/dashboard/leads', label: 'Leads', icon: Users },
    { href: '/dashboard/stands', label: 'Stands', icon: Building2 },
  ]},
  { section: 'Equipe', items: [
    { href: '/dashboard/agents', label: 'Ranking', icon: UserCog },
    { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
    { href: '/dashboard/team', label: 'Roles', icon: ShieldCheck },
  ]},
  { section: 'Outros', items: [
    { href: '/dashboard/calendar', label: 'Calendário', icon: Calendar },
    { href: '/dashboard/reports', label: 'Relatórios', icon: BarChart3 },
    { href: '/dashboard/ai', label: 'GDS AI', icon: Sparkles },
    { href: '/dashboard/settings', label: 'Configurações', icon: Settings },
  ]},
];

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => { await signOut(); router.push('/'); };

  return (
    <aside className="hidden lg:flex flex-col w-[240px] h-screen fixed left-0 top-0 z-40 bg-[var(--bg-sidebar)]">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow">
          <span className="text-[9px] font-bold tracking-wider text-canvas">GDS</span>
        </div>
        <span className="text-[15px] font-bold text-white tracking-tight">GDS</span>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 px-2 pb-2 overflow-y-auto space-y-4">
        {nav.map((section) => (
          <div key={section.section}>
            <p className="px-3 mb-1 text-[10px] font-semibold text-stone-500 uppercase tracking-wider">{section.section}</p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.1 }}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-[6px] rounded-lg text-[13px] transition-all duration-150',
                        active
                          ? 'bg-white/10 text-white font-medium'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-white/[0.04]'
                      )}>
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white">
            {profile?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-stone-200 truncate">{profile?.full_name || 'Usuário'}</p>
            <p className="text-[10px] text-stone-500 truncate">{profile?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-[6px] rounded-lg text-[12px] text-stone-500 hover:text-red-400 hover:bg-white/[0.04] transition-all">
          <LogOut className="w-3.5 h-3.5" /> Sair
        </button>
      </div>
    </aside>
  );
}

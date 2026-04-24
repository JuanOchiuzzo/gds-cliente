'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { fullNav } from './nav-config';
import { Brand } from '@/components/brand/brand';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { cn, getDisplayName } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] lg:flex flex-col border-r border-line bg-ink-900/70 backdrop-blur-2xl">
      <div className="px-5 pt-5 pb-3">
        <Brand size="md" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <ul className="space-y-0.5">
          {fullNav.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-sm font-medium transition-colors press',
                    active ? 'text-fg' : 'text-fg-muted hover:text-fg hover:bg-white/[0.04]',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active"
                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                      className="absolute inset-0 rounded-[12px] bg-[linear-gradient(135deg,rgba(157,140,255,0.18),rgba(96,222,255,0.1))] border border-white/10"
                    />
                  )}
                  <span className="relative flex h-6 w-6 items-center justify-center">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                  </span>
                  <span className="relative">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-3 rounded-[14px] bg-white/[0.03] p-2.5">
          <Avatar name={profile?.full_name} size="sm" dot="ok" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-fg">
              {getDisplayName(profile?.full_name, 'Usuário')}
            </p>
            <p className="truncate text-[11px] text-fg-muted">{profile?.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] text-fg-muted hover:bg-white/[0.06] hover:text-bad transition-colors"
            aria-label="Sair"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

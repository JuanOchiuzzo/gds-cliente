'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';
import { NAV_ITEMS } from './nav-config';
import { Tooltip } from '@/components/ui/tooltip';
import { Avatar } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/lib/auth-context';

const GROUP_ORDER: Array<'main' | 'sales' | 'team' | 'other'> = ['main', 'sales', 'team', 'other'];

export function OrbitRail() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 w-[72px] bg-canvas border-r border-border">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="h-14 flex items-center justify-center border-b border-border group"
      >
        <motion.div
          whileHover={{ rotate: 12, scale: 1.05 }}
          transition={spring}
          className="w-9 h-9 rounded-lg bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow"
        >
          <Sparkles className="w-4 h-4 text-canvas" />
        </motion.div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto no-scrollbar py-3 flex flex-col items-center gap-0.5">
        {GROUP_ORDER.map((group, gi) => {
          const items = NAV_ITEMS.filter((i) => i.group === group);
          return (
            <div key={group} className="w-full flex flex-col items-center gap-0.5">
              {gi > 0 && <div className="w-7 h-px bg-border my-2" />}
              {items.map((item) => {
                const active =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href);
                return (
                  <Tooltip
                    key={item.href}
                    side="right"
                    content={
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.shortcut && (
                          <kbd className="font-mono text-[10px] text-text-faint">{item.shortcut}</kbd>
                        )}
                      </span>
                    }
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'relative w-11 h-11 flex items-center justify-center rounded-lg transition-colors',
                        active
                          ? 'text-text'
                          : 'text-text-faint hover:text-text hover:bg-surface-1'
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="rail-active-bg"
                          className="absolute inset-0 rounded-lg bg-surface-2 border border-border-strong"
                          transition={spring}
                        />
                      )}
                      {active && (
                        <motion.span
                          layoutId="rail-active-indicator"
                          className="absolute left-0 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-solar to-solar-hot"
                          transition={spring}
                        />
                      )}
                      <item.icon className="relative w-[18px] h-[18px]" />
                    </Link>
                  </Tooltip>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border py-3 flex flex-col items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative group">
              <Avatar
                name={profile?.full_name || 'Usuário'}
                src={profile?.avatar_url}
                size="sm"
                ring="subtle"
                status="online"
              />
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="end" className="w-56 p-1">
            <div className="px-3 py-2.5 border-b border-border mb-1">
              <p className="text-sm font-medium text-text truncate">
                {profile?.full_name || 'Usuário'}
              </p>
              <p className="text-xs text-text-faint truncate">{profile?.email}</p>
            </div>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm text-text-soft hover:text-text hover:bg-surface-2 transition-colors"
            >
              Configurações
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-sm text-sm text-danger hover:bg-surface-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </aside>
  );
}

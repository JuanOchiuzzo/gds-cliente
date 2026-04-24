'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Radar, Search, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BrandMark } from '@/components/brand/brand-mark';
import { CommandPalette } from '@/components/command-palette';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';
import { NAV_ITEMS } from './nav-config';

const GROUPS = [
  { key: 'main', label: 'Operação' },
  { key: 'sales', label: 'Vendas' },
  { key: 'team', label: 'Equipe' },
  { key: 'other', label: 'Sistema' },
] as const;

export function OrbitRail() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const router = useRouter();
  const [cmdOpen, setCmdOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <aside className="web-command-frame fixed left-0 top-0 z-40 hidden h-screen w-[292px] border-r border-white/[0.1] lg:flex lg:flex-col">
        <div className="flex h-20 items-center px-5">
          <BrandMark size="md" />
        </div>

        <div className="px-4">
          <button
            onClick={() => setCmdOpen(true)}
            className="native-panel flex h-12 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-text-faint transition-colors hover:border-solar/40 hover:text-text"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1">Buscar cliente, lead ou visita</span>
            <kbd className="rounded bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-text-soft">
              Ctrl K
            </kbd>
          </button>
        </div>

      <div className="mx-4 mt-4 rounded-lg border border-white/[0.1] bg-black/20 p-3 shadow-inset">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15 text-success">
              <Radar className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-text">Sala ativa</p>
              <p className="text-[11px] text-text-faint">Pipeline em tempo real</p>
            </div>
          </div>
          <Badge variant="success" size="xs">live</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            ['Live', 'fila'],
            ['PWA', 'mobile'],
            ['AI', 'core'],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-white/[0.08] bg-white/[0.045] py-2">
              <p className="text-sm font-semibold text-text">{value}</p>
              <p className="text-[10px] text-text-faint">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5 no-scrollbar">
        <div className="space-y-5">
          {GROUPS.map((group) => {
            const items = NAV_ITEMS.filter((item) => item.group === group.key);
            return (
              <section key={group.key}>
                <p className="mb-2 px-2 text-[10px] font-semibold uppercase text-text-ghost">
                  {group.label}
                </p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const active =
                      item.href === '/dashboard'
                        ? pathname === '/dashboard'
                        : pathname.startsWith(item.href);

                    return (
                      <Link key={item.href} href={item.href}>
                        <motion.div
                          whileHover={{ x: 2 }}
                          transition={spring}
                          className={cn(
                            'relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-all',
                            active
                              ? 'bg-white text-canvas shadow-sm'
                              : 'text-text-soft hover:bg-white/[0.07] hover:text-text'
                          )}
                        >
                          {active && (
                            <motion.span
                              layoutId="desktop-active-dot"
                              className="absolute left-0 h-5 w-1 rounded-r-full bg-solar"
                              transition={spring}
                            />
                          )}
                          <item.icon className="h-[18px] w-[18px] shrink-0" />
                          <span className="min-w-0 flex-1 truncate font-semibold">{item.label}</span>
                          {item.shortcut && !active && (
                            <span className="font-mono text-[10px] text-text-ghost">{item.shortcut}</span>
                          )}
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/[0.1] p-4">
        <div className="native-panel mb-3 flex items-center gap-3 rounded-lg p-3">
          <Avatar
            name={profile?.full_name || 'Usuário'}
            src={profile?.avatar_url}
            size="sm"
            ring="subtle"
            status="online"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text">
              {profile?.full_name || 'Usuário'}
            </p>
            <p className="flex items-center gap-1 truncate text-[11px] text-text-faint">
              <ShieldCheck className="h-3 w-3" />
              {profile?.role || 'operador'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold text-text-faint transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
      </aside>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

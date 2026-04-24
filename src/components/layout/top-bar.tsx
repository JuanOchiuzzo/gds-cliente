'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Menu, Search, X } from 'lucide-react';
import { Brand } from '@/components/brand/brand';
import { Avatar } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetBody } from '@/components/ui/sheet';
import { fullNav } from './nav-config';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

export function TopBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  return (
    <>
      <header
        className="sticky top-0 z-30 lg:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-2xl border-b border-line" />
        <div className="relative flex h-14 items-center justify-between px-4">
          <button
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/[0.04] border border-line text-fg-soft press"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Brand size="sm" showWordmark={false} />

          <Link
            href="/dashboard/settings"
            className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/[0.04] border border-line press relative"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5 text-fg-soft" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-iris animate-pulse-ring" />
          </Link>
        </div>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent>
          <SheetHeader title="StandForge" description={profile?.email ?? undefined} />
          <SheetBody>
            <nav>
              <ul className="space-y-1 pb-2">
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
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-[14px] px-3 py-3 text-sm font-medium press',
                          active
                            ? 'bg-[linear-gradient(135deg,rgba(157,140,255,0.22),rgba(96,222,255,0.12))] text-fg border border-white/10'
                            : 'text-fg-soft hover:bg-white/[0.04]',
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  await signOut();
                }}
                className="mt-3 flex w-full items-center gap-3 rounded-[14px] border border-line px-3 py-3 text-sm font-medium text-bad hover:bg-bad/10 press"
              >
                <X className="h-5 w-5" />
                Sair da conta
              </button>
            </nav>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function DesktopTopBar() {
  const { profile } = useAuth();
  return (
    <header className="sticky top-0 z-20 hidden lg:flex h-16 items-center gap-4 border-b border-line bg-ink-950/70 backdrop-blur-2xl px-8">
      <div className="relative flex-1 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
        <input
          placeholder="Buscar clientes, stands, agendamentos..."
          className="h-10 w-full rounded-[12px] border border-line bg-white/[0.03] pl-9 pr-3 text-sm text-fg placeholder:text-fg-faint outline-none focus:border-iris/60"
        />
      </div>
      <button className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-line bg-white/[0.03] press">
        <Bell className="h-4 w-4 text-fg-soft" />
      </button>
      <Avatar name={profile?.full_name} size="sm" dot="ok" />
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { primaryNav } from './nav-config';
import { cn } from '@/lib/utils';

export function BottomDock() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 10px)',
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-10 h-10 bg-gradient-to-t from-ink-950 to-transparent" />
      <div className="relative mx-auto max-w-md px-3">
        <div className="glass-strong flex items-center justify-between rounded-[24px] px-2 py-1.5 shadow-xl">
          {primaryNav.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-[18px] py-2 text-fg-muted press"
              >
                {active && (
                  <motion.span
                    layoutId="dock-active"
                    transition={{ type: 'spring', stiffness: 480, damping: 36 }}
                    className="absolute inset-0 rounded-[18px] bg-[linear-gradient(135deg,rgba(157,140,255,0.22),rgba(96,222,255,0.14))] border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                  />
                )}
                <span
                  className={cn(
                    'relative flex h-6 w-6 items-center justify-center transition-colors',
                    active ? 'text-fg' : 'text-fg-muted',
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                </span>
                <span
                  className={cn(
                    'relative text-[10px] font-medium transition-colors',
                    active ? 'text-fg' : 'text-fg-muted',
                  )}
                >
                  {item.short ?? item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

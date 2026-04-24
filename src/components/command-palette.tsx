'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ArrowRight,
  Sparkles,
  Plus,
  Zap,
  Command as CommandIcon,
  User,
  Flame,
} from 'lucide-react';
import { NAV_ITEMS } from '@/components/layout/nav-config';
import { spring } from '@/lib/motion';
import { useLeads } from '@/lib/hooks/use-leads';
import { useWallet } from '@/lib/hooks/use-wallet';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const QUICK_ACTIONS = [
  { label: 'Novo lead', icon: Plus, href: '/dashboard/leads', hint: 'criar' },
  { label: 'Entrar na fila de plantão', icon: Zap, href: '/dashboard/plantao', hint: 'ação' },
  { label: 'Novo agendamento', icon: Plus, href: '/dashboard/appointments', hint: 'criar' },
  { label: 'Perguntar à IA', icon: Sparkles, href: '/dashboard/ai', hint: 'IA' },
];

export function CommandPalette({ open, onOpenChange }: Props) {
  const router = useRouter();
  const [value, setValue] = useState('');
  const { leads } = useLeads({ fetchAll: true });
  const { clients } = useWallet();

  useEffect(() => {
    if (!open) setValue('');
  }, [open]);

  const go = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-canvas/80 backdrop-blur-xl"
          />
          <div className="relative flex min-h-full items-end justify-center px-0 sm:items-start sm:px-4 sm:pt-[14vh]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -8 }}
              transition={spring}
              className="w-full max-w-2xl"
            >
              <Command className="native-panel overflow-hidden rounded-t-lg shadow-xl sm:rounded-lg" loop>
                <div className="flex items-center gap-3 px-4 border-b border-white/[0.08]">
                  <Search className="w-4 h-4 text-text-faint flex-shrink-0" />
                  <Command.Input
                    value={value}
                    onValueChange={setValue}
                    placeholder="Buscar páginas, leads, clientes ou ações…"
                    className="flex-1 h-14 bg-transparent text-[15px] text-text placeholder:text-text-faint outline-none"
                  />
                  <kbd className="hidden sm:flex items-center gap-1 h-6 px-2 rounded bg-white/[0.08] text-[10px] text-text-soft font-mono">
                    <CommandIcon className="w-2.5 h-2.5" />K
                  </kbd>
                </div>

                <Command.List className="max-h-[420px] overflow-y-auto p-2">
                  <Command.Empty className="py-10 text-center">
                    <p className="text-sm text-text-faint">
                      Nada encontrado para &ldquo;{value}&rdquo;
                    </p>
                  </Command.Empty>

                  <Command.Group heading="Navegar">
                    {NAV_ITEMS.map((item) => (
                      <Command.Item
                        key={item.href}
                        value={`nav ${item.label}`}
                        onSelect={() => go(item.href)}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-text-soft"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.055] transition-colors group-data-[selected=true]:border-solar/30 group-data-[selected=true]:bg-solar/15">
                          <item.icon className="w-3.5 h-3.5 text-text-soft group-data-[selected=true]:text-solar" />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {item.shortcut && (
                          <kbd className="font-mono text-[10px] text-text-faint">
                            {item.shortcut}
                          </kbd>
                        )}
                        <ArrowRight className="w-3 h-3 text-text-faint opacity-0 group-data-[selected=true]:opacity-100 transition-opacity" />
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {value.length >= 2 && leads.length > 0 && (
                    <Command.Group heading="Leads">
                      {leads.slice(0, 6).map((lead) => (
                        <Command.Item
                          key={`lead-${lead.id}`}
                          value={`lead ${lead.name} ${lead.phone ?? ''}`}
                          onSelect={() => go('/dashboard/leads')}
                          className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-text-soft"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.16] bg-white/[0.08]">
                            <User className="w-3.5 h-3.5 text-aurora-1" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-text truncate">{lead.name}</p>
                            {lead.phone && (
                              <p className="text-[11px] text-text-faint truncate">
                                {lead.phone}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] text-text-faint uppercase">
                            {lead.stage}
                          </span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  {value.length >= 2 && clients.length > 0 && (
                    <Command.Group heading="Clientes da carteira">
                      {clients.slice(0, 6).map((client) => (
                        <Command.Item
                          key={`client-${client.id}`}
                          value={`client ${client.name} ${client.phone ?? ''}`}
                          onSelect={() => go('/dashboard/wallet')}
                          className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-text-soft"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-hot/25 bg-hot/10">
                            <Flame className="w-3.5 h-3.5 text-hot" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-text truncate">{client.name}</p>
                            {client.interested_product && (
                              <p className="text-[11px] text-text-faint truncate">
                                {client.interested_product}
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] text-text-faint uppercase">
                            {client.temperature}
                          </span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  <Command.Group heading="Ações rápidas">
                    {QUICK_ACTIONS.map((a) => (
                      <Command.Item
                        key={a.label}
                        value={`action ${a.label}`}
                        onSelect={() => go(a.href)}
                        className="group flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-text-soft"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-solar/25 bg-solar/10">
                          <a.icon className="w-3.5 h-3.5 text-solar" />
                        </div>
                        <span className="flex-1">{a.label}</span>
                        <span className="text-[10px] text-text-faint uppercase">
                          {a.hint}
                        </span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                </Command.List>

                <div className="flex items-center justify-end px-4 py-2 border-t border-white/[0.08] bg-white/[0.035] text-[11px] text-text-faint">
                  <span className="flex items-center gap-1 text-solar">
                    <Sparkles className="w-3 h-3" />
                    GDS
                  </span>
                </div>
              </Command>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarCheck,
  Flame,
  ListTodo,
  MessageCircle,
  Phone,
  Plus,
  Sparkles,
  UserCircle,
  Wallet,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { NumberFlow } from '@/components/ui/number-flow';
import { Ring } from '@/components/ui/ring';
import { Sparkline } from '@/components/ui/sparkline';
import { Surface } from '@/components/ui/surface';
import { useAuth } from '@/lib/auth-context';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useQueue } from '@/lib/hooks/use-queue';
import { useWallet } from '@/lib/hooks/use-wallet';
import { cn, generateWhatsAppLink, getFirstName } from '@/lib/utils';
import { slideUp, spring, staggerParent } from '@/lib/motion';

const sparkData = [12, 18, 16, 25, 22, 34, 30, 44, 41, 52, 49, 61];

export default function DashboardPage() {
  const { profile } = useAuth();
  const { clients, tasks } = useWallet();
  const { appointments } = useAppointments();
  const { myPosition, queue } = useQueue();

  const firstName = getFirstName(profile?.full_name, 'Guerreiro');
  const pendingTasks = tasks.filter((t) => !t.completed);
  const hotClients = clients.filter((c) => c.temperature === 'quente');
  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.date === today);
  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? 'Boa madrugada' : hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const conversionRate = clients.length ? Math.round((hotClients.length / clients.length) * 100) : 0;
  const momentum = Math.min(100, Math.round(conversionRate * 0.55 + pendingTasks.length * 4 + todayApts.length * 9));

  return (
    <motion.div
      variants={staggerParent(0.05)}
      initial="hidden"
      animate="visible"
      className="space-y-5 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:gap-5 lg:space-y-0"
    >
      <div className="space-y-5">
        <motion.section variants={slideUp} className="native-panel overflow-hidden rounded-lg p-5">
          <div className="relative">
            <div className="absolute inset-x-[-20px] top-[-20px] h-40 bg-[url('/brand/gds-command-bg.webp')] bg-cover bg-center opacity-45" />
            <div className="absolute inset-x-[-20px] top-[-20px] h-48 bg-[linear-gradient(180deg,rgba(6,8,10,0.08),rgba(6,8,10,0.9))]" />
            <div className="relative min-h-[250px]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase text-text-faint">
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                  <h1 className="mt-2 text-[36px] font-semibold leading-[1.02] text-white sm:text-[44px]">
                    {greeting}, <span className="text-solar-gradient">{firstName}</span>
                  </h1>
                </div>
                <Link href="/dashboard/ai">
                  <Button variant="aurora" size="icon" aria-label="Abrir GDS AI">
                    <Sparkles className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-[1fr_auto] items-end gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-text-faint">Pulso comercial</p>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="text-[72px] font-semibold leading-none text-white">
                      <NumberFlow value={clients.length} />
                    </span>
                    <span className="pb-2 text-sm text-text-soft">clientes ativos</span>
                  </div>
                  <Sparkline data={sparkData} width={170} height={42} variant="solar" />
                </div>
                <Ring value={momentum} size={102} strokeWidth={8} label={`${momentum}%`} />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={slideUp} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricTile
            href="/dashboard/wallet"
            icon={<Flame className="h-4 w-4" />}
            label="Quentes"
            value={hotClients.length}
            tone="gold"
          />
          <MetricTile
            href="/dashboard/wallet"
            icon={<ListTodo className="h-4 w-4" />}
            label="Tarefas"
            value={pendingTasks.length}
          />
          <MetricTile
            href="/dashboard/appointments"
            icon={<CalendarCheck className="h-4 w-4" />}
            label="Hoje"
            value={todayApts.length}
            tone="blue"
          />
          <MetricTile
            href="/dashboard/wallet"
            icon={<Wallet className="h-4 w-4" />}
            label="Taxa quente"
            value={conversionRate}
            suffix="%"
            tone="green"
          />
        </motion.section>

        <motion.section variants={slideUp} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: '/dashboard/wallet', label: 'Cliente', icon: Plus },
            { href: '/dashboard/appointments', label: 'Visita', icon: CalendarCheck },
            { href: '/dashboard/plantao', label: 'Plantão', icon: UserCircle },
            { href: '/dashboard/ai', label: 'Perguntar', icon: Sparkles },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileTap={{ scale: 0.96 }}
                transition={spring}
                className="native-panel flex h-20 items-center gap-3 rounded-lg px-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-canvas">
                  <action.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold text-text">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </motion.section>

        {clients.length === 0 && todayApts.length === 0 && !myPosition && (
          <motion.section variants={slideUp}>
            <Surface variant="elevated" padding="xl">
              <EmptyState
                icon={<Sparkles className="h-6 w-6" />}
                title="Bem-vindo ao GDS"
                description="Comece adicionando clientes à sua carteira e criando agendamentos."
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/dashboard/wallet">
                      <Button variant="solar">
                        <Plus className="h-4 w-4" />
                        Adicionar cliente
                      </Button>
                    </Link>
                    <Link href="/dashboard/appointments">
                      <Button variant="outline">
                        <CalendarCheck className="h-4 w-4" />
                        Criar visita
                      </Button>
                    </Link>
                  </div>
                }
              />
            </Surface>
          </motion.section>
        )}
      </div>

      <div className="space-y-5">
        {myPosition && (
          <motion.section variants={slideUp}>
            <Surface variant="elevated" padding="lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/15 text-success animate-pulse-solar">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase text-text-faint">Plantão</p>
                    <h2 className="truncate text-base font-semibold text-text">
                      {myPosition.stand_name || 'Stand'}
                    </h2>
                  </div>
                </div>
                <Badge
                  variant={
                    myPosition.status === 'atendendo'
                      ? 'info'
                      : myPosition.position <= 2
                      ? 'success'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {myPosition.status === 'atendendo'
                    ? 'Atendendo'
                    : myPosition.position <= 2
                    ? 'Próximo'
                    : `${myPosition.position}º`}
                </Badge>
              </div>

              {queue.length > 0 && (
                <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 no-scrollbar">
                  {queue.slice(0, 8).map((q) => {
                    const me = q.agent_id === profile?.id;
                    return (
                      <div
                        key={q.id}
                        className={cn(
                          'flex h-9 shrink-0 items-center gap-2 rounded-full border px-3 text-xs',
                          me
                            ? 'border-solar/50 bg-solar/15 text-solar'
                            : q.status === 'atendendo'
                            ? 'border-success/25 bg-success/10 text-success'
                            : 'border-white/[0.1] bg-white/[0.045] text-text-soft'
                        )}
                      >
                        <span className="font-mono">{q.position}º</span>
                        <span>{getFirstName(q.agent_name, 'Corretor')}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Surface>
          </motion.section>
        )}

        <motion.section variants={slideUp}>
          <Surface variant="elevated" padding="lg">
            <SectionTitle
              icon={<CalendarCheck className="h-4 w-4 text-solar" />}
              title="Agenda de hoje"
              href="/dashboard/appointments"
              badge={todayApts.length}
            />

            {todayApts.length === 0 ? (
              <div className="py-6 text-sm text-text-faint">Nenhum agendamento para hoje.</div>
            ) : (
              <div className="space-y-2">
                {todayApts.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.09] bg-white/[0.045] p-3"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-solar/15 text-solar">
                      <CalendarCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text">{apt.client_name}</p>
                      <p className="mt-0.5 truncate text-[11px] text-text-faint">
                        {apt.time}
                        {apt.product_name ? ` · ${apt.product_name}` : ''}
                      </p>
                    </div>
                    <Badge variant={apt.status === 'confirmado' ? 'success' : 'warning'} size="xs">
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Surface>
        </motion.section>

        {hotClients.length > 0 && (
          <motion.section variants={slideUp}>
            <Surface variant="elevated" padding="lg">
              <SectionTitle
                icon={<Flame className="h-4 w-4 text-solar" />}
                title="Clientes quentes"
                href="/dashboard/wallet"
                badge={hotClients.length}
              />
              <div className="space-y-3">
                {hotClients.slice(0, 4).map((client) => (
                  <div key={client.id} className="rounded-lg border border-white/[0.09] bg-white/[0.045] p-3">
                    <div className="flex items-start gap-3">
                      <Avatar name={client.name} size="md" status="online" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-text">{client.name}</p>
                        <p className="truncate text-[11px] text-text-faint">
                          {client.interested_product || 'Sem produto'}
                        </p>
                      </div>
                      <Flame className="h-4 w-4 text-solar" />
                    </div>
                    {client.phone && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <a
                          href={generateWhatsAppLink(client.phone, `Olá ${getFirstName(client.name)}!`)}
                          target="_blank"
                          rel="noopener"
                          className="flex h-9 items-center justify-center gap-1 rounded-lg border border-success/25 bg-success/10 text-[11px] font-semibold text-success"
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                        </a>
                        <a
                          href={`tel:${client.phone}`}
                          className="flex h-9 items-center justify-center gap-1 rounded-lg border border-white/[0.12] bg-white/[0.055] text-[11px] font-semibold text-white"
                        >
                          <Phone className="h-3.5 w-3.5" /> Ligar
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Surface>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}

function MetricTile({
  href,
  icon,
  label,
  value,
  suffix,
  tone = 'neutral',
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: number;
  suffix?: string;
  tone?: 'neutral' | 'gold' | 'green' | 'blue';
}) {
  const toneClass = {
    neutral: 'bg-white/[0.065] text-white',
    gold: 'bg-solar/15 text-solar',
    green: 'bg-success/15 text-success',
    blue: 'bg-info/15 text-info',
  }[tone];

  return (
    <Link href={href}>
      <Surface interactive variant="elevated" padding="md" className="min-h-[132px]">
        <div className="flex h-full flex-col justify-between">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', toneClass)}>
            {icon}
          </div>
          <div>
            <div className="text-3xl font-semibold text-text">
              <NumberFlow value={value} />
              {suffix}
            </div>
            <p className="mt-1 text-[11px] font-semibold uppercase text-text-faint">{label}</p>
          </div>
        </div>
      </Surface>
    </Link>
  );
}

function SectionTitle({
  icon,
  title,
  href,
  badge,
}: {
  icon: ReactNode;
  title: string;
  href: string;
  badge: number;
}) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {icon}
        <h2 className="text-base font-semibold text-text">{title}</h2>
        <Badge variant="neutral" size="xs">{badge}</Badge>
      </div>
      <Link href={href} className="flex items-center gap-1 text-xs font-semibold text-solar">
        Abrir
        <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

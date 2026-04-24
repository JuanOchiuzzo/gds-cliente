'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  ArrowUpRight,
  CalendarCheck,
  Clock,
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
import { slideUp, spring, staggerParent } from '@/lib/motion';
import { cn, generateWhatsAppLink, getFirstName } from '@/lib/utils';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { clients, tasks } = useWallet();
  const { appointments } = useAppointments();
  const { queue, myPosition } = useQueue();

  const firstName = getFirstName(profile?.full_name, 'Guerreiro');
  const pendingTasks = tasks.filter((t) => !t.completed);
  const hotClients = clients.filter((c) => c.temperature === 'quente');
  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.date === today);
  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? 'Boa madrugada' : hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const sparkData = [12, 18, 14, 22, 19, 28, 24, 32, 30, 38, 35, 42];
  const conversionRate = clients.length
    ? Math.round((hotClients.length / clients.length) * 100)
    : 0;

  return (
    <motion.div
      variants={staggerParent(0.05)}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-[1200px] space-y-5"
    >
      <motion.section variants={slideUp} className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase text-text-faint">
              {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </p>
            <h1 className="mt-1 text-[32px] font-semibold leading-tight text-text">
              {greeting}, <span className="text-solar-gradient">{firstName}</span>
            </h1>
          </div>
          <Link href="/dashboard/ai">
            <Button variant="solar" size="icon" aria-label="Abrir GDS AI">
              <Sparkles className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <Surface variant="glow" padding="none" className="overflow-hidden">
          <div
            className="relative min-h-[210px] p-5"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(8,9,11,0.25), rgba(8,9,11,0.84)), url('/brand/gds-mobile-splash.webp')",
              backgroundSize: 'cover',
              backgroundPosition: 'center 28%',
            }}
          >
            <div className="relative flex min-h-[170px] flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/10">
                    <Wallet className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-white/60">
                      Carteira ativa
                    </p>
                    <p className="text-sm font-medium text-white">Operação de hoje</p>
                  </div>
                </div>
                <Badge variant="solar" size="xs">live</Badge>
              </div>

              <div>
                <div className="text-[64px] font-semibold leading-none text-white">
                  <NumberFlow value={clients.length} />
                </div>
                <p className="mt-1 text-sm text-white/70">
                  {hotClients.length} quente{hotClients.length !== 1 && 's'} · {pendingTasks.length}{' '}
                  tarefa{pendingTasks.length !== 1 && 's'} aberta{pendingTasks.length !== 1 && 's'}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <Sparkline data={sparkData} width={154} height={36} variant="solar" />
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center gap-1.5 rounded-full bg-white px-3 py-2 text-xs font-semibold text-canvas"
                >
                  Abrir
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </Surface>
      </motion.section>

      <motion.section variants={slideUp} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricTile
          href="/dashboard/wallet"
          icon={<Flame className="h-4 w-4" />}
          label="Quentes"
          value={hotClients.length}
          tone="red"
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
        />
        <Surface variant="elevated" padding="md" className="min-h-[132px]">
          <div className="flex h-full flex-col justify-between">
            <span className="text-[11px] font-semibold uppercase text-text-faint">Taxa quente</span>
            <div className="flex items-center justify-between">
              <Ring value={conversionRate} size={76} strokeWidth={6} label={`${conversionRate}%`} />
              <p className="max-w-[88px] text-right text-xs leading-5 text-text-faint">
                clientes em alta intenção
              </p>
            </div>
          </div>
        </Surface>
      </motion.section>

      {myPosition && (
        <motion.section variants={slideUp}>
          <Surface variant="elevated" padding="lg" className="overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-solar/15 text-solar animate-pulse-solar">
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
                          ? 'border-solar/40 bg-solar/15 text-white'
                          : q.status === 'atendendo'
                          ? 'border-white/20 bg-white/[0.08] text-white'
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
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CalendarCheck className="h-4 w-4 text-solar" />
              <h2 className="text-base font-semibold text-text">Agenda de hoje</h2>
              <Badge variant="neutral" size="xs">{todayApts.length}</Badge>
            </div>
            <Link href="/dashboard/appointments" className="text-xs font-semibold text-solar">
              Ver
            </Link>
          </div>

          {todayApts.length === 0 ? (
            <div className="py-4 text-sm text-text-faint">Nenhum agendamento para hoje.</div>
          ) : (
            <div className="space-y-2">
              {todayApts.slice(0, 4).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3"
                >
                  <div className="h-10 w-1 rounded-full bg-solar" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text">{apt.client_name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-faint">
                      <Clock className="h-3 w-3" />
                      <span>{apt.time}</span>
                      {apt.product_name && <span className="truncate">· {apt.product_name}</span>}
                    </div>
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
        <motion.section variants={slideUp} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-solar" />
              <h2 className="text-base font-semibold text-text">Clientes quentes</h2>
            </div>
            <Link href="/dashboard/wallet" className="text-xs font-semibold text-solar">
              Carteira
            </Link>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4">
            {hotClients.slice(0, 8).map((client, i) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...spring, delay: i * 0.04 }}
                className="w-[78vw] shrink-0 sm:w-auto"
              >
                <Surface variant="elevated" padding="md" className="h-full">
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
                  {client.notes && (
                    <p className="mt-3 line-clamp-2 text-[12px] leading-5 text-text-soft">
                      {client.notes}
                    </p>
                  )}
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
                </Surface>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

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
                      Criar agendamento
                    </Button>
                  </Link>
                </div>
              }
            />
          </Surface>
        </motion.section>
      )}
    </motion.div>
  );
}

function MetricTile({
  href,
  icon,
  label,
  value,
  tone = 'neutral',
}: {
  href: string;
  icon: ReactNode;
  label: string;
  value: number;
  tone?: 'neutral' | 'red';
}) {
  return (
    <Link href={href}>
      <Surface interactive variant="elevated" padding="md" className="min-h-[132px]">
        <div className="flex h-full flex-col justify-between">
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border',
              tone === 'red'
                ? 'border-solar/30 bg-solar/15 text-solar'
                : 'border-white/[0.12] bg-white/[0.055] text-white'
            )}
          >
            {icon}
          </div>
          <div>
            <div className="text-3xl font-semibold text-text">
              <NumberFlow value={value} />
            </div>
            <p className="mt-1 text-[11px] font-semibold uppercase text-text-faint">{label}</p>
          </div>
        </div>
      </Surface>
    </Link>
  );
}

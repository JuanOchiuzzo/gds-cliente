'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  CalendarCheck,
  Flame,
  ListTodo,
  Phone,
  Plus,
  Sparkles,
  UserCircle,
  Users,
  Wallet as WalletIcon,
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { NumberFlow } from '@/components/ui/number-flow';
import { Ring } from '@/components/ui/ring';
import { Sparkline } from '@/components/ui/sparkline';
import { useAuth } from '@/lib/auth-context';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useQueue } from '@/lib/hooks/use-queue';
import { useWallet } from '@/lib/hooks/use-wallet';
import { cn, generateWhatsAppLink, getFirstName } from '@/lib/utils';

const sparkData = [12, 18, 16, 25, 22, 34, 30, 44, 41, 52, 49, 61];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function DashboardPage() {
  const { profile } = useAuth();
  const { clients, tasks } = useWallet();
  const { appointments } = useAppointments();
  const { myPosition } = useQueue();

  const firstName = getFirstName(profile?.full_name, 'Forjador');
  const pendingTasks = tasks.filter((t) => !t.completed);
  const hotClients = clients.filter((c) => c.temperature === 'quente');
  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.date === today);

  const hour = new Date().getHours();
  const greeting =
    hour < 6 ? 'Boa madrugada' : hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const conversionRate = clients.length
    ? Math.round((hotClients.length / clients.length) * 100)
    : 0;
  const momentum = Math.min(
    100,
    Math.round(conversionRate * 0.55 + pendingTasks.length * 4 + todayApts.length * 9),
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-5 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:space-y-0"
    >
      {/* LEFT COLUMN */}
      <div className="space-y-5">
        {/* HERO */}
        <motion.section variants={item}>
          <Card variant="glass" padding="none" className="relative isolate overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -top-20 -right-20 h-[260px] w-[260px] rounded-full bg-iris/30 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-[220px] w-[220px] rounded-full bg-cyanx/20 blur-3xl" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
                    {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                  </p>
                  <h1 className="mt-2 font-display text-[32px] leading-[1.05] tracking-[-0.02em] text-fg sm:text-[40px]">
                    {greeting},
                    <br />
                    <span className="text-iris-gradient">{firstName}</span>
                  </h1>
                </div>
                <Link href="/dashboard/ai">
                  <Button size="icon" variant="glass" aria-label="Abrir Forge AI">
                    <Sparkles className="h-5 w-5 text-iris-hi" />
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
                    Pulso comercial
                  </p>
                  <div className="mt-1 flex items-end gap-2">
                    <span className="font-display text-[48px] leading-none text-fg sm:text-[64px]">
                      <NumberFlow value={clients.length} />
                    </span>
                    <span className="pb-1.5 text-xs text-fg-muted">clientes</span>
                  </div>
                  <Sparkline data={sparkData} width={180} height={42} gradient="iris" />
                </div>
                <Ring value={momentum} size={96} stroke={8} label={`${momentum}%`} />
              </div>
            </div>
          </Card>
        </motion.section>

        {/* METRICS */}
        <motion.section variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricTile
            href="/dashboard/wallet"
            icon={<Flame className="h-4 w-4" />}
            label="Quentes"
            value={hotClients.length}
            tone="hot"
          />
          <MetricTile
            href="/dashboard/wallet"
            icon={<ListTodo className="h-4 w-4" />}
            label="Tarefas"
            value={pendingTasks.length}
            tone="iris"
          />
          <MetricTile
            href="/dashboard/appointments"
            icon={<CalendarCheck className="h-4 w-4" />}
            label="Hoje"
            value={todayApts.length}
            tone="cyan"
          />
          <MetricTile
            href="/dashboard/wallet"
            icon={<WalletIcon className="h-4 w-4" />}
            label="Taxa quente"
            value={conversionRate}
            suffix="%"
            tone="ok"
          />
        </motion.section>

        {/* QUICK ACTIONS */}
        <motion.section variants={item} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: '/dashboard/wallet', label: 'Novo cliente', icon: Plus },
            { href: '/dashboard/appointments', label: 'Agendar', icon: CalendarCheck },
            { href: '/dashboard/plantao', label: 'Plantão', icon: UserCircle },
            { href: '/dashboard/ai', label: 'Perguntar', icon: Sparkles },
          ].map((a) => (
            <Link key={a.href} href={a.href}>
              <Card variant="solid" padding="sm" interactive className="min-h-[76px] flex items-center gap-3 px-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,rgba(157,140,255,0.25),rgba(96,222,255,0.15))] border border-white/10">
                  <a.icon className="h-[18px] w-[18px] text-iris-hi" />
                </span>
                <span className="truncate text-sm font-semibold text-fg">{a.label}</span>
              </Card>
            </Link>
          ))}
        </motion.section>

        {clients.length === 0 && todayApts.length === 0 && !myPosition && (
          <motion.section variants={item}>
            <Card variant="glass" padding="xl">
              <EmptyState
                icon={<Sparkles className="h-5 w-5" />}
                title="Bem-vindo ao StandForge"
                description="Comece adicionando clientes à sua carteira e agendando visitas."
                action={
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href="/dashboard/wallet">
                      <Button size="md">
                        <Plus className="h-4 w-4" />
                        Adicionar cliente
                      </Button>
                    </Link>
                    <Link href="/dashboard/appointments">
                      <Button variant="secondary" size="md">
                        <CalendarCheck className="h-4 w-4" />
                        Criar visita
                      </Button>
                    </Link>
                  </div>
                }
              />
            </Card>
          </motion.section>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-5">
        {myPosition && (
          <motion.section variants={item}>
            <Card variant="strong" padding="lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-ok/15 text-ok animate-pulse-ring">
                    <UserCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
                      Plantão
                    </p>
                    <h2 className="truncate text-base font-semibold text-fg">
                      {myPosition.stand_name || 'Stand'}
                    </h2>
                  </div>
                </div>
                <Badge
                  variant={myPosition.status === 'atendendo' ? 'ok' : myPosition.status === 'ausente' ? 'warn' : 'iris'}
                  size="sm"
                >
                  {myPosition.status === 'atendendo'
                    ? 'Atendendo'
                    : myPosition.status === 'ausente'
                    ? 'Ausente'
                    : `Posição ${myPosition.position}`}
                </Badge>
              </div>
            </Card>
          </motion.section>
        )}

        {/* Agenda de hoje */}
        <motion.section variants={item}>
          <Card variant="solid" padding="lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
                  Agenda · hoje
                </p>
                <h2 className="mt-1 text-base font-semibold">
                  {todayApts.length} {todayApts.length === 1 ? 'visita' : 'visitas'}
                </h2>
              </div>
              <Link href="/dashboard/appointments">
                <Button variant="ghost" size="sm">
                  Ver tudo <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {todayApts.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-line bg-white/[0.02] py-8 text-center text-sm text-fg-muted">
                Nenhuma visita agendada para hoje.
              </div>
            ) : (
              <ul className="space-y-2">
                {todayApts.slice(0, 4).map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-[14px] border border-line bg-white/[0.02] p-3"
                  >
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#2a1f6b,#0f1830)] text-iris-hi">
                      <span className="text-[10px] leading-none font-medium text-fg-muted">
                        {a.time.split(':')[0]}h
                      </span>
                      <span className="text-xs font-bold">{a.time.split(':')[1]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{a.client_name}</p>
                      <p className="truncate text-xs text-fg-muted">{a.stand_name}</p>
                    </div>
                    {a.client_phone && (
                      <a
                        href={generateWhatsAppLink(
                          a.client_phone,
                          `Olá ${a.client_name}, confirmando sua visita às ${a.time}.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ok/15 text-ok press"
                        aria-label="WhatsApp"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </motion.section>

        {/* Hot clients */}
        <motion.section variants={item}>
          <Card variant="solid" padding="lg">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
                  Clientes quentes
                </p>
                <h2 className="mt-1 text-base font-semibold">Prioridade máxima</h2>
              </div>
              <Link href="/dashboard/wallet">
                <Button variant="ghost" size="sm">
                  Abrir <ArrowUpRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {hotClients.length === 0 ? (
              <div className="rounded-[14px] border border-dashed border-line bg-white/[0.02] py-8 text-center text-sm text-fg-muted">
                Nenhum cliente quente no momento.
              </div>
            ) : (
              <ul className="space-y-2">
                {hotClients.slice(0, 4).map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 rounded-[14px] border border-line bg-white/[0.02] p-3"
                  >
                    <Avatar name={c.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{c.name}</p>
                      <p className="truncate text-xs text-fg-muted">
                        {c.interested_product || 'Interesse pendente'}
                      </p>
                    </div>
                    <Badge variant="hot" size="sm">
                      <Flame className="h-3 w-3" /> quente
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </motion.section>
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
  tone = 'iris',
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  tone?: 'iris' | 'hot' | 'cyan' | 'ok';
}) {
  const toneRing: Record<string, string> = {
    iris: 'text-iris-hi bg-iris/15',
    hot: 'text-hot bg-hot/15',
    cyan: 'text-cyanx bg-cyanx/15',
    ok: 'text-ok bg-ok/15',
  };
  return (
    <Link href={href}>
      <Card variant="solid" padding="md" interactive className="flex min-h-[108px] flex-col justify-between gap-2">
        <div className="flex items-start justify-between">
          <span
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-[10px]',
              toneRing[tone],
            )}
          >
            {icon}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-faint">
            {label}
          </p>
          <p className="mt-0.5 truncate font-display text-2xl leading-tight text-fg">
            <NumberFlow value={value} />
            {suffix}
          </p>
        </div>
      </Card>
    </Link>
  );
}

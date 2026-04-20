'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  TrendingUp,
  Flame,
  ListTodo,
  CalendarCheck,
  Clock,
  Phone,
  MessageCircle,
  Sparkles,
  ArrowUpRight,
  UserCircle,
  Plus,
} from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { NumberFlow } from '@/components/ui/number-flow';
import { Sparkline } from '@/components/ui/sparkline';
import { Ring } from '@/components/ui/ring';
import { EmptyState } from '@/components/ui/empty-state';
import { useAuth } from '@/lib/auth-context';
import { useWallet } from '@/lib/hooks/use-wallet';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useQueue } from '@/lib/hooks/use-queue';
import { generateWhatsAppLink, getFirstName } from '@/lib/utils';
import { staggerParent, slideUp, spring } from '@/lib/motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const greeting = hour < 6 ? 'Boa madrugada' : hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  // Fake sparkline data (in real app, derive from activities)
  const sparkData = [12, 18, 14, 22, 19, 28, 24, 32, 30, 38, 35, 42];
  const conversionRate = clients.length
    ? Math.round((hotClients.length / clients.length) * 100)
    : 0;

  return (
    <motion.div
      variants={staggerParent(0.06)}
      initial="hidden"
      animate="visible"
      className="max-w-[1400px] mx-auto space-y-6"
    >
      {/* Hero greeting */}
      <motion.div variants={slideUp} className="pt-2 lg:pt-6">
        <h1 className="font-display italic text-4xl lg:text-5xl tracking-tight">
          {greeting}, <span className="not-italic font-sans text-solar-gradient">{firstName}</span>.
        </h1>
        <p className="mt-2 text-sm text-text-faint font-mono uppercase tracking-widest">
          {format(new Date(), "EEEE · dd 'de' MMMM", { locale: ptBR })}
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="grid grid-cols-12 gap-4 auto-rows-[minmax(0,auto)]">
        {/* Hero metric — Carteira */}
        <motion.div variants={slideUp} className="col-span-12 lg:col-span-6">
          <Surface variant="elevated" padding="lg" className="relative overflow-hidden min-h-[240px] h-full">
            <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-solar/15 blur-[80px] pointer-events-none" />
            <div className="relative flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-solar/15 border border-solar/30 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-solar" />
                  </div>
                  <span className="text-xs font-medium text-text-faint uppercase tracking-wider">
                    Sua carteira
                  </span>
                </div>
                <Badge variant="solar" size="xs">live</Badge>
              </div>

              <div className="flex-1 flex flex-col justify-center py-4">
                <div className="text-[56px] lg:text-[72px] font-sans font-medium leading-none tracking-tighter text-text">
                  <NumberFlow value={clients.length} />
                </div>
                <p className="mt-1 text-sm text-text-soft">
                  clientes ativos · {hotClients.length} quente{hotClients.length !== 1 && 's'}
                </p>
              </div>

              <div className="flex items-end justify-between gap-4">
                <Sparkline data={sparkData} width={180} height={40} variant="solar" />
                <Link
                  href="/dashboard/wallet"
                  className="flex items-center gap-1.5 text-sm font-medium text-text-soft hover:text-solar transition-colors group"
                >
                  Abrir carteira
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </Surface>
        </motion.div>

        {/* KPI stack */}
        <motion.div variants={slideUp} className="col-span-6 lg:col-span-3 grid grid-rows-2 gap-4">
          <Surface variant="elevated" padding="md" className="flex flex-col justify-between min-h-[112px]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-hot/15 border border-hot/30 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-hot" />
              </div>
              <span className="text-[11px] font-medium text-text-faint uppercase tracking-wider">
                Quentes
              </span>
            </div>
            <div className="text-3xl font-sans font-medium text-text tracking-tight">
              <NumberFlow value={hotClients.length} />
            </div>
          </Surface>
          <Surface variant="elevated" padding="md" className="flex flex-col justify-between min-h-[112px]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-aurora-1/15 border border-aurora-1/30 flex items-center justify-center">
                <ListTodo className="w-3.5 h-3.5 text-aurora-1" />
              </div>
              <span className="text-[11px] font-medium text-text-faint uppercase tracking-wider">
                Tarefas
              </span>
            </div>
            <div className="text-3xl font-sans font-medium text-text tracking-tight">
              <NumberFlow value={pendingTasks.length} />
            </div>
          </Surface>
        </motion.div>

        {/* Conversion ring */}
        <motion.div variants={slideUp} className="col-span-6 lg:col-span-3">
          <Surface variant="elevated" padding="md" className="flex flex-col justify-between min-h-full">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-text-faint uppercase tracking-wider">
                Taxa quente
              </span>
            </div>
            <div className="flex-1 flex items-center justify-center py-2">
              <Ring value={conversionRate} size={110} strokeWidth={8} label={`${conversionRate}%`} />
            </div>
            <p className="text-[11px] text-text-faint text-center">dos seus clientes</p>
          </Surface>
        </motion.div>

        {/* Queue position */}
        {myPosition && (
          <motion.div variants={slideUp} className="col-span-12 lg:col-span-7">
            <Surface variant="elevated" padding="lg" className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-solar/5 to-transparent pointer-events-none" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-md bg-solar/15 border border-solar/30 flex items-center justify-center animate-pulse-solar">
                      <UserCircle className="w-4 h-4 text-solar" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-text-faint uppercase tracking-wider">
                        Fila de Plantão
                      </p>
                      <p className="text-base font-medium text-text">
                        {myPosition.stand_name || 'Stand'}
                      </p>
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
                    size="md"
                  >
                    {myPosition.status === 'atendendo'
                      ? 'Atendendo agora'
                      : myPosition.position <= 2
                      ? `Você é o próximo`
                      : `Posição ${myPosition.position}`}
                  </Badge>
                </div>

                {queue.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
                    {queue.slice(0, 8).map((q) => {
                      const me = q.agent_id === profile?.id;
                      return (
                        <div
                          key={q.id}
                          className={`flex items-center gap-2 px-3 h-8 rounded-full text-xs whitespace-nowrap border flex-shrink-0 ${
                            me
                              ? 'bg-solar/15 border-solar/40 text-solar'
                              : q.status === 'atendendo'
                              ? 'bg-info/10 border-info/30 text-info'
                              : 'bg-surface-1 border-border-strong text-text-soft'
                          }`}
                        >
                          <span className="font-mono">{q.position}º</span>
                          <span>{getFirstName(q.agent_name, 'Corretor')}</span>
                          {me && <span className="w-1.5 h-1.5 rounded-full bg-solar animate-pulse" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Surface>
          </motion.div>
        )}

        {/* Today appointments */}
        <motion.div
          variants={slideUp}
          className={`col-span-12 ${myPosition ? 'lg:col-span-5' : 'lg:col-span-8'}`}
        >
          <Surface variant="elevated" padding="lg" className="h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 text-aurora-2" />
                <h3 className="text-sm font-medium text-text">Hoje</h3>
                <Badge variant="info" size="xs">
                  {todayApts.length}
                </Badge>
              </div>
              <Link
                href="/dashboard/appointments"
                className="text-[11px] text-solar font-medium hover:underline underline-offset-4"
              >
                Ver tudo
              </Link>
            </div>

            {todayApts.length === 0 ? (
              <div className="py-6 text-center text-sm text-text-faint">
                Nenhum agendamento para hoje.
              </div>
            ) : (
              <div className="space-y-2">
                {todayApts.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center gap-3 p-3 rounded-md bg-surface-1 border border-border hover:border-border-glow transition-colors"
                  >
                    <div className="w-1 h-8 rounded-full bg-solar" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{apt.client_name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-faint">
                        <Clock className="w-3 h-3" /> {apt.time}
                        {apt.product_name && <span>· {apt.product_name}</span>}
                      </div>
                    </div>
                    <Badge
                      variant={apt.status === 'confirmado' ? 'success' : 'warning'}
                      size="xs"
                    >
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Surface>
        </motion.div>

        {/* Hot clients */}
        {hotClients.length > 0 && (
          <motion.div variants={slideUp} className="col-span-12">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-hot" />
                <h3 className="font-display italic text-xl text-text">Clientes quentes</h3>
                <Badge variant="hot" size="xs">
                  {hotClients.length}
                </Badge>
              </div>
              <Link
                href="/dashboard/wallet"
                className="text-[11px] text-solar font-medium hover:underline underline-offset-4"
              >
                Carteira completa
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {hotClients.slice(0, 8).map((client, i) => (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...spring, delay: i * 0.04 }}
                >
                  <Surface variant="elevated" padding="md" className="group hover:border-border-glow transition-all">
                    <div className="flex items-start gap-3">
                      <Avatar name={client.name} size="md" status="online" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">{client.name}</p>
                        <p className="text-[11px] text-text-faint truncate">
                          {client.interested_product || 'Sem produto'}
                        </p>
                      </div>
                      <span className="text-base">🔥</span>
                    </div>
                    {client.notes && (
                      <p className="mt-2.5 text-[11px] text-text-soft line-clamp-2">
                        {client.notes}
                      </p>
                    )}
                    {client.phone && (
                      <div className="mt-3 flex gap-2">
                          <a
                            href={generateWhatsAppLink(
                              client.phone,
                              `Olá ${getFirstName(client.name)}!`
                            )}
                            target="_blank"
                            rel="noopener"
                          className="flex-1 flex items-center justify-center gap-1 h-8 rounded-md text-[11px] font-medium bg-success/10 text-success border border-success/25 hover:bg-success/15 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                        <a
                          href={`tel:${client.phone}`}
                          className="flex-1 flex items-center justify-center gap-1 h-8 rounded-md text-[11px] font-medium bg-info/10 text-info border border-info/25 hover:bg-info/15 transition-colors"
                        >
                          <Phone className="w-3 h-3" /> Ligar
                        </a>
                      </div>
                    )}
                  </Surface>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {clients.length === 0 && todayApts.length === 0 && !myPosition && (
          <motion.div variants={slideUp} className="col-span-12">
            <Surface variant="elevated" padding="xl">
              <EmptyState
                icon={<Sparkles className="w-6 h-6" />}
                title="Bem-vindo ao NEXUS ORBIT"
                description="Comece adicionando clientes à sua carteira e criando agendamentos."
                action={
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/dashboard/wallet">
                      <Button variant="solar">
                        <Plus className="w-4 h-4" />
                        Adicionar cliente
                      </Button>
                    </Link>
                    <Link href="/dashboard/appointments">
                      <Button variant="outline">
                        <CalendarCheck className="w-4 h-4" />
                        Criar agendamento
                      </Button>
                    </Link>
                  </div>
                }
              />
            </Surface>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

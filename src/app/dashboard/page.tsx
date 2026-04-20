'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, Eye, Target, DollarSign,
  ArrowUpRight, ArrowDownRight, ChevronRight, Sparkles,
  Clock, MapPin, Flame, ListTodo, CalendarCheck, UserCircle, Plus,
  Phone, MessageCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { useWallet } from '@/lib/hooks/use-wallet';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useQueue } from '@/lib/hooks/use-queue';
import { formatCurrency, generateWhatsAppLink } from '@/lib/utils';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } };

export default function DashboardPage() {
  const { profile } = useAuth();
  const { clients, tasks, loading: walletLoading } = useWallet();
  const { appointments, loading: aptsLoading } = useAppointments();
  const { queue, myPosition, loading: queueLoading } = useQueue();

  const firstName = profile?.full_name?.split(' ')[0] || 'Usuário';
  const pendingTasks = tasks.filter((t) => !t.completed);
  const hotClients = clients.filter((c) => c.temperature === 'quente');

  const today = new Date().toISOString().split('T')[0];
  const todayApts = appointments.filter((a) => a.date === today);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 lg:space-y-6">
      {/* Greeting */}
      <motion.div variants={fadeUp}>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">
          Olá, {firstName} 👋
        </h1>
        <p className="text-xs lg:text-sm text-[var(--sf-text-tertiary)] mt-0.5">
          {format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </motion.div>

      {/* Fila de Plantão */}
      {myPosition && (
        <motion.div variants={fadeUp}>
          <GlassCard hover={false} className="!p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs text-[var(--sf-text-tertiary)] font-medium">Fila de Plantão</p>
                  <p className="text-sm font-bold text-[var(--sf-text-primary)]">{myPosition.stand_name || 'Stand'}</p>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                myPosition.position <= 2
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                  : myPosition.status === 'atendendo'
                  ? 'bg-blue-100 text-blue-700 dark:bg-cyan-500/15 dark:text-cyan-400'
                  : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-400'
              }`}>
                {myPosition.position <= 2 && myPosition.status !== 'atendendo' && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                {myPosition.status === 'atendendo' ? 'Atendendo' : myPosition.position <= 2 ? 'Você é o próximo!' : `Posição ${myPosition.position}`}
              </div>
            </div>
            {queue.length > 0 && (
              <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
                {queue.map((q) => (
                  <div key={q.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border ${
                    q.agent_id === profile?.id
                      ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300 font-semibold'
                      : q.status === 'atendendo'
                      ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300'
                      : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
                  }`}>
                    <span className="font-bold">{q.position}º</span>
                    <span>{(q.agent_name || '').split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div variants={fadeUp}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { label: 'Carteira', value: clients.length, icon: TrendingUp, suffix: ' clientes' },
            { label: 'Quentes', value: hotClients.length, icon: Flame, suffix: '' },
            { label: 'Tarefas', value: pendingTasks.length, icon: ListTodo, suffix: ' pendentes' },
            { label: 'Agendamentos', value: todayApts.length, icon: CalendarCheck, suffix: ' hoje' },
          ].map((kpi) => (
            <GlassCard key={kpi.label} hover={false} className="!p-3.5">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-xl bg-blue-500/8 dark:bg-cyan-500/10 border border-blue-500/15 dark:border-cyan-500/20">
                  <kpi.icon className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                </div>
              </div>
              <div className="text-lg font-bold text-[var(--sf-text-primary)]">
                <AnimatedCounter value={kpi.value} />
              </div>
              <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">{kpi.label}{kpi.suffix}</p>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* Agendamentos do dia */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Hoje</h3>
            <span className="text-[10px] bg-blue-100 dark:bg-cyan-500/15 text-blue-700 dark:text-cyan-300 px-2 py-0.5 rounded-full font-medium">
              {todayApts.length} agendamento{todayApts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <Link href="/dashboard/appointments" className="text-[11px] text-blue-600 dark:text-cyan-400 font-medium flex items-center gap-0.5">
            Ver agenda <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {todayApts.length === 0 ? (
          <GlassCard hover={false} className="!p-6 text-center">
            <CalendarCheck className="w-8 h-8 mx-auto text-[var(--sf-text-muted)] mb-2" />
            <p className="text-sm text-[var(--sf-text-tertiary)]">Nenhum agendamento para hoje</p>
            <Link href="/dashboard/appointments">
              <button className="mt-3 text-xs text-[var(--sf-accent)] font-medium">+ Criar agendamento</button>
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {todayApts.map((apt) => (
              <GlassCard key={apt.id} hover={false} className="!p-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-10 rounded-full bg-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{apt.client_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-[var(--sf-text-tertiary)]">
                        <Clock className="w-3 h-3" /> {apt.time}
                      </span>
                      {apt.product_name && (
                        <span className="text-[11px] text-[var(--sf-text-tertiary)]">{apt.product_name}</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={apt.status === 'confirmado' ? 'emerald' : 'amber'} className="!text-[9px]">{apt.status}</Badge>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </motion.div>

      {/* Tarefas Pendentes */}
      {pendingTasks.length > 0 && (
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <ListTodo className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Tarefas Pendentes</h3>
              <span className="text-[10px] bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full font-medium">
                {pendingTasks.length}
              </span>
            </div>
            <Link href="/dashboard/wallet" className="text-[11px] text-blue-600 dark:text-cyan-400 font-medium flex items-center gap-0.5">
              Carteira <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {pendingTasks.slice(0, 3).map((task) => {
              const typeIcons: Record<string, string> = { ligar: '📞', agendar_visita: '📅', enviar_proposta: '📄', follow_up: '🔄', outro: '📋' };
              const isOverdue = new Date(task.due_date) < new Date();
              return (
                <div key={task.id} className={`flex items-center gap-3 p-3 rounded-2xl border ${
                  isOverdue ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20' : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
                }`}>
                  <span className="text-base">{typeIcons[task.type] || '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--sf-text-primary)]">{task.description}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">
                      {task.client_name} {isOverdue && '⚠️ atrasada'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Clientes Quentes */}
      {hotClients.length > 0 && (
        <motion.div variants={fadeUp}>
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Clientes Quentes</h3>
            </div>
            <Link href="/dashboard/wallet" className="text-[11px] text-blue-600 dark:text-cyan-400 font-medium flex items-center gap-0.5">
              Ver carteira <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
            {hotClients.map((client) => (
              <div key={client.id} className="flex-shrink-0 w-[220px] p-3.5 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={client.name} size="sm" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--sf-text-primary)] truncate">{client.name}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">{client.interested_product || 'Sem produto'}</p>
                  </div>
                  <span className="ml-auto text-base">🔥</span>
                </div>
                {client.notes && <p className="text-[10px] text-[var(--sf-text-tertiary)] line-clamp-2 mb-2">{client.notes}</p>}
                {client.phone && (
                  <div className="flex gap-1.5">
                    <a href={generateWhatsAppLink(client.phone, `Olá ${client.name.split(' ')[0]}!`)} target="_blank" rel="noopener"
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-medium bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                      <MessageCircle className="w-3 h-3" /> WhatsApp
                    </a>
                    <a href={`tel:${client.phone}`}
                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-medium bg-blue-100 dark:bg-cyan-500/10 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-cyan-500/20">
                      <Phone className="w-3 h-3" /> Ligar
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state se não tem nada */}
      {clients.length === 0 && todayApts.length === 0 && (
        <motion.div variants={fadeUp}>
          <GlassCard hover={false} className="!p-8 text-center">
            <Sparkles className="w-12 h-12 mx-auto text-[var(--sf-text-muted)] mb-3" />
            <h3 className="text-lg font-semibold text-[var(--sf-text-primary)]">Bem-vindo ao StandForge!</h3>
            <p className="text-sm text-[var(--sf-text-tertiary)] mt-2 max-w-md mx-auto">
              Comece adicionando clientes à sua carteira e criando agendamentos.
            </p>
            <div className="flex gap-3 justify-center mt-4">
              <Link href="/dashboard/wallet">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 text-white text-sm font-medium rounded-2xl">
                  <Plus className="w-4 h-4" /> Adicionar Cliente
                </button>
              </Link>
              <Link href="/dashboard/appointments">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] text-[var(--sf-text-secondary)] text-sm font-medium rounded-2xl">
                  <CalendarCheck className="w-4 h-4" /> Criar Agendamento
                </button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  );
}

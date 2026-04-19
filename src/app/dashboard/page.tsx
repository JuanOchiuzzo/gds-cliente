'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Target, DollarSign, Eye,
  ArrowUpRight, ArrowDownRight, ChevronRight, Sparkles,
  Clock, MapPin, Phone, MessageCircle, Flame, Thermometer,
  ListTodo, CalendarCheck, UserCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { ProgressBar } from '@/components/ui/progress-bar';
import {
  myPerformance, todayAppointments, queuePositions,
  walletClients, clientTasks, aiInsights, agents, appointments,
} from '@/lib/mock-data';
import { formatCurrency, timeAgo, generateWhatsAppLink } from '@/lib/utils';
import { FunnelChart } from '@/components/dashboard/funnel-chart';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { StandMap } from '@/components/dashboard/stand-map';
import { funnelData, salesChartData } from '@/lib/mock-data';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } };

const perf = myPerformance;
const topAgents = [...agents].sort((a, b) => b.monthly_sales - a.monthly_sales).slice(0, 5);
const pendingTasks = clientTasks.filter((t) => !t.completed);
const myQueue = queuePositions.find((q) => q.agent_id === 'a1');

function delta(current: number, previous: number) {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

export default function DashboardPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 lg:space-y-6">
      {/* ── Greeting ── */}
      <motion.div variants={fadeUp}>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">
          Olá, Ricardo 👋
        </h1>
        <p className="text-xs lg:text-sm text-[var(--sf-text-tertiary)] mt-0.5">
          {format(new Date(2026, 3, 19), "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </motion.div>

      {/* ── FILA DE PLANTÃO (se escalado) ── */}
      {myQueue && (
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
                  <p className="text-sm font-bold text-[var(--sf-text-primary)]">{myQueue.stand_name.replace('Stand ', '')}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${
                  myQueue.status === 'aguardando' && myQueue.position === 2
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                    : myQueue.status === 'atendendo'
                    ? 'bg-blue-100 text-blue-700 dark:bg-cyan-500/15 dark:text-cyan-400'
                    : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-400'
                }`}>
                  {myQueue.position === 2 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                  {myQueue.position === 2 ? 'Você é o próximo!' : myQueue.status === 'atendendo' ? 'Atendendo' : `Posição ${myQueue.position}`}
                </div>
              </div>
            </div>
            {/* Queue visualization */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
              {queuePositions.map((q) => (
                <div
                  key={q.agent_id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap border ${
                    q.agent_id === 'a1'
                      ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300 font-semibold'
                      : q.status === 'atendendo'
                      ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-300'
                      : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
                  }`}
                >
                  <span className="font-bold">{q.position}º</span>
                  <span>{q.agent_name.split(' ')[0]}</span>
                  {q.status === 'atendendo' && <span className="text-[9px] opacity-70">🔴</span>}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* ── MINHA PERFORMANCE — comparação mês atual vs anterior ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Minha Performance</h3>
          <span className="text-[10px] text-[var(--sf-text-tertiary)]">Abril vs Março</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { label: 'Vendas', current: perf.current_month.sales, prev: perf.previous_month.sales, icon: TrendingUp, suffix: ' un' },
            { label: 'Receita', current: perf.current_month.revenue, prev: perf.previous_month.revenue, icon: DollarSign, isCurrency: true },
            { label: 'Visitas', current: perf.current_month.visits, prev: perf.previous_month.visits, icon: Eye },
            { label: 'Conversão', current: perf.current_month.conversion_rate, prev: perf.previous_month.conversion_rate, icon: Target, suffix: '%', isPercent: true },
          ].map((kpi) => {
            const change = delta(kpi.current, kpi.prev);
            const isPositive = change >= 0;
            return (
              <GlassCard key={kpi.label} hover={false} className="!p-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-xl bg-blue-500/8 dark:bg-cyan-500/10 border border-blue-500/15 dark:border-cyan-500/20">
                    <kpi.icon className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  </div>
                  {change !== 0 && (
                    <span className={`flex items-center gap-0.5 text-[10px] font-semibold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isPositive ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                      {Math.abs(change).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="text-lg font-bold text-[var(--sf-text-primary)]">
                  {kpi.isCurrency ? (
                    <AnimatedCounter value={kpi.current} formatFn={(n) => formatCurrency(n)} />
                  ) : kpi.isPercent ? (
                    <AnimatedCounter value={kpi.current} suffix="%" />
                  ) : (
                    <AnimatedCounter value={kpi.current} suffix={kpi.suffix} />
                  )}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] text-[var(--sf-text-tertiary)]">{kpi.label}</p>
                  <p className="text-[10px] text-[var(--sf-text-muted)]">
                    ant: {kpi.isCurrency ? formatCurrency(kpi.prev) : kpi.isPercent ? `${kpi.prev}%` : kpi.prev}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </motion.div>

      {/* ── AGENDAMENTOS DO DIA ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Hoje</h3>
            <span className="text-[10px] bg-blue-100 dark:bg-cyan-500/15 text-blue-700 dark:text-cyan-300 px-2 py-0.5 rounded-full font-medium">
              {todayAppointments.length} agendamentos
            </span>
          </div>
          <Link href="/dashboard/calendar" className="text-[11px] text-blue-600 dark:text-cyan-400 font-medium flex items-center gap-0.5">
            Ver agenda <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-2">
          {todayAppointments.map((apt) => (
            <GlassCard key={apt.id} hover={false} className="!p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-1 h-10 rounded-full bg-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--sf-text-primary)]">Visita — {apt.client_name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-[var(--sf-text-tertiary)]">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </span>
                    {apt.stand_name && (
                      <span className="flex items-center gap-1 text-[11px] text-[var(--sf-text-tertiary)]">
                        <MapPin className="w-3 h-3" />
                        {apt.stand_name.replace('Stand ', '')}
                      </span>
                    )}
                  </div>
                </div>
                <Badge variant={apt.status === 'confirmado' ? 'emerald' : 'amber'} className="!text-[9px]">
                  {apt.status}
                </Badge>
              </div>
            </GlassCard>
          ))}
        </div>
      </motion.div>

      {/* ── TAREFAS PENDENTES ── */}
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
            const typeIcons: Record<string, string> = {
              ligar: '📞', agendar_visita: '📅', enviar_proposta: '📄', follow_up: '🔄', outro: '📋',
            };
            const typeLabels: Record<string, string> = {
              ligar: 'Ligar', agendar_visita: 'Agendar Visita', enviar_proposta: 'Enviar Proposta', follow_up: 'Follow-up', outro: 'Outro',
            };
            const isOverdue = new Date(task.due_date) < new Date(2026, 3, 19, 12);
            return (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${
                  isOverdue
                    ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20'
                    : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
                }`}
              >
                <span className="text-base">{typeIcons[task.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--sf-text-primary)]">{task.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-[var(--sf-text-tertiary)]">{task.client_name}</span>
                    <span className="text-[10px] text-[var(--sf-text-muted)]">·</span>
                    <span className={`text-[10px] font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-[var(--sf-text-tertiary)]'}`}>
                      {format(new Date(task.due_date), 'HH:mm')}
                      {isOverdue && ' ⚠️ atrasada'}
                    </span>
                  </div>
                </div>
                <Badge variant={isOverdue ? 'red' : 'zinc'} className="!text-[9px]">{typeLabels[task.type]}</Badge>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── CARTEIRA — clientes quentes ── */}
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
          {walletClients.filter((c) => c.temperature === 'quente').map((client) => (
            <div
              key={client.id}
              className="flex-shrink-0 w-[220px] p-3.5 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-2xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Avatar name={client.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--sf-text-primary)] truncate">{client.name}</p>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)]">{client.interested_product || 'Sem produto'}</p>
                </div>
                <span className="ml-auto text-base">🔥</span>
              </div>
              <p className="text-[10px] text-[var(--sf-text-tertiary)] line-clamp-2 mb-2">{client.notes}</p>
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
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── AI INSIGHTS ── */}
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Nexus Insights</h3>
          </div>
          <Link href="/dashboard/ai" className="text-[11px] text-blue-600 dark:text-cyan-400 font-medium flex items-center gap-0.5">
            Ver todos <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {aiInsights.slice(0, 4).map((insight) => {
            const colors = {
              success: 'from-emerald-500/10 to-emerald-500/5 border-emerald-200 dark:border-emerald-500/20',
              warning: 'from-amber-500/10 to-amber-500/5 border-amber-200 dark:border-amber-500/20',
              info: 'from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-500/20',
              action: 'from-violet-500/10 to-violet-500/5 border-violet-200 dark:border-violet-500/20',
            };
            const icons = { success: '🎯', warning: '⚠️', info: '💡', action: '🚀' };
            return (
              <div key={insight.id} className={`flex-shrink-0 w-[260px] p-3.5 rounded-2xl border bg-gradient-to-br ${colors[insight.type]}`}>
                <div className="flex items-start gap-2">
                  <span className="text-base">{icons[insight.type]}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--sf-text-primary)] leading-snug">{insight.title}</p>
                    <p className="text-[11px] text-[var(--sf-text-secondary)] mt-1 leading-relaxed line-clamp-2">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── DESKTOP: Charts + Map + Rankings (hidden on mobile, same as before) ── */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-4">
        <motion.div variants={fadeUp}>
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Funil de Vendas</h3>
            <FunnelChart data={funnelData} />
          </GlassCard>
        </motion.div>
        <motion.div variants={fadeUp}>
          <GlassCard hover={false}>
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Vendas vs Meta</h3>
            <SalesChart data={salesChartData} />
          </GlassCard>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="hidden lg:block">
        <GlassCard hover={false} padding={false} className="overflow-hidden">
          <div className="p-6 pb-0">
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Mapa de Stands</h3>
          </div>
          <div className="h-[400px]">
            <StandMap />
          </div>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

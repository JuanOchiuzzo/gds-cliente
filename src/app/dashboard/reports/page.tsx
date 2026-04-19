'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useLeads } from '@/lib/hooks/use-leads';
import { useStands } from '@/lib/hooks/use-stands';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useWallet } from '@/lib/hooks/use-wallet';
import { formatCurrency } from '@/lib/utils';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };

export default function ReportsPage() {
  const { leads, loading: leadsLoading } = useLeads();
  const { stands, loading: standsLoading } = useStands();
  const { appointments, loading: aptsLoading } = useAppointments();
  const { clients, tasks } = useWallet();

  const loading = leadsLoading || standsLoading || aptsLoading;

  const totalLeads = leads.length;
  const leadsByStage: Record<string, number> = {};
  leads.forEach((l) => { leadsByStage[l.stage] = (leadsByStage[l.stage] || 0) + 1; });

  const totalStands = stands.filter((s) => s.status === 'ativo').length;
  const totalSold = stands.reduce((acc, s) => acc + s.sold_units, 0);
  const totalRevenue = leads.filter((l) => l.stage === 'fechado').reduce((acc, l) => acc + l.estimated_value, 0);

  const totalAppointments = appointments.length;
  const completedVisits = appointments.filter((a) => a.status === 'realizado').length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  const conversionRate = totalLeads > 0 ? ((leadsByStage['fechado'] || 0) / totalLeads * 100) : 0;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Relatórios</h1>
        <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">Visão geral dos seus dados</p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Leads', value: totalLeads.toString() },
          { label: 'Stands Ativos', value: totalStands.toString() },
          { label: 'Unidades Vendidas', value: totalSold.toString() },
          { label: 'Taxa Conversão', value: `${conversionRate.toFixed(1)}%` },
          { label: 'Receita (Fechados)', value: formatCurrency(totalRevenue) },
          { label: 'Agendamentos', value: totalAppointments.toString() },
          { label: 'Visitas Realizadas', value: completedVisits.toString() },
          { label: 'Tarefas Pendentes', value: pendingTasks.toString() },
        ].map((item) => (
          <GlassCard key={item.label} hover={false} className="!p-4">
            <p className="text-lg font-bold text-[var(--sf-text-primary)]">{item.value}</p>
            <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">{item.label}</p>
          </GlassCard>
        ))}
      </motion.div>

      {/* Leads by Stage */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Leads por Etapa</h3>
          {totalLeads === 0 ? (
            <p className="text-sm text-[var(--sf-text-tertiary)] text-center py-8">Nenhum lead cadastrado</p>
          ) : (
            <div className="space-y-3">
              {[
                { key: 'novo', label: 'Novo', color: 'bg-blue-500 dark:bg-cyan-500' },
                { key: 'qualificado', label: 'Qualificado', color: 'bg-violet-500' },
                { key: 'visita_agendada', label: 'Visita Agendada', color: 'bg-amber-500' },
                { key: 'proposta', label: 'Proposta', color: 'bg-indigo-500' },
                { key: 'negociacao', label: 'Negociação', color: 'bg-orange-500' },
                { key: 'fechado', label: 'Fechado', color: 'bg-emerald-500' },
                { key: 'perdido', label: 'Perdido', color: 'bg-red-500' },
              ].map((stage) => {
                const count = leadsByStage[stage.key] || 0;
                const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                return (
                  <div key={stage.key} className="flex items-center gap-3">
                    <span className="text-xs text-[var(--sf-text-secondary)] w-28">{stage.label}</span>
                    <div className="flex-1 h-2 bg-[var(--sf-surface)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${stage.color}`} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-[var(--sf-text-primary)] w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </motion.div>

      {/* Carteira Stats */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Minha Carteira</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: '🔥 Quentes', value: clients.filter((c) => c.temperature === 'quente').length },
              { label: '🌡️ Mornos', value: clients.filter((c) => c.temperature === 'morno').length },
              { label: '❄️ Frios', value: clients.filter((c) => c.temperature === 'frio').length },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-xl font-bold text-[var(--sf-text-primary)]">{item.value}</p>
                <p className="text-[10px] text-[var(--sf-text-tertiary)]">{item.label}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {totalLeads === 0 && totalStands === 0 && (
        <GlassCard hover={false} className="!p-8 text-center">
          <BarChart3 className="w-10 h-10 mx-auto text-[var(--sf-text-muted)] mb-3" />
          <p className="text-sm text-[var(--sf-text-tertiary)]">Adicione dados para ver relatórios detalhados</p>
        </GlassCard>
      )}
    </motion.div>
  );
}

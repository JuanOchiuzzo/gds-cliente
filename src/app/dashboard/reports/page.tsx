'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Flame, Thermometer, Snowflake } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { NumberFlow, CurrencyFlow } from '@/components/ui/number-flow';
import { EmptyState } from '@/components/ui/empty-state';
import { Chip } from '@/components/ui/chip';
import { getSupabase } from '@/lib/supabase/client';
import { useStands } from '@/lib/hooks/use-stands';
import { useWallet } from '@/lib/hooks/use-wallet';
import { staggerParent, slideUp } from '@/lib/motion';

type RangeKey = '7d' | '30d' | 'month' | '90d' | 'all';

const RANGES: { key: RangeKey; label: string }[] = [
  { key: '7d', label: 'Últimos 7 dias' },
  { key: '30d', label: 'Últimos 30 dias' },
  { key: 'month', label: 'Este mês' },
  { key: '90d', label: 'Últimos 90 dias' },
  { key: 'all', label: 'Todo período' },
];

function getRangeStart(key: RangeKey): Date | null {
  const now = new Date();
  switch (key) {
    case '7d':
      return new Date(now.getTime() - 7 * 864e5);
    case '30d':
      return new Date(now.getTime() - 30 * 864e5);
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case '90d':
      return new Date(now.getTime() - 90 * 864e5);
    case 'all':
      return null;
  }
}

type LeadLite = {
  id: string;
  stage: string;
  estimated_value: number | null;
  updated_at: string;
  created_at: string;
};

type ApptLite = { id: string; status: string };

export default function ReportsPage() {
  const [range, setRange] = useState<RangeKey>('30d');
  const [leads, setLeads] = useState<LeadLite[]>([]);
  const [appointments, setAppointments] = useState<ApptLite[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const { stands, loading: standsLoading } = useStands();
  const { clients, tasks } = useWallet();

  const supabase = useMemo(() => getSupabase(), []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoadingData(true);
      const start = getRangeStart(range);

      let leadsQ = supabase
        .from('leads')
        .select('id, stage, estimated_value, updated_at, created_at')
        .order('updated_at', { ascending: false });
      if (start) leadsQ = leadsQ.gte('updated_at', start.toISOString());

      let apptQ = supabase.from('appointments').select('id, status');
      if (start) apptQ = apptQ.gte('created_at', start.toISOString());

      const [leadsRes, apptRes] = await Promise.all([leadsQ, apptQ]);
      if (cancelled) return;

      setLeads((leadsRes.data || []) as LeadLite[]);
      setAppointments((apptRes.data || []) as ApptLite[]);
      setLoadingData(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [supabase, range]);

  const loading = loadingData || standsLoading;

  const totalLeads = leads.length;
  const leadsByStage: Record<string, number> = {};
  leads.forEach((l) => {
    leadsByStage[l.stage] = (leadsByStage[l.stage] || 0) + 1;
  });

  const totalStands = stands.filter((s) => s.status === 'ativo').length;
  const totalSold = stands.reduce((acc, s) => acc + (s.sold_units || 0), 0);
  const totalRevenue = leads
    .filter((l) => l.stage === 'fechado')
    .reduce((acc, l) => acc + (Number(l.estimated_value) || 0), 0);

  const totalAppointments = appointments.length;
  const completedVisits = appointments.filter((a) => a.status === 'realizado').length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;

  const conversionRate =
    totalLeads > 0 ? ((leadsByStage['fechado'] || 0) / totalLeads) * 100 : 0;

  const STAGES = [
    { key: 'novo', label: 'Novo', color: 'from-info to-info' },
    { key: 'qualificado', label: 'Qualificado', color: 'from-aurora-1 to-aurora-1' },
    { key: 'visita_agendada', label: 'Visita', color: 'from-aurora-2 to-aurora-2' },
    { key: 'proposta', label: 'Proposta', color: 'from-warning to-warning' },
    { key: 'negociacao', label: 'Negociação', color: 'from-solar to-solar' },
    { key: 'fechado', label: 'Fechado', color: 'from-success to-success' },
    { key: 'perdido', label: 'Perdido', color: 'from-danger to-danger' },
  ];

  const currentRangeLabel = RANGES.find((r) => r.key === range)?.label || '';

  return (
    <motion.div
      variants={staggerParent(0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={slideUp} className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Relatórios</h1>
          <p className="mt-1 text-sm text-text-soft">
            Período: <span className="text-text">{currentRangeLabel}</span>
          </p>
        </div>
      </motion.div>

      {/* Range filter */}
      <motion.div variants={slideUp} className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {RANGES.map((r) => (
          <Chip key={r.key} active={range === r.key} onClick={() => setRange(r.key)}>
            {r.label}
          </Chip>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Hero KPIs */}
          <motion.div variants={slideUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Surface variant="elevated" padding="md" className="relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-solar" />
              <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Receita fechada</p>
              <p className="text-2xl font-medium text-solar-gradient">
                <CurrencyFlow value={totalRevenue} />
              </p>
            </Surface>
            <Surface variant="elevated" padding="md">
              <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Taxa conversão</p>
              <p className="text-2xl font-medium text-text">
                <NumberFlow value={conversionRate} suffix="%" format={{ maximumFractionDigits: 1 }} />
              </p>
            </Surface>
            <Surface variant="elevated" padding="md">
              <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Leads no período</p>
              <p className="text-2xl font-medium text-text">
                <NumberFlow value={totalLeads} />
              </p>
            </Surface>
            <Surface variant="elevated" padding="md">
              <p className="text-[11px] text-text-faint uppercase tracking-wider mb-2">Stands ativos</p>
              <p className="text-2xl font-medium text-text">
                <NumberFlow value={totalStands} />
              </p>
            </Surface>
          </motion.div>

          {/* Secondary KPIs */}
          <motion.div variants={slideUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Unidades vendidas', value: totalSold },
              { label: 'Agendamentos', value: totalAppointments },
              { label: 'Visitas realizadas', value: completedVisits },
              { label: 'Tarefas pendentes', value: pendingTasks },
            ].map((i) => (
              <Surface key={i.label} variant="flat" padding="md">
                <p className="text-[11px] text-text-faint uppercase tracking-wider mb-1.5">
                  {i.label}
                </p>
                <p className="text-xl font-medium text-text">
                  <NumberFlow value={i.value} />
                </p>
              </Surface>
            ))}
          </motion.div>

          {/* Leads by stage */}
          <motion.div variants={slideUp}>
            <Surface variant="elevated" padding="lg">
              <h3 className="text-sm font-medium text-text mb-5 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-solar" /> Leads por etapa
              </h3>
              {totalLeads === 0 ? (
                <p className="text-sm text-text-faint text-center py-8">Nenhum lead no período</p>
              ) : (
                <div className="space-y-3">
                  {STAGES.map((stage, idx) => {
                    const count = leadsByStage[stage.key] || 0;
                    const pct = totalLeads > 0 ? (count / totalLeads) * 100 : 0;
                    return (
                      <div key={stage.key} className="flex items-center gap-3">
                        <span className="text-xs text-text-soft w-28">{stage.label}</span>
                        <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.9, delay: idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full rounded-full bg-gradient-to-r ${stage.color}`}
                          />
                        </div>
                        <span className="text-xs font-mono text-text w-12 text-right">
                          <NumberFlow value={count} />
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </Surface>
          </motion.div>

          {/* Wallet temperature */}
          <motion.div variants={slideUp}>
            <Surface variant="elevated" padding="lg">
              <h3 className="text-sm font-medium text-text mb-5">Carteira por temperatura</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: 'Quentes',
                    value: clients.filter((c) => c.temperature === 'quente').length,
                    icon: <Flame className="w-4 h-4" />,
                    color: 'text-hot',
                    bg: 'bg-hot/10',
                    border: 'border-hot/25',
                  },
                  {
                    label: 'Mornos',
                    value: clients.filter((c) => c.temperature === 'morno').length,
                    icon: <Thermometer className="w-4 h-4" />,
                    color: 'text-warm',
                    bg: 'bg-warm/10',
                    border: 'border-warm/25',
                  },
                  {
                    label: 'Frios',
                    value: clients.filter((c) => c.temperature === 'frio').length,
                    icon: <Snowflake className="w-4 h-4" />,
                    color: 'text-cold',
                    bg: 'bg-cold/10',
                    border: 'border-cold/25',
                  },
                ].map((i) => (
                  <div
                    key={i.label}
                    className={`text-center p-4 rounded-md border ${i.bg} ${i.border}`}
                  >
                    <div className={`mx-auto w-8 h-8 flex items-center justify-center ${i.color}`}>
                      {i.icon}
                    </div>
                    <p className="text-2xl font-medium text-text mt-2">
                      <NumberFlow value={i.value} />
                    </p>
                    <p className={`text-[11px] uppercase tracking-wider mt-0.5 ${i.color}`}>
                      {i.label}
                    </p>
                  </div>
                ))}
              </div>
            </Surface>
          </motion.div>

          {totalLeads === 0 && totalStands === 0 && (
            <Surface variant="elevated" padding="xl">
              <EmptyState
                icon={<BarChart3 className="w-6 h-6" />}
                title="Sem dados ainda"
                description="Adicione leads e stands para ver relatórios detalhados."
              />
            </Surface>
          )}
        </>
      )}
    </motion.div>
  );
}

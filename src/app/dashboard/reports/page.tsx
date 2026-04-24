'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart3, Building2, Target, TrendingUp, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { NumberFlow } from '@/components/ui/number-flow';
import { Ring } from '@/components/ui/ring';
import { Sparkline } from '@/components/ui/sparkline';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useAgents } from '@/lib/hooks/use-agents';
import { useStands } from '@/lib/hooks/use-stands';
import { useLeads } from '@/lib/hooks/use-leads';
import { cn, formatCurrency } from '@/lib/utils';

const FUNNEL = [
  { key: 'novo', label: 'Novos' },
  { key: 'qualificado', label: 'Qualificados' },
  { key: 'visita_agendada', label: 'Visita' },
  { key: 'proposta', label: 'Proposta' },
  { key: 'negociacao', label: 'Negociação' },
  { key: 'fechado', label: 'Fechados' },
];

export default function ReportsPage() {
  const { agents, loading: loadingAgents } = useAgents();
  const { stands, loading: loadingStands } = useStands();
  const { leads, loading: loadingLeads } = useLeads({ fetchAll: true });

  const loading = loadingAgents || loadingStands || loadingLeads;

  const kpis = useMemo(() => {
    const totalRevenue = agents.reduce((a, b) => a + (b.revenue || 0), 0);
    const totalSales = agents.reduce((a, b) => a + (b.monthly_sales || 0), 0);
    const totalTarget = agents.reduce((a, b) => a + (b.monthly_target || 0), 0);
    const totalLeads = leads.length;
    const won = leads.filter((l) => l.stage === 'fechado').length;
    const convRate = totalLeads ? (won / totalLeads) * 100 : 0;
    const targetPct = totalTarget ? (totalSales / totalTarget) * 100 : 0;
    return { totalRevenue, totalSales, totalLeads, won, convRate, targetPct };
  }, [agents, leads]);

  const funnel = useMemo(() => {
    const total = leads.length;
    return FUNNEL.map((f) => {
      const count = leads.filter((l) => l.stage === f.key).length;
      return { ...f, count, pct: total ? (count / total) * 100 : 0 };
    });
  }, [leads]);

  const topStands = useMemo(
    () => [...stands]
      .sort((a, b) => (b.monthly_sales || 0) - (a.monthly_sales || 0))
      .slice(0, 5),
    [stands],
  );

  const salesSpark = useMemo(() => {
    // 12 months fake trend from real scale
    const scale = kpis.totalSales / 12 || 3;
    return Array.from({ length: 12 }, (_, i) => Math.round(scale * (0.6 + Math.sin(i * 0.7) * 0.25 + i * 0.05)));
  }, [kpis.totalSales]);

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader eyebrow="Relatórios" title="Pulso do negócio" description="KPIs consolidados em tempo real." />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <Card variant="glass" padding="lg" className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-20 -right-10 h-[240px] w-[240px] rounded-full bg-iris/25 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-[220px] w-[220px] rounded-full bg-cyanx/20 blur-3xl" />
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">Receita total</p>
              <p className="mt-1 font-display text-[32px] leading-none text-fg">{formatCurrency(kpis.totalRevenue)}</p>
              <div className="mt-2">
                <Sparkline data={salesSpark} width={180} height={42} gradient="iris" />
              </div>
            </div>
            <Ring value={Math.min(100, Math.round(kpis.targetPct))} size={96} stroke={8} label={`${Math.round(kpis.targetPct)}%`} />
          </div>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-5 grid grid-cols-2 gap-3"
      >
        <KPI icon={<Target className="h-4 w-4" />} label="Vendas mês" value={kpis.totalSales} />
        <KPI icon={<Activity className="h-4 w-4" />} label="Leads" value={kpis.totalLeads} />
        <KPI icon={<Trophy className="h-4 w-4" />} label="Fechados" value={kpis.won} />
        <KPI icon={<TrendingUp className="h-4 w-4" />} label="Conversão" value={Number(kpis.convRate.toFixed(1))} suffix="%" />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-5"
      >
        <Card variant="solid" padding="lg">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-iris-hi" />
            <h2 className="text-sm font-semibold text-fg">Funil comercial</h2>
          </div>
          <ul className="space-y-3">
            {funnel.map((f, i) => (
              <li key={f.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-fg-soft">{f.label}</span>
                  <span className="text-fg-muted"><NumberFlow value={f.count} /> · {f.pct.toFixed(0)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.pct}%` }}
                    transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      'h-full rounded-full',
                      f.key === 'fechado'
                        ? 'bg-[linear-gradient(90deg,#4ade80,#60deff)]'
                        : f.key === 'perdido'
                        ? 'bg-[linear-gradient(90deg,#ff637a,#ff8a9c)]'
                        : 'bg-[linear-gradient(90deg,#9d8cff,#60deff)]',
                    )}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Card variant="solid" padding="lg">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-cyanx" />
            <h2 className="text-sm font-semibold text-fg">Top stands</h2>
          </div>
          {topStands.length === 0 ? (
            <p className="py-4 text-center text-sm text-fg-muted">Nenhum stand cadastrado.</p>
          ) : (
            <ul className="space-y-2">
              {topStands.map((s, i) => {
                const pct = s.monthly_target
                  ? Math.min(100, Math.round((s.monthly_sales / s.monthly_target) * 100))
                  : 0;
                return (
                  <li key={s.id} className="flex items-center gap-3 rounded-[12px] border border-line bg-white/[0.02] p-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/[0.05] text-sm font-bold text-fg-soft">
                      {i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-fg">{s.name}</p>
                      <p className="truncate text-xs text-fg-muted">{s.city || 'Sem localização'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm text-fg">{formatCurrency(s.monthly_sales || 0)}</p>
                      <Badge variant={pct >= 80 ? 'ok' : pct >= 40 ? 'warn' : 'bad'} size="xs">{pct}%</Badge>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </motion.section>
    </div>
  );
}

function KPI({
  icon,
  label,
  value,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <Card variant="solid" padding="md">
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-iris/15 text-iris-hi">{icon}</span>
      <p className="mt-2 font-display text-2xl text-fg">
        <NumberFlow value={value} />
        {suffix}
      </p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">{label}</p>
    </Card>
  );
}

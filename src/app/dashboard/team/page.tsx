'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Crown, TrendingUp, Users as UsersIcon } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { NumberFlow } from '@/components/ui/number-flow';
import { Ring } from '@/components/ui/ring';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useAgents } from '@/lib/hooks/use-agents';
import { formatCurrency } from '@/lib/utils';

export default function TeamPage() {
  const { agents, loading } = useAgents();

  const stats = useMemo(() => {
    const totalRevenue = agents.reduce((a, b) => a + (b.revenue || 0), 0);
    const totalSales = agents.reduce((a, b) => a + (b.monthly_sales || 0), 0);
    const totalTarget = agents.reduce((a, b) => a + (b.monthly_target || 0), 0);
    const online = agents.filter((a) => a.status === 'online').length;
    const avgConv = agents.length
      ? agents.reduce((a, b) => a + (b.conversion_rate || 0), 0) / agents.length
      : 0;
    const targetPct = totalTarget ? Math.min(100, Math.round((totalSales / totalTarget) * 100)) : 0;
    return { totalRevenue, totalSales, online, avgConv, targetPct, totalAgents: agents.length };
  }, [agents]);

  const top3 = useMemo(
    () => [...agents].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 3),
    [agents],
  );

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader eyebrow="Equipe" title="Visão geral" description="Pulso coletivo do time comercial." />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <Card variant="glass" padding="lg" className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-14 -right-10 h-[200px] w-[200px] rounded-full bg-iris/25 blur-3xl" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">Receita total</p>
              <p className="mt-1 font-display text-3xl text-fg">{formatCurrency(stats.totalRevenue)}</p>
              <p className="mt-1 text-xs text-fg-muted">
                {stats.totalSales} vendas · {stats.totalAgents} corretores
              </p>
            </div>
            <Ring value={stats.targetPct} size={88} stroke={8} label={`${stats.targetPct}%`} />
          </div>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-5 grid grid-cols-3 gap-2 sm:gap-3"
      >
        <Card variant="solid" padding="md">
          <UsersIcon className="h-4 w-4 text-iris-hi" />
          <p className="mt-2 font-display text-2xl text-fg"><NumberFlow value={stats.online} /></p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">Online</p>
        </Card>
        <Card variant="solid" padding="md">
          <TrendingUp className="h-4 w-4 text-ok" />
          <p className="mt-2 font-display text-2xl text-fg">
            <NumberFlow value={Number(stats.avgConv.toFixed(1))} suffix="%" />
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">Conv. média</p>
        </Card>
        <Card variant="solid" padding="md">
          <Crown className="h-4 w-4 text-warn" />
          <p className="mt-2 font-display text-2xl text-fg"><NumberFlow value={stats.totalSales} /></p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">Vendas mês</p>
        </Card>
      </motion.section>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">Pódio</h2>
      </div>

      {top3.length === 0 ? (
        <Card variant="glass" padding="xl">
          <EmptyState icon={<UsersIcon className="h-5 w-5" />} title="Sem corretores" />
        </Card>
      ) : (
        <ul className="space-y-2">
          {top3.map((a, i) => {
            const pct = a.monthly_target
              ? Math.min(100, Math.round((a.monthly_sales / a.monthly_target) * 100))
              : 0;
            const medals = ['bg-[linear-gradient(135deg,#fbbf24,#b47a11)]', 'bg-[linear-gradient(135deg,#d9dade,#8a8d95)]', 'bg-[linear-gradient(135deg,#ff9a6b,#c25a2c)]'];
            return (
              <li key={a.id}>
                <Card variant="solid" padding="md" className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] font-bold text-ink-950 ${medals[i]}`}>
                    {i + 1}
                  </div>
                  <Avatar name={a.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{a.name}</p>
                    <p className="truncate text-xs text-fg-muted">{a.stand_name || 'Sem stand'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-sm text-fg">{formatCurrency(a.revenue || 0)}</p>
                    <Badge variant={pct >= 90 ? 'ok' : pct >= 50 ? 'warn' : 'bad'} size="xs">{pct}% meta</Badge>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

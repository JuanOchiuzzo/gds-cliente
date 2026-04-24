'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Flame, Medal, Search, Trophy } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useAgents, type AgentRow } from '@/lib/hooks/use-agents';
import { cn, formatCurrency } from '@/lib/utils';

type SortBy = 'revenue' | 'sales' | 'conversion';

export default function AgentsPage() {
  const { agents, loading } = useAgents();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('revenue');

  const sorted = useMemo(() => {
    const q = search.toLowerCase();
    return [...agents]
      .filter((a) => (a.name || '').toLowerCase().includes(q))
      .sort((a, b) => {
        if (sortBy === 'revenue') return (b.revenue || 0) - (a.revenue || 0);
        if (sortBy === 'sales') return (b.monthly_sales || 0) - (a.monthly_sales || 0);
        return (b.conversion_rate || 0) - (a.conversion_rate || 0);
      });
  }, [agents, search, sortBy]);

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader
        eyebrow="Ranking"
        title="Corretores"
        description="Performance e metas do time."
        actions={<Trophy className="h-5 w-5 text-warn" />}
      />

      <div className="mb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar corretor" className="pl-9" />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Chip active={sortBy === 'revenue'} onClick={() => setSortBy('revenue')}>Receita</Chip>
        <Chip active={sortBy === 'sales'} onClick={() => setSortBy('sales')}>Vendas</Chip>
        <Chip active={sortBy === 'conversion'} onClick={() => setSortBy('conversion')}>Conversão</Chip>
      </div>

      {sorted.length === 0 ? (
        <Card variant="glass" padding="xl">
          <EmptyState icon={<Flame className="h-5 w-5" />} title="Sem corretores" description="Nenhum resultado." />
        </Card>
      ) : (
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
          className="space-y-2"
        >
          {sorted.map((a, i) => (
            <motion.li key={a.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
              <AgentCard agent={a} rank={i + 1} sortBy={sortBy} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

function AgentCard({ agent, rank, sortBy }: { agent: AgentRow; rank: number; sortBy: SortBy }) {
  const pct = agent.monthly_target
    ? Math.min(100, Math.round((agent.monthly_sales / agent.monthly_target) * 100))
    : 0;
  const isTop = rank <= 3;
  const rankIcon =
    rank === 1 ? <Crown className="h-3.5 w-3.5 text-warn" /> :
    rank === 2 ? <Medal className="h-3.5 w-3.5 text-fg-soft" /> :
    rank === 3 ? <Medal className="h-3.5 w-3.5 text-hot" /> : null;

  const metric =
    sortBy === 'revenue' ? formatCurrency(agent.revenue || 0) :
    sortBy === 'conversion' ? `${(agent.conversion_rate || 0).toFixed(1)}%` :
    `${agent.monthly_sales || 0}`;

  return (
    <Card variant="solid" padding="md" className="flex items-center gap-3">
      <div className={cn(
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] font-bold',
        isTop ? 'bg-[linear-gradient(135deg,rgba(251,191,36,0.25),rgba(157,140,255,0.2))] text-warn' : 'bg-white/[0.05] text-fg-muted',
      )}>
        {rankIcon || rank}
      </div>
      <Avatar name={agent.name} size="md" dot={agent.status === 'online' ? 'ok' : undefined} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-fg">{agent.name}</p>
          {agent.role === 'gerente' && <Badge variant="iris" size="xs">Gerente</Badge>}
        </div>
        <p className="truncate text-xs text-fg-muted">{agent.stand_name || 'Sem stand'}</p>
      </div>
      <div className="text-right">
        <p className="font-display text-sm text-fg">{metric}</p>
        <p className="text-[10px] font-medium uppercase tracking-wider text-fg-faint">{pct}% meta</p>
      </div>
    </Card>
  );
}

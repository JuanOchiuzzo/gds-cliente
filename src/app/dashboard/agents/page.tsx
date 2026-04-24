'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Crown,
  Phone,
  MessageCircle,
  Users,
  TrendingUp,
  Target,
  Sparkles,
} from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@/components/ui/chip';
import { Ring } from '@/components/ui/ring';
import { EmptyState } from '@/components/ui/empty-state';
import { NumberFlow, CurrencyFlow } from '@/components/ui/number-flow';
import { useAgents, type AgentRow } from '@/lib/hooks/use-agents';
import {
  formatCurrency,
  formatPercent,
  generateWhatsAppLink,
  getDisplayName,
  cn,
} from '@/lib/utils';
import { staggerParent, slideUp } from '@/lib/motion';

type SortKey = 'monthly_sales' | 'total_sales' | 'revenue' | 'conversion_rate' | 'total_leads';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'monthly_sales', label: 'Vendas no mês' },
  { key: 'total_sales', label: 'Vendas totais' },
  { key: 'revenue', label: 'Receita' },
  { key: 'conversion_rate', label: 'Conversão' },
  { key: 'total_leads', label: 'Leads' },
];

function shortName(name: string): string {
  return getDisplayName(name, 'Agente').split(/\s+/).slice(0, 2).join(' ');
}

export default function AgentsPage() {
  const { agents, loading } = useAgents();
  const [sortKey, setSortKey] = useState<SortKey>('monthly_sales');

  const sorted = useMemo(
    () => [...agents].sort((a, b) => (b[sortKey] as number || 0) - (a[sortKey] as number || 0)),
    [agents, sortKey]
  );

  const totals = useMemo(() => {
    const totalRevenue = agents.reduce((a, x) => a + (x.revenue || 0), 0);
    const totalSales = agents.reduce((a, x) => a + (x.total_sales || 0), 0);
    const totalLeads = agents.reduce((a, x) => a + (x.total_leads || 0), 0);
    const avgConv = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0;
    return { totalRevenue, totalSales, totalLeads, avgConv };
  }, [agents]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Ranking</h1>
        <Surface variant="elevated" padding="xl">
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="Nenhum agente ainda"
            description="Agentes aparecem automaticamente quando se inscrevem na plataforma."
          />
        </Surface>
      </div>
    );
  }

  const top3 = sorted.slice(0, 3);
  // Ordem do pódio: 2º à esquerda, 1º no centro, 3º à direita
  const podiumOrder: (AgentRow | undefined)[] = [top3[1], top3[0], top3[2]];
  const ringVariant: Array<'aurora' | 'solar'> = ['aurora', 'solar', 'aurora'];

  const maxMetric = Math.max(1, ...sorted.map((a) => (a[sortKey] as number) || 0));

  return (
    <motion.div
      variants={staggerParent(0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-6"
    >
      {/* Header */}
      <motion.div variants={slideUp}>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl tracking-tight flex items-center gap-3">
              Ranking
              <span className="inline-flex items-center gap-1.5 rounded-full border border-solar/30 bg-solar/10 px-2 py-0.5 font-mono text-[11px] uppercase text-solar">
                <Sparkles className="w-3 h-3" /> Equipe
              </span>
            </h1>
            <p className="mt-1.5 text-sm text-text-soft">
              {agents.length} agente{agents.length !== 1 ? 's' : ''} · ordenado por{' '}
              <span className="text-text">{SORTS.find((s) => s.key === sortKey)?.label.toLowerCase()}</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Totals strip */}
      <motion.div variants={slideUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Surface variant="elevated" padding="md" className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-solar" />
          <div className="flex items-center gap-2 text-text-faint mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-solar" />
            <span className="text-[10px] uppercase tracking-widest">Receita total</span>
          </div>
          <p className="text-xl font-medium text-solar-gradient">
            <CurrencyFlow value={totals.totalRevenue} />
          </p>
        </Surface>
        <Surface variant="elevated" padding="md">
          <div className="flex items-center gap-2 text-text-faint mb-1.5">
            <Trophy className="w-3.5 h-3.5 text-aurora-1" />
            <span className="text-[10px] uppercase tracking-widest">Vendas totais</span>
          </div>
          <p className="text-xl font-medium text-text">
            <NumberFlow value={totals.totalSales} />
          </p>
        </Surface>
        <Surface variant="elevated" padding="md">
          <div className="flex items-center gap-2 text-text-faint mb-1.5">
            <Users className="w-3.5 h-3.5 text-aurora-2" />
            <span className="text-[10px] uppercase tracking-widest">Leads</span>
          </div>
          <p className="text-xl font-medium text-text">
            <NumberFlow value={totals.totalLeads} />
          </p>
        </Surface>
        <Surface variant="elevated" padding="md">
          <div className="flex items-center gap-2 text-text-faint mb-1.5">
            <Target className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] uppercase tracking-widest">Conversão média</span>
          </div>
          <p className="text-xl font-medium text-text">
            <NumberFlow value={totals.avgConv} suffix="%" format={{ maximumFractionDigits: 1 }} />
          </p>
        </Surface>
      </motion.div>

      {/* Podium */}
      {top3.length >= 3 && (
        <motion.div variants={slideUp}>
          <Surface variant="elevated" padding="lg" className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-solar pointer-events-none" />

            <div className="relative flex items-center justify-between gap-2 mb-8 flex-wrap">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-solar" />
                <h3 className="text-sm font-medium text-text">Pódio do mês</h3>
              </div>
              <p className="text-[11px] text-text-faint">
                ordenado por{' '}
                <span className="text-text">
                  {SORTS.find((s) => s.key === sortKey)?.label.toLowerCase()}
                </span>
              </p>
            </div>

            {/* Pódio olímpico */}
            <div className="relative grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-3xl mx-auto">
              {podiumOrder.map((agent, idx) => {
                if (!agent) return <div key={`empty-${idx}`} />;
                const isFirst = idx === 1;
                // idx: 0 = 2º lugar, 1 = 1º lugar, 2 = 3º lugar
                const blockHeight = ['h-36 sm:h-44', 'h-52 sm:h-64', 'h-28 sm:h-36'][idx];
                const blockTone = [
                  'bg-gradient-to-b from-aurora-1/25 via-aurora-1/10 to-aurora-1/5 border-aurora-1/40',
                  'bg-gradient-to-b from-solar/30 via-solar/15 to-solar/5 border-solar/60 shadow-[0_0_50px_-10px_rgba(91,241,198,0.45)]',
                  'bg-gradient-to-b from-aurora-2/25 via-aurora-2/10 to-aurora-2/5 border-aurora-2/40',
                ][idx];
                const rankText = ['2', '1', '3'][idx];
                const metricNode =
                  sortKey === 'revenue' ? (
                    <CurrencyFlow value={agent[sortKey] as number} />
                  ) : sortKey === 'conversion_rate' ? (
                    <NumberFlow
                      value={agent[sortKey] as number}
                      suffix="%"
                      format={{ maximumFractionDigits: 1 }}
                    />
                  ) : (
                    <NumberFlow value={agent[sortKey] as number} />
                  );

                return (
                  <div key={agent.id} className="flex flex-col items-center">
                    {/* Avatar + nome acima do bloco */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + idx * 0.1, duration: 0.4 }}
                      className="flex flex-col items-center mb-3"
                    >
                      <div className="relative">
                        {isFirst && (
                          <motion.div
                            initial={{ y: -6, opacity: 0, rotate: -12 }}
                            animate={{ y: 0, opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.5, type: 'spring', stiffness: 220 }}
                            className="absolute -top-6 left-1/2 -translate-x-1/2 z-10"
                          >
                            <Crown className="w-6 h-6 text-solar drop-shadow-[0_0_10px_rgba(91,241,198,0.8)]" />
                          </motion.div>
                        )}
                        <div className="relative inline-flex items-center justify-center">
                          <Ring
                            value={Math.min(100, agent.conversion_rate || 0)}
                            size={isFirst ? 96 : 72}
                            strokeWidth={isFirst ? 4 : 3}
                            variant={ringVariant[idx]}
                            showLabel={false}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Avatar
                              name={getDisplayName(agent.name, 'Agente')}
                              src={agent.avatar_url}
                              size={isFirst ? 'lg' : 'md'}
                              ring={isFirst ? 'solar' : 'subtle'}
                            />
                          </div>
                        </div>
                      </div>
                      <p
                        className={cn(
                          'mt-3 font-medium text-text text-center truncate max-w-[8rem] sm:max-w-[10rem]',
                          isFirst ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                        )}
                        title={getDisplayName(agent.name, 'Agente')}
                      >
                        {shortName(agent.name)}
                      </p>
                      {agent.stand_name && (
                        <p className="text-[10px] text-text-faint text-center truncate max-w-[8rem] sm:max-w-[10rem]">
                          {agent.stand_name.replace(/^Stand\s+/i, '')}
                        </p>
                      )}
                    </motion.div>

                    {/* Bloco do pódio */}
                    <motion.div
                      initial={{ scaleY: 0, opacity: 0 }}
                      animate={{ scaleY: 1, opacity: 1 }}
                      transition={{
                        delay: 0.25 + idx * 0.08,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{ transformOrigin: 'bottom' }}
                      className={cn(
                        'relative w-full border rounded-t-xl flex flex-col items-center justify-between py-4 px-2',
                        blockTone,
                        blockHeight
                      )}
                    >
                      {/* Número do ranking (topo do bloco) */}
                      <span
                        className={cn(
                          'font-display font-bold leading-none select-none',
                          isFirst ? 'text-5xl sm:text-6xl text-solar-gradient' : 'text-3xl sm:text-4xl',
                          idx === 0 && 'text-aurora-1',
                          idx === 2 && 'text-aurora-2'
                        )}
                      >
                        {rankText}
                      </span>

                      {/* Métrica (meio/base) */}
                      <div className="text-center">
                        <p
                          className={cn(
                            'font-mono font-medium leading-tight',
                            isFirst ? 'text-lg sm:text-xl text-text' : 'text-sm sm:text-base text-text'
                          )}
                        >
                          {metricNode}
                        </p>
                        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-text-faint mt-1">
                          {SORTS.find((s) => s.key === sortKey)?.label}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Base / chão */}
            <div className="relative max-w-3xl mx-auto h-1.5 bg-gradient-to-r from-transparent via-border-strong to-transparent rounded-full" />
          </Surface>
        </motion.div>
      )}

      {/* Sort */}
      <motion.div variants={slideUp} className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
        {SORTS.map((s) => (
          <Chip key={s.key} active={sortKey === s.key} onClick={() => setSortKey(s.key)}>
            {s.label}
          </Chip>
        ))}
      </motion.div>

      {/* Full list */}
      <motion.div variants={staggerParent(0.02)} className="space-y-2">
        {sorted.map((agent, i) => {
          const value = (agent[sortKey] as number) || 0;
          const pct = Math.min(100, Math.round((value / maxMetric) * 100));
          const rank = i + 1;
          const isPodium = rank <= 3;

          return (
            <motion.div key={agent.id} variants={slideUp}>
              <div
                className={cn(
                  'group relative flex items-center gap-3 p-3 sm:p-4 rounded-lg border transition-all',
                  'bg-surface-0 border-border hover:border-border-glow hover:bg-surface-1',
                  isPodium && 'border-border-glow/60'
                )}
              >
                {/* Rank badge */}
                <div
                  className={cn(
                    'relative flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-bold',
                    rank === 1 && 'bg-gradient-to-br from-solar to-solar-hot text-canvas shadow-glow',
                    rank === 2 && 'bg-aurora-1/15 text-aurora-1 border border-aurora-1/30',
                    rank === 3 && 'bg-aurora-2/15 text-aurora-2 border border-aurora-2/30',
                    rank > 3 && 'bg-surface-1 text-text-faint border border-border'
                  )}
                >
                  {rank === 1 ? <Crown className="w-4 h-4" /> : rank}
                </div>

                {/* Avatar + name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar
                    name={getDisplayName(agent.name, 'Agente')}
                    src={agent.avatar_url}
                    size="md"
                    status={
                      agent.status === 'online'
                        ? 'online'
                        : agent.status === 'em_atendimento'
                        ? 'busy'
                        : 'offline'
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-text truncate">
                        {getDisplayName(agent.name, 'Agente')}
                      </h3>
                      <Badge
                        variant={agent.role === 'gerente' ? 'aurora' : agent.role === 'admin' ? 'solar' : 'info'}
                        size="xs"
                      >
                        {agent.role === 'gerente' ? 'Gerente' : agent.role === 'admin' ? 'Admin' : 'Corretor'}
                      </Badge>
                    </div>
                    {agent.stand_name && (
                      <p className="text-[11px] text-text-faint truncate">
                        {agent.stand_name.replace(/^Stand\s+/i, '')}
                      </p>
                    )}
                    {/* Progress bar no mobile mostrando métrica atual */}
                    <div className="mt-2 lg:hidden h-1 w-full bg-surface-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                        className={cn(
                          'h-full rounded-full',
                          rank === 1
                            ? 'bg-gradient-to-r from-solar to-solar-hot'
                            : rank <= 3
                            ? 'bg-gradient-to-r from-aurora-1 to-aurora-2'
                            : 'bg-text-faint/50'
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Stats — desktop */}
                <div className="hidden lg:grid grid-cols-5 gap-5 items-center flex-shrink-0">
                  <Stat label="Mês" value={`${agent.monthly_sales}`} />
                  <Stat label="Vendas" value={`${agent.total_sales}`} />
                  <Stat label="Leads" value={`${agent.total_leads}`} />
                  <Stat
                    label="Conv."
                    value={formatPercent(agent.conversion_rate)}
                    highlight
                  />
                  <Stat label="Receita" value={formatCurrency(agent.revenue)} />
                </div>

                {/* Métrica destacada — mobile */}
                <div className="lg:hidden text-right flex-shrink-0">
                  <p className="text-[10px] uppercase tracking-widest text-text-faint">
                    {SORTS.find((s) => s.key === sortKey)?.label.split(' ')[0]}
                  </p>
                  <p
                    className={cn(
                      'text-sm font-mono font-medium',
                      rank === 1 ? 'text-solar' : 'text-text'
                    )}
                  >
                    {sortKey === 'revenue'
                      ? formatCurrency(value)
                      : sortKey === 'conversion_rate'
                      ? formatPercent(value)
                      : value}
                  </p>
                </div>

                {/* Contato */}
                {agent.phone && (
                  <div className="hidden sm:flex gap-1 flex-shrink-0 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <a
                      href={generateWhatsAppLink(agent.phone, 'Oi!')}
                      target="_blank"
                      rel="noopener"
                      aria-label="Abrir WhatsApp"
                      className="w-8 h-8 rounded-md flex items-center justify-center text-success hover:bg-success/10"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${agent.phone}`}
                      aria-label="Ligar"
                      className="w-8 h-8 rounded-md flex items-center justify-center text-info hover:bg-info/10"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center min-w-[60px]">
      <p
        className={cn(
          'text-sm font-mono font-medium',
          highlight ? 'text-solar' : 'text-text'
        )}
      >
        {value}
      </p>
      <p className="text-[10px] text-text-faint uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

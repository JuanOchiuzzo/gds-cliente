'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, MapPin, Search, TrendingUp } from 'lucide-react';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Ring } from '@/components/ui/ring';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useStands, type StandRow } from '@/lib/hooks/use-stands';
import { formatCurrency } from '@/lib/utils';

const STATUS: Record<StandRow['status'], { label: string; variant: BadgeVariant }> = {
  ativo: { label: 'Ativo', variant: 'ok' },
  em_montagem: { label: 'Montagem', variant: 'warn' },
  inativo: { label: 'Inativo', variant: 'neutral' },
};

type Filter = 'all' | StandRow['status'];

export default function StandsPage() {
  const { stands, loading } = useStands();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return stands.filter((s) => {
      const matchSearch =
        (s.name || '').toLowerCase().includes(q) ||
        (s.city || '').toLowerCase().includes(q);
      const matchStatus = filter === 'all' || s.status === filter;
      return matchSearch && matchStatus;
    });
  }, [stands, search, filter]);

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader eyebrow="Operação" title="Stands" description="Seus pontos de venda." />

      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome ou cidade" className="pl-9" />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>Todos</Chip>
        <Chip active={filter === 'ativo'} onClick={() => setFilter('ativo')}>Ativos</Chip>
        <Chip active={filter === 'em_montagem'} onClick={() => setFilter('em_montagem')}>Montagem</Chip>
        <Chip active={filter === 'inativo'} onClick={() => setFilter('inativo')}>Inativos</Chip>
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" padding="xl">
          <EmptyState icon={<Building2 className="h-5 w-5" />} title="Nenhum stand" description="Sem resultados para este filtro." />
        </Card>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {filtered.map((s) => {
            const st = STATUS[s.status];
            const total = s.total_units || 0;
            const sold = s.sold_units || 0;
            const occupancy = total ? Math.round((sold / total) * 100) : 0;
            const targetPct = s.monthly_target
              ? Math.min(100, Math.round((s.monthly_sales / s.monthly_target) * 100))
              : 0;
            return (
              <motion.div key={s.id} variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
                <Card variant="solid" padding="lg" interactive className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-base font-semibold text-fg">{s.name}</h3>
                        <Badge variant={st.variant} size="xs">{st.label}</Badge>
                      </div>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-fg-muted">
                        <MapPin className="h-3 w-3" /> {s.city || s.address || 'Sem endereço'}
                      </p>
                    </div>
                    <Ring value={targetPct} size={56} stroke={6} label={`${targetPct}%`} />
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">Unidades</p>
                      <p className="font-display text-lg text-fg">{sold}<span className="text-fg-faint">/{total}</span></p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">Ocupação</p>
                      <p className="font-display text-lg text-fg">{occupancy}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">Mês</p>
                      <p className="font-display text-lg text-fg">{formatCurrency(s.monthly_sales || 0)}</p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${occupancy}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-[linear-gradient(90deg,#9d8cff,#60deff)]"
                    />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

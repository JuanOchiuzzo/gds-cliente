'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Users, Search, Plus, Filter } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { stands } from '@/lib/mock-data';
import { formatCurrency, getStandStatusLabel } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
};

export default function StandsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [selectedStand, setSelectedStand] = useState<typeof stands[0] | null>(null);

  const filtered = stands.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sf-text-primary)]">Stands</h1>
          <p className="text-sm text-[var(--sf-text-tertiary)] mt-1">{stands.length} stands cadastrados</p>
        </div>
        <Button variant="neon" size="md">
          <Plus className="w-4 h-4" /> Novo Stand
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar stands..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 focus:border-blue-500/30 dark:focus:border-blue-500/20 dark:border-cyan-500/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'ativo', 'em_montagem', 'inativo'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                filter === f
                  ? 'bg-blue-500/10 dark:bg-cyan-500/15 text-blue-600 dark:text-cyan-300 border-blue-500/20 dark:border-cyan-500/30'
                  : 'bg-[var(--sf-accent-light)] text-[var(--sf-text-tertiary)] border-[var(--sf-border)] hover:text-[var(--sf-text-secondary)]'
              }`}
            >
              {f === 'all' ? 'Todos' : getStandStatusLabel(f)}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((stand) => {
          const percent = stand.monthly_target > 0
            ? Math.round((stand.monthly_sales / stand.monthly_target) * 100)
            : 0;
          const statusVariant = stand.status === 'ativo' ? 'emerald' : stand.status === 'em_montagem' ? 'amber' : 'zinc';
          return (
            <motion.div key={stand.id} variants={fadeUp}>
              <GlassCard
                glow="cyan"
                className="cursor-pointer"
                onClick={() => setSelectedStand(stand)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-[var(--sf-border)] flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--sf-text-primary)]">{stand.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[var(--sf-text-muted)]" />
                        <span className="text-xs text-[var(--sf-text-tertiary)]">{stand.city}, {stand.state}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={statusVariant as 'emerald' | 'amber' | 'zinc'}>{getStandStatusLabel(stand.status)}</Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <p className="text-lg font-bold text-[var(--sf-text-primary)]">{stand.sold_units}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">Vendidas</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--sf-text-primary)]">{stand.reserved_units}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">Reservadas</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[var(--sf-text-primary)]">{stand.total_units - stand.sold_units - stand.reserved_units}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">Disponíveis</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--sf-text-tertiary)]">Meta mensal</span>
                    <span className="text-xs font-medium text-[var(--sf-text-secondary)]">{stand.monthly_sales}/{stand.monthly_target} ({percent}%)</span>
                  </div>
                  <ProgressBar value={stand.monthly_sales} max={stand.monthly_target} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--sf-border)]">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--sf-text-muted)]" />
                    <span className="text-xs text-[var(--sf-text-tertiary)]">{stand.manager_name}</span>
                  </div>
                  <span className="text-[10px] text-[var(--sf-text-muted)] uppercase">{stand.type}</span>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Stand Detail Modal */}
      <Modal
        open={!!selectedStand}
        onClose={() => setSelectedStand(null)}
        title={selectedStand?.name || ''}
        size="lg"
      >
        {selectedStand && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Unidades', value: selectedStand.total_units },
                { label: 'Vendidas', value: selectedStand.sold_units },
                { label: 'Reservadas', value: selectedStand.reserved_units },
                { label: 'Disponíveis', value: selectedStand.total_units - selectedStand.sold_units - selectedStand.reserved_units },
              ].map((stat) => (
                <div key={stat.label} className="p-4 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                  <p className="text-2xl font-bold text-[var(--sf-text-primary)]">{stat.value}</p>
                  <p className="text-xs text-[var(--sf-text-tertiary)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--sf-text-secondary)]">Informações</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-[var(--sf-text-tertiary)]">Endereço:</span> <span className="text-[var(--sf-text-secondary)]">{selectedStand.address}</span></div>
                <div><span className="text-[var(--sf-text-tertiary)]">Cidade:</span> <span className="text-[var(--sf-text-secondary)]">{selectedStand.city}, {selectedStand.state}</span></div>
                <div><span className="text-[var(--sf-text-tertiary)]">Tipo:</span> <span className="text-[var(--sf-text-secondary)] capitalize">{selectedStand.type}</span></div>
                <div><span className="text-[var(--sf-text-tertiary)]">Gerente:</span> <span className="text-[var(--sf-text-secondary)]">{selectedStand.manager_name}</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium text-[var(--sf-text-secondary)]">Meta Mensal</h4>
              <ProgressBar value={selectedStand.monthly_sales} max={selectedStand.monthly_target} showLabel />
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

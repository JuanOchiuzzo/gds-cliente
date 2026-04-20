'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Search, Plus } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Modal } from '@/components/ui/modal';
import { useStands, type StandRow } from '@/lib/hooks/use-stands';
import { toast } from 'sonner';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const statusLabel: Record<string, string> = { ativo: 'Ativo', inativo: 'Inativo', em_montagem: 'Em Montagem' };
const statusVariant: Record<string, 'emerald' | 'amber' | 'zinc'> = { ativo: 'emerald', em_montagem: 'amber', inativo: 'zinc' };

export default function StandsPage() {
  const { stands, loading, create } = useStands();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<StandRow | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const filtered = stands.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.city || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  const handleCreate = async () => {
    if (!newName) { toast.error('Nome é obrigatório'); return; }
    await create({ name: newName, city: newCity || null, state: newState || null, address: newAddress || null });
    toast.success('Stand criado!');
    setShowNew(false);
    setNewName(''); setNewCity(''); setNewState(''); setNewAddress('');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--text)]">Stands</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{stands.length} stands cadastrados</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" /> Novo Stand
        </Button>
      </motion.div>

      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar stands..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
        </div>
        <div className="flex gap-2">
          {['all', 'ativo', 'em_montagem', 'inativo'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border transition-all ${
                filter === f ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-muted)]'
              }`}>
              {f === 'all' ? 'Todos' : statusLabel[f]}
            </button>
          ))}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <GlassCard hover={false} className="!p-8 text-center">
          <Building2 className="w-10 h-10 mx-auto text-[var(--text-faint)] mb-3" />
          <p className="text-sm text-[var(--text-muted)]">{stands.length === 0 ? 'Nenhum stand cadastrado' : 'Nenhum stand encontrado'}</p>
        </GlassCard>
      ) : (
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((stand) => {
            const percent = stand.monthly_target > 0 ? Math.round((stand.monthly_sales / stand.monthly_target) * 100) : 0;
            return (
              <motion.div key={stand.id} variants={fadeUp}>
                <GlassCard className="cursor-pointer" onClick={() => setSelected(stand)}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-[var(--border)] flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-[var(--text)]">{stand.name}</h3>
                        {stand.city && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-[var(--text-faint)]" />
                            <span className="text-xs text-[var(--text-muted)]">{stand.city}, {stand.state}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant={statusVariant[stand.status]}>{statusLabel[stand.status]}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div><p className="text-lg font-bold text-[var(--text)]">{stand.sold_units}</p><p className="text-[10px] text-[var(--text-muted)]">Vendidas</p></div>
                    <div><p className="text-lg font-bold text-[var(--text)]">{stand.reserved_units}</p><p className="text-[10px] text-[var(--text-muted)]">Reservadas</p></div>
                    <div><p className="text-lg font-bold text-[var(--text)]">{stand.total_units - stand.sold_units - stand.reserved_units}</p><p className="text-[10px] text-[var(--text-muted)]">Disponíveis</p></div>
                  </div>
                  {stand.monthly_target > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--text-muted)]">Meta mensal</span>
                        <span className="text-xs font-medium text-[var(--text-secondary)]">{stand.monthly_sales}/{stand.monthly_target} ({percent}%)</span>
                      </div>
                      <ProgressBar value={stand.monthly_sales} max={stand.monthly_target} />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: selected.total_units },
                { label: 'Vendidas', value: selected.sold_units },
                { label: 'Reservadas', value: selected.reserved_units },
                { label: 'Disponíveis', value: selected.total_units - selected.sold_units - selected.reserved_units },
              ].map((s) => (
                <div key={s.label} className="p-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
                  <p className="text-2xl font-bold text-[var(--text)]">{s.value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
                </div>
              ))}
            </div>
            {selected.address && <p className="text-sm text-[var(--text-secondary)]">📍 {selected.address} — {selected.city}, {selected.state}</p>}
          </div>
        )}
      </Modal>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Novo Stand" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs text-[var(--text-muted)] font-medium">Nome *</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none" placeholder="Nome do stand" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--text-muted)] font-medium">Cidade</label>
              <input value={newCity} onChange={(e) => setNewCity(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none" placeholder="São Paulo" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--text-muted)] font-medium">Estado</label>
              <input value={newState} onChange={(e) => setNewState(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none" placeholder="SP" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--text-muted)] font-medium">Endereço</label>
              <input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none" placeholder="Av. Exemplo, 123" /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleCreate}>Criar Stand</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

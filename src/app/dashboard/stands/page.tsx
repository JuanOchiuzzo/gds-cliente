'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Building2, MapPin, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Chip } from '@/components/ui/chip';
import { ProgressBar } from '@/components/ui/progress-bar';
import { NumberFlow } from '@/components/ui/number-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useStands, type StandRow } from '@/lib/hooks/use-stands';
import { staggerParent, slideUp } from '@/lib/motion';

const STATUS_LABEL: Record<string, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  em_montagem: 'Em montagem',
};
const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  ativo: 'success',
  em_montagem: 'warning',
  inativo: 'neutral',
};

export default function StandsPage() {
  const { stands, loading, create } = useStands();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<StandRow | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', city: '', state: '', address: '' });

  const filtered = stands.filter((s) => {
    const ms =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.city || '').toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' || s.status === filter;
    return ms && mf;
  });

  const handleCreate = async () => {
    if (!form.name) {
      toast.error('Nome é obrigatório');
      return;
    }
    await create({
      name: form.name,
      city: form.city || null,
      state: form.state || null,
      address: form.address || null,
    });
    toast.success('Stand criado');
    setShowNew(false);
    setForm({ name: '', city: '', state: '', address: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerParent(0.05)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={slideUp} className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Stands</h1>
          <p className="mt-1 text-sm text-text-soft">{stands.length} pontos de venda</p>
        </div>
        <Button variant="solar" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo stand</span>
        </Button>
      </motion.div>

      <motion.div variants={slideUp} className="space-y-3">
        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Buscar por nome ou cidade…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <Chip active={filter === 'all'} onClick={() => setFilter('all')}>Todos</Chip>
          {['ativo', 'em_montagem', 'inativo'].map((f) => (
            <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
              {STATUS_LABEL[f]}
            </Chip>
          ))}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <Surface variant="elevated" padding="xl">
          <EmptyState
            icon={<Building2 className="w-6 h-6" />}
            title={stands.length === 0 ? 'Nenhum stand ainda' : 'Nada encontrado'}
            description="Cadastre o primeiro stand para começar."
          />
        </Surface>
      ) : (
        <motion.div
          variants={staggerParent(0.04)}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((stand) => (
            <motion.div key={stand.id} variants={slideUp}>
              <StandCard stand={stand} onClick={() => setSelected(stand)} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent size="lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-md bg-solar/15 border border-solar/30 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-solar" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display italic text-2xl text-text">{selected.name}</p>
                    {selected.city && (
                      <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {selected.city}, {selected.state}
                      </p>
                    )}
                  </div>
                  <Badge variant={STATUS_VARIANT[selected.status]}>
                    {STATUS_LABEL[selected.status]}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: selected.total_units },
                  { label: 'Vendidas', value: selected.sold_units },
                  { label: 'Reservadas', value: selected.reserved_units },
                  {
                    label: 'Disponíveis',
                    value: selected.total_units - selected.sold_units - selected.reserved_units,
                  },
                ].map((s) => (
                  <Surface key={s.label} variant="flat" padding="md">
                    <p className="text-2xl font-medium text-text">
                      <NumberFlow value={s.value} />
                    </p>
                    <p className="text-[11px] text-text-faint uppercase tracking-wider mt-0.5">
                      {s.label}
                    </p>
                  </Surface>
                ))}
              </div>

              {selected.monthly_target > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-text-faint uppercase tracking-wider">
                      Meta mensal
                    </span>
                    <span className="text-sm text-text-soft font-mono">
                      {selected.monthly_sales}/{selected.monthly_target}
                    </span>
                  </div>
                  <ProgressBar value={selected.monthly_sales} max={selected.monthly_target} showLabel />
                </div>
              )}

              {selected.address && (
                <p className="mt-4 text-sm text-text-soft">📍 {selected.address}</p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Novo stand</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Nome"
                placeholder="Nome do stand"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Input
                label="Cidade"
                placeholder="São Paulo"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              <Input
                label="Estado"
                placeholder="SP"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
              />
              <Input
                label="Endereço"
                placeholder="Av. Exemplo, 123"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNew(false)}>
                Cancelar
              </Button>
              <Button variant="solar" className="flex-1" onClick={handleCreate}>
                Criar stand
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function StandCard({ stand, onClick }: { stand: StandRow; onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotX = useSpring(useTransform(y, [-60, 60], [6, -6]), { stiffness: 280, damping: 24 });
  const rotY = useSpring(useTransform(x, [-60, 60], [-6, 6]), { stiffness: 280, damping: 24 });

  const percent =
    stand.monthly_target > 0
      ? Math.round((stand.monthly_sales / stand.monthly_target) * 100)
      : 0;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
      className="cursor-pointer"
    >
      <Surface variant="elevated" padding="lg" className="relative overflow-hidden h-full hover:border-border-glow">
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-solar/10 blur-[60px] pointer-events-none" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-surface-2 border border-border-strong flex items-center justify-center">
                <Building2 className="w-4 h-4 text-solar" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-text">{stand.name}</h3>
                {stand.city && (
                  <p className="text-[11px] text-text-faint flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {stand.city}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={STATUS_VARIANT[stand.status]} size="xs">
              {STATUS_LABEL[stand.status]}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <p className="text-xl font-medium text-text">
                <NumberFlow value={stand.sold_units} />
              </p>
              <p className="text-[10px] text-text-faint uppercase tracking-wider">Vendidas</p>
            </div>
            <div>
              <p className="text-xl font-medium text-text">
                <NumberFlow value={stand.reserved_units} />
              </p>
              <p className="text-[10px] text-text-faint uppercase tracking-wider">Reservadas</p>
            </div>
            <div>
              <p className="text-xl font-medium text-text">
                <NumberFlow value={stand.total_units - stand.sold_units - stand.reserved_units} />
              </p>
              <p className="text-[10px] text-text-faint uppercase tracking-wider">Livres</p>
            </div>
          </div>

          {stand.monthly_target > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-faint uppercase tracking-wider">Meta</span>
                <span className="text-xs text-text-soft font-mono">
                  {stand.monthly_sales}/{stand.monthly_target} · {percent}%
                </span>
              </div>
              <ProgressBar value={stand.monthly_sales} max={stand.monthly_target} />
            </div>
          )}
        </div>
      </Surface>
    </motion.div>
  );
}

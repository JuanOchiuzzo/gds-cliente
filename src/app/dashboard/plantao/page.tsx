'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Play, SkipForward, X, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useQueue, type QueueRow } from '@/lib/hooks/use-queue';
import { useStands } from '@/lib/hooks/use-stands';
import { useProfiles } from '@/lib/hooks/use-profiles';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';
import { staggerParent, slideUp, spring } from '@/lib/motion';

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: BadgeProps['variant']; accent: string }
> = {
  aguardando: { label: 'Aguardando', variant: 'info', accent: 'text-info' },
  atendendo: { label: 'Atendendo', variant: 'solar', accent: 'text-solar' },
  ausente: { label: 'Ausente', variant: 'danger', accent: 'text-danger' },
  finalizado: { label: 'Finalizado', variant: 'neutral', accent: 'text-text-faint' },
};

export default function PlantaoPage() {
  const { stands } = useStands();
  const { profiles } = useProfiles();
  const { profile } = useAuth();
  const [selectedStandId, setSelectedStandId] = useState('');
  const {
    queue,
    loading,
    addToQueue,
    updateStatus,
    removeFromQueue,
    advanceQueue,
  } = useQueue(selectedStandId || undefined);
  const [showAdd, setShowAdd] = useState(false);
  const [addAgentId, setAddAgentId] = useState('');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'gerente';
  const activeStands = stands.filter((s) => s.status === 'ativo');

  const queueByStand = useMemo(() => {
    const map: Record<string, QueueRow[]> = {};
    queue.forEach((q) => {
      if (!map[q.stand_id]) map[q.stand_id] = [];
      map[q.stand_id].push(q);
    });
    return map;
  }, [queue]);

  const handleAdd = async () => {
    if (!selectedStandId) {
      toast.error('Selecione um stand');
      return;
    }
    if (!addAgentId) {
      toast.error('Selecione um corretor');
      return;
    }
    const currentQueue = queue.filter((q) => q.stand_id === selectedStandId);
    const nextPosition = currentQueue.length + 1;
    const { error } = await addToQueue(addAgentId, selectedStandId, nextPosition, shiftDate);
    if (error) toast.error('Erro ao adicionar');
    else {
      toast.success('Adicionado à fila');
      setShowAdd(false);
      setAddAgentId('');
    }
  };

  const handleAdvance = async (standId: string) => {
    await advanceQueue(standId);
    toast.success('Fila avançada');
  };

  const handleStartFirst = async (standId: string) => {
    const standQueue = queue
      .filter((q) => q.stand_id === standId)
      .sort((a, b) => a.position - b.position);
    const first = standQueue.find((q) => q.status === 'aguardando');
    if (first) {
      await updateStatus(first.id, 'atendendo');
      toast.success(`${first.agent_name || 'Corretor'} atendendo`);
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remover ${name} da fila?`)) return;
    await removeFromQueue(id);
    toast.success('Removido');
  };

  const handleToggleAusente = async (item: QueueRow) => {
    const newStatus = item.status === 'ausente' ? 'aguardando' : 'ausente';
    await updateStatus(item.id, newStatus);
    toast.success(newStatus === 'ausente' ? 'Marcado ausente' : 'Voltou à fila');
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
      variants={staggerParent(0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={slideUp} className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Plantão</h1>
          <p className="mt-1 text-sm text-text-soft">Fila de atendimento por stand</p>
        </div>
        {isAdmin && (
          <Button variant="solar" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> Escalar
          </Button>
        )}
      </motion.div>

      <motion.div variants={slideUp}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <Chip active={!selectedStandId} onClick={() => setSelectedStandId('')}>
            Todos
          </Chip>
          {activeStands.map((s) => (
            <Chip
              key={s.id}
              active={selectedStandId === s.id}
              onClick={() => setSelectedStandId(s.id)}
            >
              {s.name}
            </Chip>
          ))}
        </div>
      </motion.div>

      {queue.length === 0 ? (
        <Surface variant="elevated" padding="xl">
          <EmptyState
            icon={<UserCircle className="w-6 h-6" />}
            title="Nenhum plantão"
            description="Nenhum corretor escalado para hoje."
            action={
              isAdmin && (
                <Button variant="solar" onClick={() => setShowAdd(true)}>
                  <Plus className="w-4 h-4" /> Escalar corretores
                </Button>
              )
            }
          />
        </Surface>
      ) : selectedStandId ? (
        <motion.div variants={slideUp}>
          <StandQueue
            standName={stands.find((s) => s.id === selectedStandId)?.name || 'Stand'}
            items={queue.sort((a, b) => a.position - b.position)}
            isAdmin={isAdmin}
            onAdvance={() => handleAdvance(selectedStandId)}
            onStartFirst={() => handleStartFirst(selectedStandId)}
            onRemove={handleRemove}
            onToggleAusente={handleToggleAusente}
          />
        </motion.div>
      ) : (
        Object.entries(queueByStand).map(([standId, items]) => (
          <motion.div key={standId} variants={slideUp}>
            <StandQueue
              standName={items[0]?.stand_name || 'Stand'}
              items={items.sort((a, b) => a.position - b.position)}
              isAdmin={isAdmin}
              onAdvance={() => handleAdvance(standId)}
              onStartFirst={() => handleStartFirst(standId)}
              onRemove={handleRemove}
              onToggleAusente={handleToggleAusente}
            />
          </motion.div>
        ))
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Escalar corretor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select
              label="Stand"
              value={selectedStandId}
              onChange={setSelectedStandId}
              placeholder="Selecionar…"
              options={activeStands.map((s) => ({ value: s.id, label: s.name }))}
            />
            <Select
              label="Corretor"
              value={addAgentId}
              onChange={setAddAgentId}
              placeholder="Selecionar…"
              options={profiles.map((p) => ({
                value: p.id,
                label: `${p.full_name} (${p.role})`,
              }))}
            />
            <Input
              label="Data"
              type="date"
              value={shiftDate}
              onChange={(e) => setShiftDate(e.target.value)}
            />
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>
                Cancelar
              </Button>
              <Button variant="solar" className="flex-1" onClick={handleAdd}>
                Escalar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function StandQueue({
  standName,
  items,
  isAdmin,
  onAdvance,
  onStartFirst,
  onRemove,
  onToggleAusente,
}: {
  standName: string;
  items: QueueRow[];
  isAdmin: boolean;
  onAdvance: () => void;
  onStartFirst: () => void;
  onRemove: (id: string, name: string) => void;
  onToggleAusente: (item: QueueRow) => void;
}) {
  const hasAtendendo = items.some((q) => q.status === 'atendendo');
  const nextUp = items.find((q) => q.status === 'aguardando');
  const activeItems = items.filter(
    (q) => q.status === 'atendendo' || q.status === 'aguardando'
  );
  const ausenteItems = items.filter((q) => q.status === 'ausente');
  const orderedItems = [...activeItems, ...ausenteItems];

  return (
    <Surface variant="elevated" padding="md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-solar/10 border border-solar/25 flex items-center justify-center">
            <UserCircle className="w-4 h-4 text-solar" />
          </div>
          <h3 className="text-sm font-medium text-text">{standName}</h3>
          <Badge variant="neutral" size="xs">
            {activeItems.length}
          </Badge>
        </div>
        {isAdmin && (
          <div className="flex gap-1.5">
            {!hasAtendendo && nextUp && (
              <Button variant="solar" size="sm" onClick={onStartFirst}>
                <Play className="w-3.5 h-3.5" /> Iniciar
              </Button>
            )}
            {hasAtendendo && (
              <Button variant="outline" size="sm" onClick={onAdvance}>
                <SkipForward className="w-3.5 h-3.5" /> Próximo
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {orderedItems.map((item, i) => {
          const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.aguardando;
          const dPos = item.status === 'ausente' ? null : i + 1;
          return (
            <motion.div
              key={item.id}
              layout
              transition={spring}
              className={cn(
                'flex items-center gap-3 p-3 rounded-md border transition-colors',
                item.status === 'atendendo'
                  ? 'bg-solar/10 border-solar/30'
                  : item.status === 'ausente'
                  ? 'bg-danger/5 border-danger/20 opacity-60'
                  : 'bg-surface-1 border-border'
              )}
            >
              <span className="text-sm font-mono text-text-faint w-7 text-center">
                {dPos ? `${dPos}º` : '—'}
              </span>
              <Avatar name={item.agent_name || 'Corretor'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {item.agent_name || 'Corretor'}
                </p>
                <Badge variant={cfg.variant} size="xs">
                  {cfg.label}
                </Badge>
              </div>
              {item.status === 'atendendo' && (
                <span className="w-2.5 h-2.5 rounded-full bg-solar animate-pulse-solar" />
              )}
              {isAdmin && (
                <div className="flex gap-1">
                  <button
                    onClick={() => onToggleAusente(item)}
                    className="w-7 h-7 rounded-sm flex items-center justify-center text-text-faint hover:bg-surface-2 text-[10px]"
                  >
                    {item.status === 'ausente' ? '✅' : '🚫'}
                  </button>
                  <button
                    onClick={() => onRemove(item.id, item.agent_name || '')}
                    className="w-7 h-7 rounded-sm flex items-center justify-center text-danger hover:bg-danger/10"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </Surface>
  );
}

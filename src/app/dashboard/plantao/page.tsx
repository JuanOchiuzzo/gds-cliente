'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Play, SkipForward, X, Clock, UserCircle, ChevronDown } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { useQueue, type QueueRow } from '@/lib/hooks/use-queue';
import { useStands } from '@/lib/hooks/use-stands';
import { useAgents } from '@/lib/hooks/use-agents';
import { useProfiles } from '@/lib/hooks/use-profiles';
import { useAuth } from '@/lib/auth-context';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusConfig: Record<string, { label: string; color: string; variant: 'cyan' | 'emerald' | 'amber' | 'red' | 'zinc' }> = {
  aguardando: { label: 'Aguardando', color: 'text-blue-600 dark:text-cyan-400', variant: 'cyan' },
  atendendo: { label: 'Atendendo', color: 'text-amber-600 dark:text-amber-400', variant: 'amber' },
  ausente: { label: 'Ausente', color: 'text-red-600 dark:text-red-400', variant: 'red' },
  finalizado: { label: 'Finalizado', color: 'text-zinc-500', variant: 'zinc' },
};

export default function PlantaoPage() {
  const { stands } = useStands();
  const { agents } = useAgents();
  const { profiles } = useProfiles();
  const { profile } = useAuth();
  const [selectedStandId, setSelectedStandId] = useState('');
  const { queue, loading, addToQueue, updateStatus, removeFromQueue, advanceQueue } = useQueue(selectedStandId || undefined);
  const [showAdd, setShowAdd] = useState(false);
  const [addAgentName, setAddAgentName] = useState('');
  const [shiftDate, setShiftDate] = useState(new Date().toISOString().split('T')[0]);

  const isAdmin = profile?.role === 'admin' || profile?.role === 'gerente';
  const activeStands = stands.filter((s) => s.status === 'ativo');

  // Group queue by stand
  const queueByStand = useMemo(() => {
    const map: Record<string, QueueRow[]> = {};
    queue.forEach((q) => {
      const key = q.stand_id;
      if (!map[key]) map[key] = [];
      map[key].push(q);
    });
    return map;
  }, [queue]);

  const handleAdd = async () => {
    if (!selectedStandId) { toast.error('Selecione um stand'); return; }
    if (!addAgentName) { toast.error('Selecione um corretor'); return; }

    // Find agent id from profiles or use the name
    const currentQueue = queue.filter((q) => q.stand_id === selectedStandId);
    const nextPosition = currentQueue.length + 1;

    // We need the agent's user id — for demo we'll use the profile id
    // Since demo agents are in agent_stats (not auth), we'll use profile.id for real users
    const { error } = await addToQueue(
      addAgentName, // this should be a user id
      selectedStandId,
      nextPosition,
      shiftDate
    );

    if (error) {
      toast.error('Erro ao adicionar. Verifique se o corretor já está na fila.');
    } else {
      toast.success('Adicionado à fila!');
      setShowAdd(false);
      setAddAgentName('');
    }
  };

  const handleAdvance = async (standId: string) => {
    await advanceQueue(standId);
    toast.success('Fila avançada!');
  };

  const handleStartFirst = async (standId: string) => {
    const standQueue = queue.filter((q) => q.stand_id === standId).sort((a, b) => a.position - b.position);
    const first = standQueue.find((q) => q.status === 'aguardando');
    if (first) {
      await updateStatus(first.id, 'atendendo');
      toast.success(`${first.agent_name || 'Corretor'} está atendendo!`);
    }
  };

  const handleRemove = async (id: string, name: string) => {
    if (!confirm(`Remover ${name} da fila?`)) return;
    await removeFromQueue(id);
    toast.success('Removido da fila');
  };

  const handleToggleAusente = async (item: QueueRow) => {
    const newStatus = item.status === 'ausente' ? 'aguardando' : 'ausente';
    await updateStatus(item.id, newStatus);
    toast.success(newStatus === 'ausente' ? 'Marcado como ausente' : 'Voltou pra fila');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Plantão</h1>
          <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">Fila de atendimento por stand</p>
        </div>
        {isAdmin && (
          <Button variant="neon" size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> Escalar
          </Button>
        )}
      </motion.div>

      {/* Stand selector */}
      <motion.div variants={fadeUp}>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setSelectedStandId('')}
            className={`px-3 py-2 text-xs font-medium rounded-xl border whitespace-nowrap transition-all ${
              !selectedStandId ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300' : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
            }`}>
            Todos
          </button>
          {activeStands.map((s) => (
            <button key={s.id} onClick={() => setSelectedStandId(s.id)}
              className={`px-3 py-2 text-xs font-medium rounded-xl border whitespace-nowrap transition-all ${
                selectedStandId === s.id ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300' : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
              }`}>
              {s.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Queue display */}
      {queue.length === 0 ? (
        <GlassCard hover={false} className="!p-8 text-center">
          <UserCircle className="w-10 h-10 mx-auto text-[var(--sf-text-muted)] mb-3" />
          <p className="text-sm text-[var(--sf-text-tertiary)]">Nenhum plantão escalado para hoje</p>
          {isAdmin && (
            <Button variant="neon" size="sm" className="mt-4" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4" /> Escalar Corretores
            </Button>
          )}
        </GlassCard>
      ) : (
        <>
          {/* If filtering by stand, show single list */}
          {selectedStandId ? (
            <motion.div variants={fadeUp}>
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
            /* Show grouped by stand */
            Object.entries(queueByStand).map(([standId, items]) => (
              <motion.div key={standId} variants={fadeUp}>
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
        </>
      )}

      {/* Add to queue modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Escalar Corretor" size="sm">
        <div className="space-y-4">
          <Select
            label="Stand *"
            value={selectedStandId}
            onChange={setSelectedStandId}
            placeholder="Selecionar stand..."
            options={activeStands.map((s) => ({ value: s.id, label: s.name }))}
          />
          <Select
            label="Corretor *"
            value={addAgentName}
            onChange={setAddAgentName}
            placeholder="Selecionar corretor..."
            options={profiles.map((p) => ({ value: p.id, label: `${p.full_name} (${p.role})` }))}
          />
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Data</label>
            <input type="date" value={shiftDate} onChange={(e) => setShiftDate(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleAdd}>Escalar</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

// ── Stand Queue Component ──
function StandQueue({
  standName, items, isAdmin, onAdvance, onStartFirst, onRemove, onToggleAusente,
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

  return (
    <GlassCard hover={false} className="!p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
          <h3 className="text-sm font-semibold text-[var(--sf-text-primary)]">{standName}</h3>
          <span className="text-[10px] bg-[var(--sf-surface)] text-[var(--sf-text-muted)] px-2 py-0.5 rounded-lg border border-[var(--sf-border)]">
            {items.length} na fila
          </span>
        </div>
        {isAdmin && (
          <div className="flex gap-1.5">
            {!hasAtendendo && nextUp && (
              <Button variant="primary" size="sm" onClick={onStartFirst}>
                <Play className="w-3.5 h-3.5" /> Iniciar
              </Button>
            )}
            {hasAtendendo && (
              <Button variant="primary" size="sm" onClick={onAdvance}>
                <SkipForward className="w-3.5 h-3.5" /> Próximo
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const cfg = statusConfig[item.status] || statusConfig.aguardando;
          return (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
              item.status === 'atendendo'
                ? 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'
                : item.status === 'ausente'
                ? 'bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20 opacity-60'
                : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
            }`}>
              <span className="text-sm font-bold text-[var(--sf-text-muted)] w-6 text-center">{item.position}º</span>
              <Avatar name={item.agent_name || 'Corretor'} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{item.agent_name || 'Corretor'}</p>
                <Badge variant={cfg.variant} className="!text-[9px] mt-0.5">{cfg.label}</Badge>
              </div>
              {item.status === 'atendendo' && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              )}
              {isAdmin && (
                <div className="flex gap-1">
                  <button onClick={() => onToggleAusente(item)}
                    className="p-1.5 rounded-lg text-[var(--sf-text-muted)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)] text-[10px]">
                    {item.status === 'ausente' ? '✅' : '🚫'}
                  </button>
                  <button onClick={() => onRemove(item.id, item.agent_name || '')}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

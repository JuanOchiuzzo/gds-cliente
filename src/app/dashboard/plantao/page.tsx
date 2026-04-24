'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  LogIn,
  LogOut,
  Radio,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Select } from '@/components/ui/select';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useQueue, type QueueRow } from '@/lib/hooks/use-queue';
import { useStands } from '@/lib/hooks/use-stands';
import { useAuth } from '@/lib/auth-context';
import { cn, timeAgo } from '@/lib/utils';

const STATUS: Record<QueueRow['status'], { label: string; variant: BadgeVariant }> = {
  aguardando: { label: 'Aguardando', variant: 'info' },
  atendendo: { label: 'Atendendo', variant: 'ok' },
  ausente: { label: 'Ausente', variant: 'warn' },
  finalizado: { label: 'Finalizado', variant: 'neutral' },
};

export default function PlantaoPage() {
  const { stands } = useStands();
  const { user } = useAuth();
  const [standId, setStandId] = useState<string>('');

  const activeStandId = standId || stands[0]?.id || '';
  const { queue, loading, myPosition, addToQueue, updateStatus, removeFromQueue, advanceQueue } = useQueue(activeStandId);

  const standQueue = useMemo(
    () => queue.filter((q) => q.stand_id === activeStandId).sort((a, b) => a.position - b.position),
    [queue, activeStandId],
  );

  const enterQueue = async () => {
    if (!user || !activeStandId) return;
    const nextPos = (standQueue[standQueue.length - 1]?.position || 0) + 1;
    const { error } = await addToQueue(user.id, activeStandId, nextPos);
    if (error) toast.error('Erro ao entrar na fila.');
    else toast.success('Você entrou na fila.');
  };
  const leaveQueue = async () => {
    if (!myPosition) return;
    const { error } = await removeFromQueue(myPosition.id);
    if (error) toast.error('Erro ao sair.');
    else toast.success('Você saiu da fila.');
  };
  const toggleAbsent = async () => {
    if (!myPosition) return;
    const next = myPosition.status === 'ausente' ? 'aguardando' : 'ausente';
    await updateStatus(myPosition.id, next);
  };

  const iAmHere = !!myPosition && myPosition.stand_id === activeStandId;
  const activeStand = stands.find((s) => s.id === activeStandId);

  return (
    <div>
      <PageHeader
        eyebrow="Ao vivo"
        title="Plantão"
        description="Fila de atendimento em tempo real."
        actions={<Radio className="h-5 w-5 text-ok animate-pulse" />}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-4"
      >
        <Card variant="solid" padding="md">
          <Select label="Stand" value={activeStandId} onChange={(e) => setStandId(e.target.value)}>
            {stands.length === 0 && <option value="">Nenhum stand</option>}
            {stands.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
        </Card>
      </motion.section>

      {loading ? (
        <PageSkeleton />
      ) : !activeStand ? (
        <Card variant="glass" padding="xl">
          <EmptyState icon={<Building2 className="h-5 w-5" />} title="Sem stands" description="Cadastre um stand para usar o plantão." />
        </Card>
      ) : (
        <>
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-5"
          >
            <Card variant="strong" padding="lg">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-[14px]',
                  iAmHere ? 'bg-ok/15 text-ok animate-pulse-ring' : 'bg-white/[0.05] text-fg-muted',
                )}>
                  <UserCheck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
                    Seu status
                  </p>
                  <p className="text-sm font-semibold text-fg">
                    {iAmHere ? `Posição ${myPosition?.position} · ${STATUS[myPosition!.status].label}` : 'Fora da fila'}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {!iAmHere ? (
                  <Button onClick={enterQueue} size="md">
                    <LogIn className="h-4 w-4" /> Entrar na fila
                  </Button>
                ) : (
                  <>
                    <Button variant="secondary" size="md" onClick={toggleAbsent}>
                      <UserX className="h-4 w-4" />
                      {myPosition?.status === 'ausente' ? 'Voltar' : 'Ausentar'}
                    </Button>
                    <Button variant="danger" size="md" onClick={leaveQueue}>
                      <LogOut className="h-4 w-4" /> Sair
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="md" onClick={() => advanceQueue(activeStandId)}>
                  <ArrowRight className="h-4 w-4" /> Avançar fila
                </Button>
              </div>
            </Card>
          </motion.section>

          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-fg">Fila · {standQueue.length}</h2>
            <Chip active>
              <Users className="h-3 w-3" /> {activeStand.name}
            </Chip>
          </div>

          {standQueue.length === 0 ? (
            <Card variant="glass" padding="xl">
              <EmptyState icon={<Users className="h-5 w-5" />} title="Fila vazia" description="Ninguém no plantão no momento." />
            </Card>
          ) : (
            <ul className="space-y-2">
              {standQueue.map((q) => {
                const s = STATUS[q.status];
                const mine = q.agent_id === user?.id;
                return (
                  <li key={q.id}>
                    <Card
                      variant={q.status === 'atendendo' ? 'glass' : 'solid'}
                      padding="md"
                      className={cn('flex items-center gap-3', mine && 'border-iris/40')}
                    >
                      <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] font-bold',
                        q.status === 'atendendo' ? 'bg-ok/20 text-ok' : 'bg-white/[0.05] text-fg-soft',
                      )}>
                        {q.position}
                      </div>
                      <Avatar name={q.agent_name} size="md" dot={q.status === 'atendendo' ? 'ok' : undefined} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-fg">
                          {q.agent_name || 'Corretor'} {mine && <span className="text-iris-hi">· você</span>}
                        </p>
                        <p className="truncate text-xs text-fg-muted">Entrou {timeAgo(q.entered_at)}</p>
                      </div>
                      <Badge variant={s.variant} size="sm">{s.label}</Badge>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

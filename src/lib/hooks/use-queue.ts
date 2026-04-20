'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

export interface QueueRow {
  id: string;
  stand_id: string;
  agent_id: string;
  position: number;
  status: 'aguardando' | 'atendendo' | 'ausente' | 'finalizado';
  shift_date: string;
  entered_at: string;
  updated_at: string;
  agent_name?: string;
  stand_name?: string;
}

export function useQueue(standId?: string) {
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = getSupabase();

  const today = new Date().toISOString().split('T')[0];

  const fetch = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('queue')
      .select('*, profiles(full_name), stands(name)')
      .eq('shift_date', today)
      .neq('status', 'finalizado')
      .order('position');

    if (standId) query = query.eq('stand_id', standId);

    const { data } = await query;

    const mapped = (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      agent_name: (d.profiles as Record<string, string> | null)?.full_name || null,
      stand_name: (d.stands as Record<string, string> | null)?.name || null,
    })) as QueueRow[];

    setQueue(mapped);
    setLoading(false);
  }, [supabase, standId, today]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('queue-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue' }, () => {
        fetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetch]);

  const myPosition = queue.find((q) => q.agent_id === user?.id);

  const addToQueue = async (agentId: string, sId: string, position: number, date?: string) => {
    const { error } = await supabase.from('queue').insert({
      agent_id: agentId,
      stand_id: sId,
      position,
      shift_date: date || today,
      status: 'aguardando',
    });
    if (!error) fetch();
    return { error };
  };

  const updateStatus = async (id: string, status: QueueRow['status']) => {
    const { error } = await supabase.from('queue').update({ status }).eq('id', id);
    if (!error) fetch();
    return { error };
  };

  const removeFromQueue = async (id: string) => {
    const { error } = await supabase.from('queue').delete().eq('id', id);
    if (!error) fetch();
    return { error };
  };

  const advanceQueue = async (sId: string) => {
    const standQueue = queue.filter((q) => q.stand_id === sId).sort((a, b) => a.position - b.position);
    const current = standQueue.find((q) => q.status === 'atendendo');
    const next = standQueue.find((q) => q.status === 'aguardando');

    // Finalize current
    if (current) await supabase.from('queue').update({ status: 'finalizado' }).eq('id', current.id);

    // Promote next to atendendo
    if (next) await supabase.from('queue').update({ status: 'atendendo' }).eq('id', next.id);

    // Recalculate positions: only active (aguardando/atendendo) get sequential positions
    const remaining = standQueue.filter((q) =>
      q.id !== current?.id && (q.status === 'aguardando' || q.id === next?.id)
    );
    for (let i = 0; i < remaining.length; i++) {
      await supabase.from('queue').update({ position: i + 1 }).eq('id', remaining[i].id);
    }

    fetch();
  };

  return { queue, loading, myPosition, refetch: fetch, addToQueue, updateStatus, removeFromQueue, advanceQueue };
}

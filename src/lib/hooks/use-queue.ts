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
  // joined
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

  return { queue, loading, myPosition, refetch: fetch };
}

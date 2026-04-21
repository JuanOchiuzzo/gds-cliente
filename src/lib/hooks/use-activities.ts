'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { pickRelation } from '@/lib/utils';

export interface ActivityRow {
  id: string;
  lead_id: string | null;
  stand_id: string | null;
  agent_id: string | null;
  type: string;
  description: string | null;
  created_at: string;
  agent_name?: string;
}

export function useActivities(limit = 10) {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('activities')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    const mapped = (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      agent_name: pickRelation<string>(d.profiles, 'full_name'),
    })) as ActivityRow[];

    setActivities(mapped);
    setLoading(false);
  }, [supabase, limit]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('activities-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, () => {
        fetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetch]);

  const create = async (activity: Partial<ActivityRow>) => {
    const { error } = await supabase.from('activities').insert(activity);
    return { error };
  };

  return { activities, loading, refetch: fetch, create };
}

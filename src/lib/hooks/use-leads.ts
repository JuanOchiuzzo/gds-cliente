'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';

export interface LeadRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  source: string | null;
  stage: string;
  stand_id: string | null;
  agent_id: string | null;
  estimated_value: number;
  ai_score: number;
  notes: string | null;
  interested_unit: string | null;
  created_at: string;
  updated_at: string;
  // joined
  stand_name?: string;
  agent_name?: string;
}

export function useLeads() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('leads')
      .select('*, stands(name), profiles(full_name)')
      .order('updated_at', { ascending: false });

    const mapped = (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      stand_name: (d.stands as Record<string, string> | null)?.name || null,
      agent_name: (d.profiles as Record<string, string> | null)?.full_name || null,
    })) as LeadRow[];

    setLeads(mapped);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetch]);

  const create = async (lead: Partial<LeadRow>) => {
    const { data, error } = await supabase.from('leads').insert(lead).select().single();
    if (!error) fetch();
    return { data, error };
  };

  const update = async (id: string, updates: Partial<LeadRow>) => {
    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
    if (!error) fetch();
    return { data, error };
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) setLeads((prev) => prev.filter((l) => l.id !== id));
    return { error };
  };

  return { leads, loading, refetch: fetch, create, update, remove };
}

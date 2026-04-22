'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { pickRelation } from '@/lib/utils';

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

const PAGE_SIZE = 50;
const MAX_FETCH_ALL = 5000;

export interface UseLeadsOptions {
  /** If true, fetch all leads at once (up to MAX_FETCH_ALL). Use for kanban/reports/AI. */
  fetchAll?: boolean;
  /** Override default page size (50). Ignored when fetchAll=true. */
  pageSize?: number;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const { fetchAll = false } = options;
  const pageSize = options.pageSize ?? PAGE_SIZE;
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const supabase = getSupabase();

  const mapRow = (d: Record<string, unknown>): LeadRow => ({
    ...(d as unknown as LeadRow),
    stand_name: pickRelation<string>(d.stands, 'name') || undefined,
    agent_name: pickRelation<string>(d.profiles, 'full_name') || undefined,
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    const upper = fetchAll ? MAX_FETCH_ALL - 1 : pageSize - 1;
    const { data, count } = await supabase
      .from('leads')
      .select('*, stands(name), profiles(full_name)', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(0, upper);

    const mapped = (data || []).map((d: Record<string, unknown>) => mapRow(d));
    setLeads(mapped);
    setTotal(count || mapped.length);
    setHasMore(!fetchAll && (count || 0) > mapped.length);
    setLoading(false);
  }, [supabase, fetchAll, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || fetchAll) return;
    setLoadingMore(true);
    const from = leads.length;
    const to = from + pageSize - 1;
    const { data } = await supabase
      .from('leads')
      .select('*, stands(name), profiles(full_name)')
      .order('updated_at', { ascending: false })
      .range(from, to);
    const mapped = (data || []).map((d: Record<string, unknown>) => mapRow(d));
    setLeads((prev) => {
      const seen = new Set(prev.map((l) => l.id));
      return [...prev, ...mapped.filter((l) => !seen.has(l.id))];
    });
    setHasMore(mapped.length === pageSize);
    setLoadingMore(false);
  }, [supabase, leads.length, loadingMore, hasMore, fetchAll, pageSize]);

  const fetchRef = useRef(fetch);
  useEffect(() => {
    fetchRef.current = fetch;
  }, [fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`leads-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        fetchRef.current();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const create = async (lead: Partial<LeadRow>) => {
    const { data, error } = await supabase.from('leads').insert(lead).select().single();
    if (!error) fetch();
    return { data, error };
  };

  const update = async (id: string, updates: Partial<LeadRow>) => {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error) fetch();
    return { data, error };
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (!error) setLeads((prev) => prev.filter((l) => l.id !== id));
    return { error };
  };

  return {
    leads,
    loading,
    loadingMore,
    total,
    hasMore,
    loadMore,
    refetch: fetch,
    create,
    update,
    remove,
  };
}

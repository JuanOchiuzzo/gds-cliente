'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';

export interface StandRow {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  lat: number | null;
  lng: number | null;
  photo_url: string | null;
  status: 'ativo' | 'inativo' | 'em_montagem';
  type: 'fixo' | 'evento' | 'shopping' | 'virtual' | null;
  total_units: number;
  sold_units: number;
  reserved_units: number;
  monthly_target: number;
  monthly_sales: number;
  manager_id: string | null;
  created_at: string;
}

export function useStands() {
  const [stands, setStands] = useState<StandRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.from('stands').select('*').order('name');
    setStands((data as StandRow[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  const create = async (stand: Partial<StandRow>) => {
    const { data, error } = await supabase.from('stands').insert(stand).select().single();
    if (!error && data) setStands((prev) => [...prev, data as StandRow]);
    return { data, error };
  };

  const update = async (id: string, updates: Partial<StandRow>) => {
    const { error } = await supabase.from('stands').update(updates).eq('id', id);
    if (!error) setStands((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    return { error };
  };

  return { stands, loading, refetch: fetch, create, update };
}

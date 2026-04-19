'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';

export interface AgentRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  phone: string | null;
  created_at: string;
}

export function useAgents() {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['corretor', 'gerente'])
      .order('full_name');
    setAgents((data as AgentRow[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  return { agents, loading, refetch: fetch };
}

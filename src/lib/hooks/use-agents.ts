'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';

export interface AgentRow {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  avatar_url: string | null;
  stand_name: string | null;
  total_sales: number;
  monthly_sales: number;
  monthly_target: number;
  total_leads: number;
  conversion_rate: number;
  revenue: number;
  status: string;
  created_at: string;
}

export function useAgents() {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('agent_stats')
      .select('*')
      .order('monthly_sales', { ascending: false });
    setAgents((data as AgentRow[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  return { agents, loading, refetch: fetch };
}

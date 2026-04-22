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

type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  phone: string | null;
  created_at: string;
};

type LeadStatRow = {
  agent_id: string | null;
  stage: string;
  estimated_value: number | null;
  stand_id: string | null;
  updated_at: string;
};

type StandRow = { id: string; name: string; manager_id: string | null };

export function useAgents() {
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    setLoading(true);

    const [profilesRes, leadsRes, standsRes] = await Promise.all([
      supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, role, phone, created_at')
        .in('role', ['corretor', 'gerente', 'admin']),
      supabase
        .from('leads')
        .select('agent_id, stage, estimated_value, stand_id, updated_at'),
      supabase.from('stands').select('id, name, manager_id'),
    ]);

    const profiles = (profilesRes.data || []) as ProfileRow[];
    const leads = (leadsRes.data || []) as LeadStatRow[];
    const stands = (standsRes.data || []) as StandRow[];

    const standById = new Map(stands.map((s) => [s.id, s.name]));
    const managerStand = new Map(
      stands.filter((s) => s.manager_id).map((s) => [s.manager_id as string, s.name])
    );

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const mostCommonStand = (agentId: string): string | null => {
      const counts = new Map<string, number>();
      for (const l of leads) {
        if (l.agent_id === agentId && l.stand_id) {
          counts.set(l.stand_id, (counts.get(l.stand_id) || 0) + 1);
        }
      }
      let best: string | null = null;
      let bestCount = 0;
      for (const [sid, c] of counts) {
        if (c > bestCount) {
          best = sid;
          bestCount = c;
        }
      }
      return best ? standById.get(best) || null : null;
    };

    const rows: AgentRow[] = profiles.map((p) => {
      const mine = leads.filter((l) => l.agent_id === p.id);
      const closed = mine.filter((l) => l.stage === 'fechado');
      const monthlyClosed = closed.filter((l) => l.updated_at >= firstDayOfMonth);
      const revenue = closed.reduce((sum, l) => sum + (Number(l.estimated_value) || 0), 0);
      const totalLeads = mine.length;
      const totalSales = closed.length;
      const conversion = totalLeads > 0 ? (totalSales / totalLeads) * 100 : 0;

      const standName = managerStand.get(p.id) || mostCommonStand(p.id);

      return {
        id: p.id,
        name: p.full_name || p.email || 'Sem nome',
        email: p.email,
        phone: p.phone,
        role: p.role,
        avatar_url: p.avatar_url,
        stand_name: standName,
        total_sales: totalSales,
        monthly_sales: monthlyClosed.length,
        monthly_target: 0,
        total_leads: totalLeads,
        conversion_rate: Math.round(conversion * 10) / 10,
        revenue,
        status: 'online',
        created_at: p.created_at,
      };
    });

    rows.sort((a, b) => b.monthly_sales - a.monthly_sales || b.total_sales - a.total_sales);

    setAgents(rows);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { agents, loading, refetch: fetch };
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { pickRelation } from '@/lib/utils';

export interface AppointmentRow {
  id: string;
  agent_id: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  product_name: string | null;
  stand_id: string | null;
  date: string;
  time: string;
  status: 'pendente' | 'confirmado' | 'realizado' | 'nao_compareceu' | 'cancelado';
  voucher_code: string;
  voucher_shared: boolean;
  visit_result: string | null;
  visit_notes: string | null;
  created_at: string;
  updated_at: string;
  // joined
  stand_name?: string;
  stand_address?: string;
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('appointments')
      .select('*, stands(name, address)')
      .eq('agent_id', user.id)
      .order('date', { ascending: false });

    const mapped = (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      stand_name: pickRelation<string>(d.stands, 'name'),
      stand_address: pickRelation<string>(d.stands, 'address'),
    })) as AppointmentRow[];

    setAppointments(mapped);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => { if (user) fetch(); }, [user, fetch]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
        fetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetch]);

  const create = async (apt: Partial<AppointmentRow>) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('appointments')
      .insert({ ...apt, agent_id: user.id })
      .select()
      .single();
    if (!error) fetch();
    return { data, error };
  };

  const update = async (id: string, updates: Partial<AppointmentRow>) => {
    const { error } = await supabase.from('appointments').update(updates).eq('id', id);
    if (!error) fetch();
    return { error };
  };

  const shareVoucher = async (id: string) => {
    return update(id, { voucher_shared: true } as Partial<AppointmentRow>);
  };

  const recordVisit = async (id: string, result: string, notes: string) => {
    return update(id, { status: 'realizado', visit_result: result, visit_notes: notes } as Partial<AppointmentRow>);
  };

  return { appointments, loading, refetch: fetch, create, update, shareVoucher, recordVisit };
}

'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

export interface WalletClientRow {
  id: string;
  agent_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  cpf: string | null;
  temperature: 'quente' | 'morno' | 'frio';
  notes: string | null;
  interested_product: string | null;
  stand_id: string | null;
  created_at: string;
  updated_at: string;
  // joined
  stand_name?: string;
}

export interface ClientTaskRow {
  id: string;
  client_id: string;
  agent_id: string;
  type: 'ligar' | 'agendar_visita' | 'enviar_proposta' | 'follow_up' | 'outro';
  description: string;
  due_date: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  // joined
  client_name?: string;
}

export function useWallet() {
  const [clients, setClients] = useState<WalletClientRow[]>([]);
  const [tasks, setTasks] = useState<ClientTaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = getSupabase();

  const fetchClients = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('wallet_clients')
      .select('*, stands(name)')
      .eq('agent_id', user.id)
      .order('updated_at', { ascending: false });

    const mapped = (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      stand_name: (d.stands as Record<string, string> | null)?.name || null,
    })) as WalletClientRow[];

    setClients(mapped);
  }, [supabase, user]);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('client_tasks')
      .select('*, wallet_clients(name)')
      .eq('agent_id', user.id)
      .order('due_date');

    const mapped = (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      client_name: (d.wallet_clients as Record<string, string> | null)?.name || null,
    })) as ClientTaskRow[];

    setTasks(mapped);
  }, [supabase, user]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchClients(), fetchTasks()]);
    setLoading(false);
  }, [fetchClients, fetchTasks]);

  useEffect(() => { if (user) fetchAll(); }, [user, fetchAll]);

  const createClient = async (client: Partial<WalletClientRow>) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('wallet_clients')
      .insert({ ...client, agent_id: user.id })
      .select()
      .single();
    if (!error) fetchClients();
    return { data, error };
  };

  const updateClient = async (id: string, updates: Partial<WalletClientRow>) => {
    const { error } = await supabase.from('wallet_clients').update(updates).eq('id', id);
    if (!error) fetchClients();
    return { error };
  };

  const deleteClient = async (id: string) => {
    const { error } = await supabase.from('wallet_clients').delete().eq('id', id);
    if (!error) setClients((prev) => prev.filter((c) => c.id !== id));
    return { error };
  };

  const createTask = async (task: Partial<ClientTaskRow>) => {
    if (!user) return { data: null, error: 'Not authenticated' };
    const { data, error } = await supabase
      .from('client_tasks')
      .insert({ ...task, agent_id: user.id })
      .select()
      .single();
    if (!error) fetchTasks();
    return { data, error };
  };

  const completeTask = async (id: string) => {
    const { error } = await supabase
      .from('client_tasks')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', id);
    if (!error) fetchTasks();
    return { error };
  };

  return {
    clients, tasks, loading,
    refetch: fetchAll,
    createClient, updateClient, deleteClient,
    createTask, completeTask,
  };
}

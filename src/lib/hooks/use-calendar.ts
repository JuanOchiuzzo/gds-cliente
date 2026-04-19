'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

export interface CalendarEventRow {
  id: string;
  title: string;
  description: string | null;
  type: string;
  start_time: string;
  end_time: string;
  lead_id: string | null;
  stand_id: string | null;
  agent_id: string | null;
  color: string;
  created_at: string;
}

export function useCalendarEvents() {
  const [events, setEvents] = useState<CalendarEventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('agent_id', user.id)
      .order('start_time');
    setEvents((data as CalendarEventRow[]) || []);
    setLoading(false);
  }, [supabase, user]);

  useEffect(() => { if (user) fetch(); }, [user, fetch]);

  const create = async (event: Partial<CalendarEventRow>) => {
    if (!user) return { error: 'Not authenticated' };
    const { error } = await supabase.from('calendar_events').insert({ ...event, agent_id: user.id });
    if (!error) fetch();
    return { error };
  };

  return { events, loading, refetch: fetch, create };
}

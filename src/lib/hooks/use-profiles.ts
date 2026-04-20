'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: string;
  phone: string | null;
}

export function useProfiles() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('id, email, full_name, avatar_url, role, phone')
      .in('role', ['corretor', 'gerente', 'admin'])
      .order('full_name');
    setProfiles((data as ProfileRow[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetch(); }, [fetch]);

  return { profiles, loading, refetch: fetch };
}

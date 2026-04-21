'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { pickRelation } from '@/lib/utils';

export interface ChatMessageRow {
  id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'image' | 'file';
  channel: string;
  created_at: string;
  sender_name?: string;
}

export function useChat(channel: string) {
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const supabase = getSupabase();

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*, profiles(full_name)')
      .eq('channel', channel)
      .order('created_at', { ascending: true })
      .limit(100);

    const mapped = (data || []).map((d: Record<string, unknown>) => ({
      ...d,
      sender_name: pickRelation<string>(d.profiles, 'full_name') || 'Anônimo',
    })) as ChatMessageRow[];

    setMessages(mapped);
    setLoading(false);
  }, [supabase, channel]);

  const fetchRef = useRef(fetch);
  useEffect(() => { fetchRef.current = fetch; }, [fetch]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel(`chat-${channel}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel=eq.${channel}`,
      }, () => {
        fetchRef.current();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase, channel]);

  const send = async (content: string) => {
    if (!user) return;
    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      content,
      type: 'text',
      channel,
    });
  };

  return { messages, loading, send, refetch: fetch };
}

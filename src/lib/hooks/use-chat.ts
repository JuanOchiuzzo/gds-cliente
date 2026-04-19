'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth-context';

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
      sender_name: (d.profiles as Record<string, string> | null)?.full_name || 'Anônimo',
    })) as ChatMessageRow[];

    setMessages(mapped);
    setLoading(false);
  }, [supabase, channel]);

  useEffect(() => { fetch(); }, [fetch]);

  // Realtime
  useEffect(() => {
    const ch = supabase
      .channel(`chat-${channel}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `channel=eq.${channel}`,
      }, () => {
        fetch();
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [supabase, channel, fetch]);

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

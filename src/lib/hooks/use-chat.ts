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

const PAGE_SIZE = 50;

export function useChat(channel: string) {
  const [messages, setMessages] = useState<ChatMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const { user } = useAuth();
  const supabase = getSupabase();

  const mapRow = (d: Record<string, unknown>): ChatMessageRow => ({
    ...(d as unknown as ChatMessageRow),
    sender_name: pickRelation<string>(d.profiles, 'full_name') || 'Anônimo',
  });

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('chat_messages')
      .select('*, profiles(full_name)')
      .eq('channel', channel)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);

    const mapped = (data || []).map((d: Record<string, unknown>) => mapRow(d));
    mapped.reverse();
    setMessages(mapped);
    setHasMore((data || []).length === PAGE_SIZE);
    setLoading(false);
  }, [supabase, channel]);

  const loadOlder = useCallback(async () => {
    if (loadingOlder || !hasMore || messages.length === 0) return;
    setLoadingOlder(true);
    const oldest = messages[0];
    const { data } = await supabase
      .from('chat_messages')
      .select('*, profiles(full_name)')
      .eq('channel', channel)
      .lt('created_at', oldest.created_at)
      .order('created_at', { ascending: false })
      .limit(PAGE_SIZE);

    const mapped = (data || []).map((d: Record<string, unknown>) => mapRow(d));
    mapped.reverse();
    setMessages((prev) => [...mapped, ...prev]);
    setHasMore((data || []).length === PAGE_SIZE);
    setLoadingOlder(false);
  }, [supabase, channel, messages, loadingOlder, hasMore]);

  const fetchRef = useRef(fetch);
  useEffect(() => {
    fetchRef.current = fetch;
  }, [fetch]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Realtime: append apenas novas mensagens (sem refetch completo)
  useEffect(() => {
    const ch = supabase
      .channel(`chat-${channel}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel=eq.${channel}`,
        },
        async (payload) => {
          const inserted = payload.new as { id: string; sender_id: string };
          // fetch nome do sender do payload (join não vem no realtime)
          const { data } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', inserted.sender_id)
            .single();
          const msg: ChatMessageRow = {
            ...(payload.new as unknown as ChatMessageRow),
            sender_name: data?.full_name || 'Anônimo',
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [supabase, channel]);

  const send = async (content: string) => {
    if (!user) return;
    const trimmed = content.trim();
    if (!trimmed) return;
    await supabase.from('chat_messages').insert({
      sender_id: user.id,
      content: trimmed,
      type: 'text',
      channel,
    });
  };

  return { messages, loading, loadingOlder, hasMore, loadOlder, send, refetch: fetch };
}

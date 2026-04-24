'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useChat } from '@/lib/hooks/use-chat';
import { useAuth } from '@/lib/auth-context';
import { cn } from '@/lib/utils';

const CHANNELS = ['geral', 'vendas', 'suporte'];

export default function ChatPage() {
  const { user, profile } = useAuth();
  const [channel, setChannel] = useState('geral');
  const { messages, loading, send } = useChat(channel);
  const [value, setValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, channel]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;
    setValue('');
    await send(v);
  };

  return (
    <div>
      <PageHeader eyebrow="Time" title="Chat" description="Conversas internas do time." />

      <div className="mb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {CHANNELS.map((c) => (
          <Chip key={c} active={channel === c} onClick={() => setChannel(c)}>
            # {c}
          </Chip>
        ))}
      </div>

      <Card variant="solid" padding="none" className="flex h-[calc(100dvh-260px)] min-h-[420px] flex-col lg:h-[calc(100dvh-220px)]">
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <PageSkeleton />
          ) : messages.length === 0 ? (
            <EmptyState icon={<Send className="h-5 w-5" />} title="Sem mensagens" description="Seja o primeiro a mandar uma mensagem." />
          ) : (
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.02 } } }}
              className="space-y-3"
            >
              {messages.map((m, i) => {
                const mine = m.sender_id === user?.id;
                const prev = messages[i - 1];
                const grouped = prev && prev.sender_id === m.sender_id;
                return (
                  <motion.li
                    key={m.id}
                    variants={{ hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } }}
                    className={cn('flex gap-2', mine ? 'flex-row-reverse' : 'flex-row')}
                  >
                    {!grouped ? (
                      <Avatar name={m.sender_name} size="sm" />
                    ) : (
                      <div className="h-8 w-8 shrink-0" />
                    )}
                    <div className={cn('max-w-[75%]', mine ? 'items-end' : 'items-start', 'flex flex-col')}>
                      {!grouped && (
                        <p className="mb-0.5 px-1 text-[11px] font-medium text-fg-muted">
                          {mine ? 'Você' : m.sender_name}
                        </p>
                      )}
                      <div className={cn(
                        'rounded-[14px] px-3.5 py-2 text-sm leading-relaxed',
                        mine
                          ? 'bg-[linear-gradient(135deg,#9d8cff,#5a46e0)] text-white rounded-tr-[4px]'
                          : 'bg-white/[0.05] border border-line text-fg rounded-tl-[4px]',
                      )}>
                        {m.content}
                      </div>
                      <p className={cn('mt-0.5 px-1 text-[10px] text-fg-faint', mine ? 'text-right' : 'text-left')}>
                        {format(parseISO(m.created_at), 'HH:mm')}
                      </p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </div>

        <form onSubmit={submit} className="border-t border-line bg-ink-900 p-3">
          <div className="flex items-center gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Mensagem em #${channel}`}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!value.trim()} aria-label="Enviar">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

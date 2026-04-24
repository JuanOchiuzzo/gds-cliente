'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hash, Users } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { Avatar } from '@/components/ui/avatar';
import { useChat } from '@/lib/hooks/use-chat';
import { useAuth } from '@/lib/auth-context';
import { timeAgo, cn } from '@/lib/utils';
import { tryConsume, RATE_LIMITS } from '@/lib/rate-limit';
import { spring, slideUp } from '@/lib/motion';

const CHANNELS = [
  { id: 'geral', name: 'Geral', icon: Hash },
  { id: 'vendas', name: 'Vendas', icon: Hash },
  { id: 'gerentes', name: 'Gerentes', icon: Users },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('geral');
  const [input, setInput] = useState('');
  const { messages, loading, loadingOlder, hasMore, loadOlder, send } = useChat(activeChannel);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (!tryConsume(`chat:${user?.id ?? 'anon'}:${activeChannel}`, RATE_LIMITS.sendMessage)) {
      return;
    }
    send(input);
    setInput('');
  };

  const current = CHANNELS.find((c) => c.id === activeChannel);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 h-[calc(100dvh-120px)] flex flex-col"
    >
      <motion.div variants={slideUp} initial="hidden" animate="visible">
        <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Chat</h1>
        <p className="mt-1 text-sm text-text-soft">Comunicação da equipe em tempo real</p>
      </motion.div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Channels sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <Surface variant="elevated" padding="sm" className="h-full">
            <p className="text-[10px] font-semibold text-text-faint uppercase tracking-widest px-3 pt-2 pb-2">
              Canais
            </p>
            <div className="space-y-0.5">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-sm text-sm transition-colors',
                    activeChannel === ch.id
                      ? 'bg-solar/10 text-solar'
                      : 'text-text-soft hover:bg-surface-2 hover:text-text'
                  )}
                >
                  <ch.icon className="w-4 h-4" /> {ch.name}
                </button>
              ))}
            </div>
          </Surface>
        </div>

        {/* Chat area */}
        <Surface variant="elevated" padding="none" className="flex-1 flex flex-col overflow-hidden">
          <div className="h-12 px-4 border-b border-border flex items-center gap-2 flex-shrink-0">
            {current && <current.icon className="w-4 h-4 text-solar" />}
            <span className="text-sm font-medium text-text">{current?.name}</span>
            <span className="text-xs text-text-faint ml-auto">{messages.length} mensagens</span>
          </div>

          {/* Mobile channels */}
          <div className="md:hidden flex gap-1.5 px-3 py-2 border-b border-border flex-shrink-0 overflow-x-auto no-scrollbar">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={cn(
                  'flex items-center gap-1.5 h-7 px-2.5 rounded-full border whitespace-nowrap text-[11px] transition-colors flex-shrink-0',
                  activeChannel === ch.id
                    ? 'bg-solar/10 border-solar/30 text-solar'
                    : 'bg-surface-1 border-border text-text-soft'
                )}
              >
                <ch.icon className="w-3 h-3" /> {ch.name}
              </button>
            ))}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-14 text-text-faint">
                <p className="text-sm">Nenhuma mensagem. Seja o primeiro!</p>
              </div>
            ) : (
              <>
                {hasMore && (
                  <div className="flex justify-center pb-2">
                    <button
                      onClick={loadOlder}
                      disabled={loadingOlder}
                      className="text-[11px] text-text-faint hover:text-text px-3 py-1 rounded-full border border-border hover:border-border-strong transition-colors"
                    >
                      {loadingOlder ? 'Carregando…' : 'Carregar mensagens antigas'}
                    </button>
                  </div>
                )}
                <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={spring}
                      className="flex items-start gap-3"
                    >
                      <Avatar name={msg.sender_name || 'User'} size="sm" ring={isMe ? 'solar' : 'none'} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              'text-sm font-medium',
                              isMe ? 'text-solar' : 'text-text'
                            )}
                          >
                            {isMe ? 'Você' : msg.sender_name}
                          </span>
                          <span className="text-[10px] text-text-faint font-mono">
                            {timeAgo(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-text-soft mt-0.5 break-words">{msg.content}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              </>
            )}
          </div>

          <div className="p-3 border-t border-border flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder={`Mensagem em #${current?.name}…`}
                className="flex-1 h-10 px-3 bg-surface-1 border border-border-strong rounded-md text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-solar focus:bg-surface-2 transition-colors"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 rounded-md bg-gradient-to-br from-solar to-solar-hot text-canvas disabled:opacity-40 flex items-center justify-center hover:shadow-glow transition-shadow"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </Surface>
      </div>
    </motion.div>
  );
}

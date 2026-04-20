'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Hash, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Avatar } from '@/components/ui/avatar';
import { useChat } from '@/lib/hooks/use-chat';
import { useAuth } from '@/lib/auth-context';
import { timeAgo } from '@/lib/utils';

const channels = [
  { id: 'geral', name: 'Geral', icon: Hash },
  { id: 'vendas', name: 'Vendas', icon: Hash },
  { id: 'gerentes', name: 'Gerentes', icon: Users },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('geral');
  const [input, setInput] = useState('');
  const { messages, loading, send } = useChat(activeChannel);
  const { user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--text)]">Chat da Equipe</h1>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Comunicação em tempo real</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)]">
        {/* Channels */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <GlassCard hover={false} className="h-full !p-3">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-2">Canais</p>
            <div className="space-y-1">
              {channels.map((ch) => (
                <button key={ch.id} onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                    activeChannel === ch.id ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--accent-soft)]'
                  }`}>
                  <ch.icon className="w-4 h-4" /> {ch.name}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat area */}
        <GlassCard hover={false} className="flex-1 flex flex-col !p-0 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-2">
            <Hash className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-semibold text-[var(--text)]">
              {channels.find((c) => c.id === activeChannel)?.name}
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-[var(--text-muted)]">
                <p className="text-sm">Nenhuma mensagem ainda. Seja o primeiro!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3">
                  <Avatar name={msg.sender_name || 'User'} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[var(--text)]">
                        {msg.sender_id === user?.id ? 'Você' : msg.sender_name}
                      </span>
                      <span className="text-[10px] text-[var(--text-faint)]">{timeAgo(msg.created_at)}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-[var(--border)]">
            <div className="flex items-center gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Mensagem em #${channels.find((c) => c.id === activeChannel)?.name}...`}
                className="flex-1 px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)]" />
              <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend} disabled={!input.trim()}
                className="p-2.5 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20 disabled:opacity-50 transition-colors">
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

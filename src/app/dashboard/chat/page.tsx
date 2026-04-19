'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Hash, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Avatar } from '@/components/ui/avatar';
import { chatMessages } from '@/lib/mock-data';
import { timeAgo } from '@/lib/utils';

const channels = [
  { id: 'geral', name: 'Geral', icon: Hash },
  { id: 'vendas', name: 'Vendas', icon: Hash },
  { id: 'gerentes', name: 'Gerentes', icon: Users },
];

export default function ChatPage() {
  const [activeChannel, setActiveChannel] = useState('geral');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(chatMessages);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg${Date.now()}`,
        sender_id: 'admin',
        sender_name: 'Você',
        sender_avatar: '',
        content: input,
        type: 'text',
        channel: activeChannel,
        created_at: new Date().toISOString(),
      },
    ]);
    setInput('');
  };

  const channelMessages = messages.filter((m) => m.channel === activeChannel);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--sf-text-primary)]">Chat da Equipe</h1>
        <p className="text-sm text-[var(--sf-text-tertiary)] mt-1">Comunicação em tempo real</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-220px)] lg:h-[calc(100vh-180px)]">
        {/* Channels sidebar */}
        <div className="hidden md:block w-56 flex-shrink-0">
          <GlassCard hover={false} className="h-full !p-3">
            <p className="text-xs font-semibold text-[var(--sf-text-tertiary)] uppercase tracking-wider px-2 mb-2">Canais</p>
            <div className="space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all ${
                    activeChannel === ch.id
                      ? 'bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-300'
                      : 'text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)]'
                  }`}
                >
                  <ch.icon className="w-4 h-4" />
                  {ch.name}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Chat area */}
        <GlassCard hover={false} className="flex-1 flex flex-col !p-0 overflow-hidden">
          {/* Channel header */}
          <div className="px-4 py-3 border-b border-[var(--sf-border)] flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
            <span className="text-sm font-semibold text-[var(--sf-text-primary)]">
              {channels.find((c) => c.id === activeChannel)?.name}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {channelMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                <Avatar name={msg.sender_name} size="sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[var(--sf-text-primary)]">{msg.sender_name}</span>
                    <span className="text-[10px] text-[var(--sf-text-muted)]">{timeAgo(msg.created_at)}</span>
                  </div>
                  <p className="text-sm text-[var(--sf-text-secondary)] mt-0.5">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[var(--sf-border)]">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Mensagem em #${channels.find((c) => c.id === activeChannel)?.name}...`}
                className="flex-1 px-4 py-2.5 bg-[var(--sf-accent-light)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:border-blue-500/30 dark:focus:border-blue-500/20 dark:border-cyan-500/30"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2.5 rounded-2xl bg-cyan-500/20 text-blue-600 dark:text-cyan-300 border border-blue-500/20 dark:border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
}

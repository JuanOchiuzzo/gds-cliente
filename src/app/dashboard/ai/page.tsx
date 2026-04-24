'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, BarChart3, Users, Target, ArrowUp } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { Chip } from '@/components/ui/chip';
import { useWallet } from '@/lib/hooks/use-wallet';
import { useLeads } from '@/lib/hooks/use-leads';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';

const SUGGESTED = [
  { icon: BarChart3, text: 'Resumo da minha carteira' },
  { icon: Target, text: 'Quais clientes quentes preciso contatar?' },
  { icon: Users, text: 'Tarefas pendentes para hoje' },
  { icon: Lightbulb, text: 'Próximos agendamentos' },
];

export default function AIPage() {
  const [messages, setMessages] = useState<
    { role: 'user' | 'ai'; content: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { clients, tasks } = useWallet();
  const { leads } = useLeads({ fetchAll: true });
  const { appointments } = useAppointments();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const generateResponse = (text: string): string => {
    const q = text.toLowerCase();
    const hotClients = clients.filter((c) => c.temperature === 'quente');
    const pendingTasks = tasks.filter((t) => !t.completed);
    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter((a) => a.date === today);

    if (q.includes('carteira') || q.includes('resumo')) {
      return `📊 Sua Carteira:\n\n• ${clients.length} clientes no total\n• 🔥 ${hotClients.length} quentes\n• 🌡️ ${clients.filter((c) => c.temperature === 'morno').length} mornos\n• ❄️ ${clients.filter((c) => c.temperature === 'frio').length} frios\n• ${pendingTasks.length} tarefas pendentes\n\n${
        hotClients.length > 0
          ? `Clientes quentes: ${hotClients.map((c) => c.name).join(', ')}`
          : 'Nenhum cliente quente no momento.'
      }`;
    }
    if (q.includes('quente') || q.includes('contatar')) {
      if (hotClients.length === 0)
        return '✅ Nenhum cliente quente. Adicione clientes à carteira!';
      return `🔥 Clientes Quentes (${hotClients.length}):\n\n${hotClients
        .map(
          (c, i) =>
            `${i + 1}. ${c.name}${c.interested_product ? ` — ${c.interested_product}` : ''}${
              c.notes ? `\n   📝 ${c.notes}` : ''
            }`
        )
        .join('\n\n')}`;
    }
    if (q.includes('tarefa') || q.includes('pendente')) {
      if (pendingTasks.length === 0) return '✅ Nenhuma tarefa pendente. Tudo em dia!';
      return `📋 Tarefas Pendentes (${pendingTasks.length}):\n\n${pendingTasks
        .map((t, i) => `${i + 1}. ${t.description}\n   👤 ${t.client_name || 'Cliente'}`)
        .join('\n\n')}`;
    }
    if (q.includes('agendamento') || q.includes('próximo')) {
      if (todayApts.length === 0) return '📅 Nenhum agendamento para hoje.';
      return `📅 Agendamentos de Hoje (${todayApts.length}):\n\n${todayApts
        .map((a, i) => `${i + 1}. ${a.client_name} — ${a.time}\n   ${a.product_name || ''}`)
        .join('\n\n')}`;
    }
    if (q.includes('lead')) {
      return `📊 Leads:\n\n• ${leads.length} leads no total\n• Novos: ${leads.filter((l) => l.stage === 'novo').length}\n• Qualificados: ${leads.filter((l) => l.stage === 'qualificado').length}\n• Fechados: ${leads.filter((l) => l.stage === 'fechado').length}`;
    }
    return `🤖 Posso ajudar com:\n\n• Resumo da sua carteira\n• Clientes quentes para contatar\n• Tarefas pendentes\n• Próximos agendamentos\n• Status dos leads`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const response = generateResponse(text);
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100dvh-120px)] relative"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/brand/gds-mobile-splash.webp')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,11,0.35),#08090b_70%)]" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-solar blur-lg opacity-60 animate-pulse-solar" />
          <div className="relative w-10 h-10 rounded-lg bg-solar-gradient flex items-center justify-center shadow-glow">
            <span className="text-[11px] font-bold text-white">AI</span>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-text">GDS AI</h1>
          <p className="text-[11px] text-text-faint">
            Assistente contextual baseado nos seus dados
          </p>
        </div>
      </div>

      <Surface variant="elevated" padding="none" className="flex-1 flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-6">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, 4, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-lg bg-solar/15 border border-solar/30 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-solar" />
              </motion.div>
              <div className="text-center px-4">
                <h2 className="text-2xl font-semibold text-text">Como posso ajudar?</h2>
                <p className="text-sm text-text-soft mt-2 max-w-md">
                  Consulto seus dados reais da carteira, leads e agendamentos.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg px-2">
                {SUGGESTED.map((p) => (
                  <Chip
                    key={p.text}
                    onClick={() => sendMessage(p.text)}
                    className="!h-auto py-3 !px-3.5 justify-start text-left"
                  >
                    <p.icon className="w-3.5 h-3.5 text-solar flex-shrink-0" />
                    <span className="text-[11px] leading-tight">{p.text}</span>
                  </Chip>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className={cn('max-w-[85%]', msg.role === 'user' ? 'ml-auto' : 'mr-auto')}
              >
                <div
                  className={cn(
                    'text-[13px] leading-relaxed whitespace-pre-wrap p-4 border rounded-lg',
                    msg.role === 'user'
                      ? 'bg-solar/10 border-solar/30 text-text rounded-tr-sm'
                      : 'bg-white/[0.055] border-white/[0.12] text-text-soft rounded-tl-sm'
                  )}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex items-center gap-2 p-3 mr-auto bg-white/[0.055] border border-white/[0.12] rounded-lg rounded-tl-sm max-w-[85%]">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                    className="w-1.5 h-1.5 rounded-full bg-solar"
                  />
                ))}
              </div>
              <span className="text-xs text-text-faint">Pensando…</span>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Pergunte sobre seus dados…"
              className="flex-1 h-11 px-4 bg-white/[0.055] border border-white/[0.12] rounded-lg text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-solar focus:bg-white/[0.08] transition-colors"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-lg bg-solar-gradient text-white disabled:opacity-40 flex items-center justify-center hover:shadow-glow transition-shadow"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}

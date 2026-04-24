'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, BarChart3, Lightbulb, Sparkles, Target, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@/components/ui/chip';
import { Surface } from '@/components/ui/surface';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useLeads } from '@/lib/hooks/use-leads';
import { useWallet } from '@/lib/hooks/use-wallet';
import { cn } from '@/lib/utils';
import { spring } from '@/lib/motion';

const SUGGESTED = [
  { icon: BarChart3, text: 'Resumo da minha carteira' },
  { icon: Target, text: 'Quais clientes quentes preciso contatar?' },
  { icon: Users, text: 'Tarefas pendentes para hoje' },
  { icon: Lightbulb, text: 'Próximos agendamentos' },
];

export default function AIPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
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
      return `Sua Carteira:\n\n• ${clients.length} clientes no total\n• ${hotClients.length} quentes\n• ${clients.filter((c) => c.temperature === 'morno').length} mornos\n• ${clients.filter((c) => c.temperature === 'frio').length} frios\n• ${pendingTasks.length} tarefas pendentes\n\n${
        hotClients.length > 0
          ? `Clientes quentes: ${hotClients.map((c) => c.name).join(', ')}`
          : 'Nenhum cliente quente no momento.'
      }`;
    }
    if (q.includes('quente') || q.includes('contatar')) {
      if (hotClients.length === 0) return 'Nenhum cliente quente. Adicione clientes à carteira.';
      return `Clientes quentes (${hotClients.length}):\n\n${hotClients
        .map(
          (c, i) =>
            `${i + 1}. ${c.name}${c.interested_product ? ` — ${c.interested_product}` : ''}${
              c.notes ? `\n   ${c.notes}` : ''
            }`
        )
        .join('\n\n')}`;
    }
    if (q.includes('tarefa') || q.includes('pendente')) {
      if (pendingTasks.length === 0) return 'Nenhuma tarefa pendente. Tudo em dia.';
      return `Tarefas pendentes (${pendingTasks.length}):\n\n${pendingTasks
        .map((t, i) => `${i + 1}. ${t.description}\n   Cliente: ${t.client_name || 'Cliente'}`)
        .join('\n\n')}`;
    }
    if (q.includes('agendamento') || q.includes('próximo')) {
      if (todayApts.length === 0) return 'Nenhum agendamento para hoje.';
      return `Agendamentos de hoje (${todayApts.length}):\n\n${todayApts
        .map((a, i) => `${i + 1}. ${a.client_name} — ${a.time}\n   ${a.product_name || ''}`)
        .join('\n\n')}`;
    }
    if (q.includes('lead')) {
      return `Leads:\n\n• ${leads.length} leads no total\n• Novos: ${leads.filter((l) => l.stage === 'novo').length}\n• Qualificados: ${leads.filter((l) => l.stage === 'qualificado').length}\n• Fechados: ${leads.filter((l) => l.stage === 'fechado').length}`;
    }
    return 'Posso ajudar com resumo da carteira, clientes quentes, tarefas pendentes, próximos agendamentos e status dos leads.';
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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring}
      className="relative flex h-[calc(100dvh-154px)] min-h-[640px] flex-col overflow-hidden rounded-lg border border-white/[0.12] bg-canvas shadow-xl lg:h-[calc(100dvh-128px)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[url('/brand/gds-command-bg.webp')] bg-cover bg-center opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,8,10,0.5),#06080a_58%)]" />

      <header className="relative z-10 flex items-center justify-between border-b border-white/[0.1] bg-black/20 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-solar-gradient text-[#06110f] shadow-glow">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-text">GDS AI</h1>
            <p className="text-[11px] text-text-faint">Assistente contextual da operação</p>
          </div>
        </div>
        <Badge variant="success" size="sm">online</Badge>
      </header>

      <div ref={scrollRef} className="relative z-10 flex-1 overflow-y-auto p-4 sm:p-5">
        {messages.length === 0 && (
          <div className="flex min-h-full flex-col justify-center gap-6">
            <Surface variant="glass" padding="lg" className="mx-auto w-full max-w-xl text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-white text-canvas">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-semibold text-text">Pergunte pelo próximo movimento.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-text-soft">
                Eu leio carteira, leads e agenda para devolver ações curtas e úteis.
              </p>
            </Surface>

            <div className="mx-auto grid w-full max-w-xl grid-cols-1 gap-2 sm:grid-cols-2">
              {SUGGESTED.map((p) => (
                <Chip
                  key={p.text}
                  onClick={() => sendMessage(p.text)}
                  className="!h-auto justify-start !rounded-lg px-3.5 py-3 text-left"
                >
                  <p.icon className="h-4 w-4 shrink-0 text-solar" />
                  <span className="text-[12px] leading-tight">{p.text}</span>
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
              className={cn('mb-3 max-w-[86%]', msg.role === 'user' ? 'ml-auto' : 'mr-auto')}
            >
              <div
                className={cn(
                  'whitespace-pre-wrap rounded-lg border p-4 text-[13px] leading-relaxed shadow-sm',
                  msg.role === 'user'
                    ? 'border-solar/30 bg-solar/15 text-text'
                    : 'border-white/[0.12] bg-white/[0.065] text-text-soft backdrop-blur-xl'
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="mr-auto flex max-w-[86%] items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.065] p-3 backdrop-blur-xl">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                  className="h-1.5 w-1.5 rounded-full bg-solar"
                />
              ))}
            </div>
            <span className="text-xs text-text-faint">Analisando dados...</span>
          </div>
        )}
      </div>

      <div className="relative z-10 border-t border-white/[0.1] bg-black/25 p-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder="Pergunte sobre seus dados..."
            className="h-12 flex-1 rounded-lg border border-white/[0.12] bg-white/[0.065] px-4 text-sm text-text placeholder:text-text-faint shadow-inset transition-colors focus:border-solar/50 focus:bg-white/[0.1] focus:outline-none"
          />
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-solar-gradient text-[#06110f] shadow-glow disabled:opacity-40"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

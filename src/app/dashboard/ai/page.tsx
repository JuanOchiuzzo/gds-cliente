'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, Lightbulb, BarChart3, Users, Target, ArrowUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useWallet } from '@/lib/hooks/use-wallet';
import { useLeads } from '@/lib/hooks/use-leads';
import { useAppointments } from '@/lib/hooks/use-appointments';

const suggestedPrompts = [
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
  const { leads } = useLeads();
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
      return `📊 Sua Carteira:\n\n• ${clients.length} clientes no total\n• 🔥 ${hotClients.length} quentes\n• 🌡️ ${clients.filter(c => c.temperature === 'morno').length} mornos\n• ❄️ ${clients.filter(c => c.temperature === 'frio').length} frios\n• ${pendingTasks.length} tarefas pendentes\n\n${hotClients.length > 0 ? `Clientes quentes: ${hotClients.map(c => c.name).join(', ')}` : 'Nenhum cliente quente no momento.'}`;
    }
    if (q.includes('quente') || q.includes('contatar')) {
      if (hotClients.length === 0) return '✅ Nenhum cliente quente no momento. Adicione clientes à sua carteira!';
      return `🔥 Clientes Quentes (${hotClients.length}):\n\n${hotClients.map((c, i) => `${i + 1}. ${c.name}${c.interested_product ? ` — ${c.interested_product}` : ''}${c.notes ? `\n   📝 ${c.notes}` : ''}`).join('\n\n')}`;
    }
    if (q.includes('tarefa') || q.includes('pendente')) {
      if (pendingTasks.length === 0) return '✅ Nenhuma tarefa pendente! Tudo em dia.';
      return `📋 Tarefas Pendentes (${pendingTasks.length}):\n\n${pendingTasks.map((t, i) => `${i + 1}. ${t.description}\n   👤 ${t.client_name || 'Cliente'}`).join('\n\n')}`;
    }
    if (q.includes('agendamento') || q.includes('próximo')) {
      if (todayApts.length === 0) return '📅 Nenhum agendamento para hoje.';
      return `📅 Agendamentos de Hoje (${todayApts.length}):\n\n${todayApts.map((a, i) => `${i + 1}. ${a.client_name} — ${a.time}\n   ${a.product_name || ''}`).join('\n\n')}`;
    }
    if (q.includes('lead')) {
      return `📊 Leads:\n\n• ${leads.length} leads no total\n• Novos: ${leads.filter(l => l.stage === 'novo').length}\n• Qualificados: ${leads.filter(l => l.stage === 'qualificado').length}\n• Fechados: ${leads.filter(l => l.stage === 'fechado').length}`;
    }
    return `🤖 Posso ajudar com:\n\n• Resumo da sua carteira\n• Clientes quentes para contatar\n• Tarefas pendentes\n• Próximos agendamentos\n• Status dos leads\n\nPergunte sobre qualquer um desses temas!`;
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[calc(100vh-160px)] lg:h-[calc(100vh-120px)]">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 blur-md opacity-50" />
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center border border-white/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[var(--text)] leading-tight">Nexus AI</h1>
          <p className="text-[10px] text-[var(--text-muted)]">Assistente baseado nos seus dados reais</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-5">
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/15 to-violet-500/15 border border-[var(--border)] flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-blue-600" />
              </motion.div>
              <div className="text-center px-4">
                <h2 className="text-base font-semibold text-[var(--text)]">Como posso ajudar?</h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">Consulto seus dados reais da carteira, leads e agendamentos</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md px-2">
                {suggestedPrompts.map((p) => (
                  <motion.button key={p.text} whileTap={{ scale: 0.97 }} onClick={() => sendMessage(p.text)}
                    className="flex items-start gap-2.5 p-3 text-left bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl active:bg-[var(--bg-hover)]">
                    <p.icon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-[var(--text-secondary)]">{p.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
              <div className={`text-[13px] leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'p-3.5 bg-blue-50 border border-blue-200 rounded-2xl rounded-tr-md text-blue-800'
                  : 'p-3.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-tl-md text-[var(--text-secondary)]'
              }`}>{msg.content}</div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 p-3.5 mr-auto bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-tl-md max-w-[85%]">
              <div className="flex gap-1">{[0, 1, 2].map((i) => (<motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} className="w-1.5 h-1.5 rounded-full bg-blue-500" />))}</div>
              <span className="text-[11px] text-[var(--text-muted)]">Analisando...</span>
            </div>
          )}
        </div>
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Pergunte sobre seus dados..."
              className="flex-1 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)]" />
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white disabled:opacity-40">
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

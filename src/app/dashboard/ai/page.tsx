'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Lightbulb, BarChart3, Users, Target, ArrowUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const suggestedPrompts = [
  { icon: BarChart3, text: 'Quais stands estão com pior performance?' },
  { icon: Target, text: 'Sugira ações para aumentar conversão' },
  { icon: Users, text: 'Leads que precisam de follow-up urgente' },
  { icon: Lightbulb, text: 'Gere um relatório executivo' },
];

const mockResponses: Record<string, string> = {
  'Quais stands estão com pior performance?':
    '📊 Análise de Performance:\n\n1. Stand Barra da Tijuca (73% da meta)\n   → 2 corretores de férias, fluxo caiu 15%\n   → Ação: Realocar Diego do Alphaville\n\n2. Stand Morumbi Town (80% da meta)\n   → 8 leads em proposta sem follow-up\n   → Ação: Blitz de ligações amanhã\n\n3. Stand Leblon (83% da meta)\n   → Falta 1 venda, Carlos Santos em negociação\n   → Ação: Condição especial até sexta',
  'Sugira ações para aumentar conversão':
    '🚀 5 Ações Prioritárias:\n\n1. WhatsApp Blast — 45 leads inativos com oferta\n2. Open House sábado no Barra com coffee break\n3. Reforço: 2 corretores do Eldorado → Barra\n4. Tour Virtual 360° para leads remotos\n5. Parceria influencer local no Instagram\n\n📈 Impacto estimado: +35% conversão em 2 semanas',
  'Leads que precisam de follow-up urgente':
    '⚠️ 12 Leads em Risco:\n\n• 5 em "Proposta" sem contato há 4+ dias\n• 4 em "Negociação" aguardando resposta\n• 3 em "Visita Agendada" sem confirmação\n\n💰 Valor total em risco: R$ 4.2M\n\nPrioridade máxima:\n1. Roberto Almeida — R$ 1.2M — Alphaville\n2. Fernanda Costa — R$ 890K — Eldorado\n3. Carlos Santos — R$ 750K — Savassi',
  'Gere um relatório executivo':
    '📋 Relatório Executivo — Abril 2026\n\n✅ Vendas: 47 un (meta: 42) — 112%\n✅ Receita: R$ 23.5M (+15.2%)\n✅ Conversão: 16.5% (+2.1pp)\n\n🏆 Destaques:\n• Expo Imóveis SP: 28 vendas (recorde)\n• Alphaville: 120% da meta\n• Instagram: +42% conversão vs média\n\n⚠️ Atenção:\n• Barra da Tijuca: 73% da meta\n• 12 leads em risco (R$ 4.2M)\n\n📊 Previsão maio: R$ 26M (+10.6%)',
  default:
    '🤖 Analisando dados do StandForge...\n\n• 47 vendas em abril (meta: 42) ✅\n• Taxa de conversão: 16.5%\n• Stand destaque: Expo Imóveis SP (112%)\n• 12 leads em risco de perda\n\nPosso detalhar qualquer aspecto!',
};

export default function AIPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const response = mockResponses[text] || mockResponses.default;
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-[calc(100vh-160px)] lg:h-[calc(100vh-120px)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 blur-md opacity-50" />
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center border border-[var(--sf-border-hover)]">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-lg font-bold text-[var(--sf-text-primary)] leading-tight">Nexus AI</h1>
          <p className="text-[10px] text-[var(--sf-text-tertiary)]">Copiloto inteligente de vendas</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-medium">Online</span>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-3xl flex flex-col overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full space-y-5">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-3xl bg-gradient-to-br from-cyan-500/15 to-violet-500/15 border border-[var(--sf-border)] flex items-center justify-center"
              >
                <Sparkles className="w-7 h-7 text-blue-600 dark:text-cyan-400" />
              </motion.div>
              <div className="text-center px-4">
                <h2 className="text-base font-semibold text-[var(--sf-text-primary)]">Como posso ajudar?</h2>
                <p className="text-xs text-[var(--sf-text-tertiary)] mt-1">Pergunte sobre performance, leads ou peça relatórios</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md px-2">
                {suggestedPrompts.map((prompt) => (
                  <motion.button
                    key={prompt.text}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => sendMessage(prompt.text)}
                    className="flex items-start gap-2.5 p-3 text-left bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] transition-colors"
                  >
                    <prompt.icon className="w-4 h-4 text-blue-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-[var(--sf-text-secondary)] leading-relaxed">{prompt.text}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              <div
                className={`text-[13px] leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'p-3.5 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 rounded-2xl rounded-tr-md text-cyan-200'
                    : 'p-3.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl rounded-tl-md text-[var(--sf-text-secondary)]'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 p-3.5 mr-auto bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl rounded-tl-md max-w-[85%]"
            >
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                  />
                ))}
              </div>
              <span className="text-[11px] text-[var(--sf-text-tertiary)]">Analisando...</span>
            </motion.div>
          )}
        </div>

        {/* Input — large touch target */}
        <div className="p-3 border-t border-[var(--sf-border)]">
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Pergunte ao Nexus..."
              className="flex-1 px-4 py-3 bg-[var(--sf-surface)] border border-white/[0.08] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:border-blue-500/30 dark:focus:border-blue-500/20 dark:border-cyan-500/30 transition-colors"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white disabled:opacity-40 shadow-[0_0_16px_rgb(103,232,249,0.2)]"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

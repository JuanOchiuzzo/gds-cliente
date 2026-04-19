'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const suggestedPrompts = [
  'Quais stands estão abaixo da meta?',
  'Sugira ações para aumentar conversão',
  'Gere um relatório executivo',
  'Quais leads precisam de follow-up urgente?',
];

const mockResponses: Record<string, string> = {
  'Quais stands estão abaixo da meta?':
    '📊 **3 stands estão abaixo da meta este mês:**\n\n1. **Barra da Tijuca** — 73% da meta (11/15). Recomendo reforçar equipe.\n2. **Morumbi Town** — 80% da meta (8/10). Leads qualificados estão parados.\n3. **Leblon** — 83% da meta (5/6). Falta 1 venda, lead Carlos Santos está em negociação.\n\n💡 Ação sugerida: Priorize follow-up nos 12 leads em fase de proposta.',
  'Sugira ações para aumentar conversão':
    '🚀 **5 ações para aumentar conversão:**\n\n1. Ativar campanha de WhatsApp para leads inativos há 5+ dias\n2. Oferecer condições especiais para fechamento até sexta\n3. Realocar 2 corretores do Eldorado (acima da meta) para Barra\n4. Agendar visitas presenciais para leads em fase de proposta\n5. Usar tour virtual 360° — conversão é 42% maior neste canal',
  default:
    '🤖 Analisando os dados do StandForge...\n\nBaseado nos dados atuais, posso ver que a operação está saudável com 47 vendas no mês e taxa de conversão de 16.5%. O Stand Expo Imóveis SP é o destaque com 112% da meta atingida.\n\nPosso ajudar com análises mais específicas. Pergunte sobre stands, leads, agentes ou previsões!',
};

export function AIFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    await new Promise((r) => setTimeout(r, 1200));
    const response = mockResponses[text] || mockResponses.default;
    setMessages((prev) => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <>
      {/* FAB Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(true)}
            className={cn(
              'fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50',
              'w-14 h-14 rounded-2xl',
              'bg-gradient-to-br from-cyan-500 to-violet-500',
              'flex items-center justify-center',
              'shadow-[0_0_30px_rgb(103,232,249,0.4)]',
              'animate-glow-pulse'
            )}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50',
              'w-[calc(100vw-2rem)] max-w-md',
              'bg-[var(--sf-bg-secondary)] backdrop-blur-3xl border border-[var(--sf-border)] rounded-3xl shadow-2xl',
              'flex flex-col overflow-hidden',
              'max-h-[70vh]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--sf-border)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--sf-text-primary)]">Nexus AI</h3>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)]">Copiloto inteligente</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-xl text-[var(--sf-text-tertiary)] hover:text-[var(--sf-text-secondary)] hover:bg-[var(--sf-accent-light)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px]">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-[var(--sf-text-tertiary)] text-center">
                    Olá! Sou o Nexus, seu copiloto de vendas. Como posso ajudar?
                  </p>
                  <div className="space-y-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => sendMessage(prompt)}
                        className="w-full text-left px-3 py-2 text-xs text-[var(--sf-text-secondary)] bg-[var(--sf-accent-light)] border border-[var(--sf-border)] rounded-xl hover:bg-[var(--sf-accent-light)] hover:border-[var(--sf-border)] transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'text-sm whitespace-pre-wrap',
                    msg.role === 'user'
                      ? 'ml-8 p-3 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 rounded-2xl rounded-tr-md text-cyan-200'
                      : 'mr-4 p-3 bg-[var(--sf-accent-light)] border border-[var(--sf-border)] rounded-2xl rounded-tl-md text-[var(--sf-text-secondary)]'
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 p-3 mr-4 bg-[var(--sf-accent-light)] border border-[var(--sf-border)] rounded-2xl rounded-tl-md">
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
                  <span className="text-xs text-[var(--sf-text-tertiary)]">Nexus está pensando...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[var(--sf-border)]">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Pergunte ao Nexus..."
                  className="flex-1 px-4 py-2.5 bg-[var(--sf-accent-light)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:border-blue-500/30 dark:focus:border-blue-500/20 dark:border-cyan-500/30"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="p-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

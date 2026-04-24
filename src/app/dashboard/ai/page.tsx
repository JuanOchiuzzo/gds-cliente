'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUpRight,
  Flame,
  Lightbulb,
  Send,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useLeads } from '@/lib/hooks/use-leads';
import { useAppointments } from '@/lib/hooks/use-appointments';
import { useWallet } from '@/lib/hooks/use-wallet';

type Insight = {
  id: string;
  title: string;
  description: string;
  tone: 'success' | 'warn' | 'info' | 'action';
  href?: string;
  cta?: string;
  icon: React.ReactNode;
};

const TONE: Record<Insight['tone'], { variant: BadgeVariant; ring: string; label: string }> = {
  success: { variant: 'ok', ring: 'bg-ok/15 text-ok', label: 'Resultado' },
  warn: { variant: 'warn', ring: 'bg-warn/15 text-warn', label: 'Atenção' },
  info: { variant: 'info', ring: 'bg-info/15 text-info', label: 'Insight' },
  action: { variant: 'iris', ring: 'bg-iris/15 text-iris-hi', label: 'Ação' },
};

const SUGGESTIONS = [
  'Quais leads estão parados?',
  'Resuma meu pipeline',
  'Sugira próximos passos',
  'Onde estou perdendo clientes?',
];

export default function AIPage() {
  const { leads, loading: l1 } = useLeads({ fetchAll: true });
  const { appointments, loading: l2 } = useAppointments();
  const { clients, tasks, loading: l3 } = useWallet();
  const [prompt, setPrompt] = useState('');

  const insights = useMemo<Insight[]>(() => {
    const hot = clients.filter((c) => c.temperature === 'quente').length;
    const stale = leads.filter((l) => {
      const updated = new Date(l.updated_at).getTime();
      return Date.now() - updated > 7 * 86400_000 && !['fechado', 'perdido'].includes(l.stage);
    }).length;
    const today = new Date().toISOString().split('T')[0];
    const todayApts = appointments.filter((a) => a.date === today && a.status === 'pendente').length;
    const closed = leads.filter((l) => l.stage === 'fechado').length;
    const overdue = tasks.filter((t) => !t.completed && new Date(t.due_date) < new Date()).length;

    const out: Insight[] = [];
    if (stale > 0) {
      out.push({
        id: 'stale',
        title: `${stale} leads esfriando`,
        description: `Leads sem atualização há mais de 7 dias. Envie um follow-up para reaquecer.`,
        tone: 'warn',
        href: '/dashboard/leads',
        cta: 'Abrir leads',
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }
    if (hot > 0) {
      out.push({
        id: 'hot',
        title: `${hot} cliente(s) quente(s) na carteira`,
        description: 'Priorize esses contatos — eles têm maior probabilidade de fechar.',
        tone: 'action',
        href: '/dashboard/wallet',
        cta: 'Ver carteira',
        icon: <Flame className="h-4 w-4" />,
      });
    }
    if (todayApts > 0) {
      out.push({
        id: 'today',
        title: `${todayApts} visita(s) pendente(s) hoje`,
        description: 'Confirme com os clientes via WhatsApp para reduzir no-show.',
        tone: 'info',
        href: '/dashboard/appointments',
        cta: 'Confirmar',
        icon: <Zap className="h-4 w-4" />,
      });
    }
    if (overdue > 0) {
      out.push({
        id: 'overdue',
        title: `${overdue} tarefa(s) atrasada(s)`,
        description: 'Limpe o backlog e mantenha o funil saudável.',
        tone: 'warn',
        href: '/dashboard/wallet',
        cta: 'Resolver',
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }
    if (closed > 0) {
      out.push({
        id: 'closed',
        title: `${closed} negócio(s) fechado(s)`,
        description: 'Peça indicações aos clientes satisfeitos — o melhor canal de aquisição.',
        tone: 'success',
        href: '/dashboard/leads',
        cta: 'Ver fechados',
        icon: <TrendingUp className="h-4 w-4" />,
      });
    }
    if (out.length === 0) {
      out.push({
        id: 'start',
        title: 'Começar agora',
        description: 'Adicione leads e clientes para a IA gerar insights personalizados.',
        tone: 'info',
        href: '/dashboard/leads',
        cta: 'Adicionar lead',
        icon: <Lightbulb className="h-4 w-4" />,
      });
    }
    return out;
  }, [leads, appointments, clients, tasks]);

  const loading = l1 || l2 || l3;

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader
        eyebrow="Forge AI"
        title="Inteligência"
        description="Insights e ações recomendadas pela IA."
        actions={<Sparkles className="h-5 w-5 text-iris-hi" />}
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-5"
      >
        <Card variant="glass" padding="lg" className="relative isolate overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-20 -right-10 h-[220px] w-[220px] rounded-full bg-iris/30 blur-3xl" />
          </div>
          <label className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
            Pergunte à Forge AI
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPrompt('');
            }}
            className="mt-2 flex items-center gap-2"
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: quais leads devo contatar hoje?"
              className="flex-1"
            />
            <Button size="icon" type="submit" aria-label="Enviar"><Send className="h-4 w-4" /></Button>
          </form>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="rounded-full border border-line bg-white/[0.04] px-2.5 py-1 text-[11px] text-fg-soft press hover:border-line-strong hover:text-fg"
              >
                {s}
              </button>
            ))}
          </div>
        </Card>
      </motion.section>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-fg">Insights</h2>
        <Badge variant="iris" size="sm">{insights.length}</Badge>
      </div>

      <motion.ul
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
        className="space-y-2"
      >
        {insights.map((i) => {
          const t = TONE[i.tone];
          return (
            <motion.li
              key={i.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            >
              <Card variant="solid" padding="md">
                <div className="flex items-start gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] ${t.ring}`}>
                    {i.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={t.variant} size="xs">{t.label}</Badge>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-fg">{i.title}</p>
                    <p className="mt-0.5 text-xs text-fg-muted">{i.description}</p>
                    {i.href && i.cta && (
                      <Link href={i.href} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-iris-hi">
                        {i.cta} <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

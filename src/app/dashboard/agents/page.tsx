'use client';

import { motion } from 'framer-motion';
import { Trophy, Crown, Phone, MessageCircle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { agents } from '@/lib/mock-data';
import { formatCurrency, formatPercent, generateWhatsAppLink } from '@/lib/utils';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } } };

const sorted = [...agents].sort((a, b) => b.monthly_sales - a.monthly_sales);

export default function AgentsPage() {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4 lg:space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Agentes</h1>
        <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">{agents.length} agentes ativos</p>
      </motion.div>

      {/* ── MOBILE: Top 3 Podium ── */}
      <motion.div variants={fadeUp} className="lg:hidden">
        <div className="flex items-center gap-2 mb-3 px-0.5">
          <Trophy className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Leaderboard — Abril 2026</h3>
        </div>

        {/* Podium layout — 2nd, 1st, 3rd */}
        <div className="flex items-end justify-center gap-2 mb-4">
          {/* 2nd place */}
          <div className="flex-1 max-w-[110px]">
            <div className="p-3 bg-[var(--sf-surface)] border border-zinc-500/20 rounded-2xl text-center">
              <span className="text-lg">🥈</span>
              <Avatar name={sorted[1].name} size="md" className="mx-auto mt-1" status={sorted[1].status} />
              <p className="text-[11px] font-semibold text-[var(--sf-text-primary)] mt-1.5 truncate">{sorted[1].name.split(' ')[0]}</p>
              <p className="text-lg font-bold text-[var(--sf-text-primary)] mt-0.5">{sorted[1].monthly_sales}</p>
              <p className="text-[9px] text-[var(--sf-text-tertiary)]">vendas</p>
            </div>
          </div>

          {/* 1st place — taller */}
          <div className="flex-1 max-w-[120px]">
            <div className="p-3 bg-[var(--sf-surface)] border border-amber-500/30 rounded-2xl text-center shadow-[0_0_20px_rgb(245,158,11,0.1)] relative">
              <Crown className="absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 text-amber-400" />
              <span className="text-xl mt-1 block">🥇</span>
              <Avatar name={sorted[0].name} size="lg" className="mx-auto mt-1" status={sorted[0].status} />
              <p className="text-xs font-semibold text-[var(--sf-text-primary)] mt-1.5 truncate">{sorted[0].name.split(' ')[0]}</p>
              <p className="text-2xl font-bold text-[var(--sf-text-primary)] mt-0.5">{sorted[0].monthly_sales}</p>
              <p className="text-[9px] text-[var(--sf-text-tertiary)]">vendas</p>
              <ProgressBar value={sorted[0].monthly_sales} max={sorted[0].monthly_target} className="mt-2" />
            </div>
          </div>

          {/* 3rd place */}
          <div className="flex-1 max-w-[110px]">
            <div className="p-3 bg-[var(--sf-surface)] border border-orange-700/20 rounded-2xl text-center">
              <span className="text-lg">🥉</span>
              <Avatar name={sorted[2].name} size="md" className="mx-auto mt-1" status={sorted[2].status} />
              <p className="text-[11px] font-semibold text-[var(--sf-text-primary)] mt-1.5 truncate">{sorted[2].name.split(' ')[0]}</p>
              <p className="text-lg font-bold text-[var(--sf-text-primary)] mt-0.5">{sorted[2].monthly_sales}</p>
              <p className="text-[9px] text-[var(--sf-text-tertiary)]">vendas</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── DESKTOP: Top 3 cards ── */}
      <motion.div variants={fadeUp} className="hidden lg:block">
        <GlassCard hover={false} glow="violet">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)]">Leaderboard — Abril 2026</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {sorted.slice(0, 3).map((agent, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              const glows = [
                'border-amber-500/30 shadow-[0_0_20px_rgb(245,158,11,0.15)]',
                'border-zinc-400/30',
                'border-orange-700/30',
              ];
              return (
                <div key={agent.id} className={`relative p-4 bg-[var(--sf-surface)] border rounded-2xl text-center ${glows[i]}`}>
                  <span className="text-2xl">{medals[i]}</span>
                  {i === 0 && <Crown className="absolute top-2 right-2 w-4 h-4 text-amber-400" />}
                  <Avatar name={agent.name} size="lg" className="mx-auto mt-2" status={agent.status} />
                  <p className="text-sm font-semibold text-[var(--sf-text-primary)] mt-2">{agent.name}</p>
                  <p className="text-xs text-[var(--sf-text-tertiary)]">{agent.stand_name.replace('Stand ', '')}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xl font-bold text-[var(--sf-text-primary)]">{agent.monthly_sales}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">vendas este mês</p>
                  </div>
                  <ProgressBar value={agent.monthly_sales} max={agent.monthly_target} className="mt-3" />
                </div>
              );
            })}
          </div>
        </GlassCard>
      </motion.div>

      {/* ── Full Agent List — mobile optimized ── */}
      <motion.div variants={stagger} className="space-y-2">
        {sorted.map((agent, i) => (
          <motion.div key={agent.id} variants={fadeUp}>
            <div className="p-3.5 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-2xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--sf-text-muted)] w-5 text-center">{i + 1}</span>
                <Avatar name={agent.name} size="md" status={agent.status} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{agent.name}</h3>
                    <Badge variant={agent.role === 'gerente' ? 'violet' : 'cyan'} className="!text-[9px]">
                      {agent.role === 'gerente' ? 'Gerente' : 'Corretor'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">{agent.stand_name.replace('Stand ', '')}</p>
                  {/* Mobile stats row */}
                  <div className="flex items-center gap-3 mt-1.5 lg:hidden">
                    <span className="text-[10px] text-[var(--sf-text-secondary)]">
                      <span className="font-semibold text-[var(--sf-text-secondary)]">{agent.monthly_sales}</span>/{agent.monthly_target} vendas
                    </span>
                    <span className="text-[10px] text-[var(--sf-text-secondary)]">
                      <span className="font-semibold text-[var(--sf-text-secondary)]">{formatPercent(agent.conversion_rate)}</span> conv.
                    </span>
                  </div>
                </div>
                {/* Desktop stats */}
                <div className="hidden lg:grid grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-sm font-bold text-[var(--sf-text-primary)]">{agent.monthly_sales}/{agent.monthly_target}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">Vendas/Meta</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--sf-text-primary)]">{agent.total_leads}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">Leads</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--sf-text-primary)]">{formatPercent(agent.conversion_rate)}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">Conversão</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--sf-text-primary)]">{formatCurrency(agent.revenue)}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)]">Receita</p>
                  </div>
                </div>
                {/* Mobile quick actions */}
                <div className="flex flex-col gap-1 lg:hidden">
                  <a href={generateWhatsAppLink(agent.phone, 'Oi!')} target="_blank" rel="noopener" className="p-1.5 rounded-lg text-green-400 active:bg-green-500/10">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a href={`tel:${agent.phone}`} className="p-1.5 rounded-lg text-blue-600 dark:text-cyan-400 active:bg-blue-500/10 dark:bg-cyan-500/10">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

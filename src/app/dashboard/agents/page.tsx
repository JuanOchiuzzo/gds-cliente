'use client';

import { motion } from 'framer-motion';
import { Trophy, Crown, Phone, MessageCircle, Users } from 'lucide-react';
import { Surface } from '@/components/ui/surface';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { EmptyState } from '@/components/ui/empty-state';
import { NumberFlow } from '@/components/ui/number-flow';
import { useAgents } from '@/lib/hooks/use-agents';
import { formatCurrency, formatPercent, generateWhatsAppLink, getDisplayName } from '@/lib/utils';
import { staggerParent, slideUp } from '@/lib/motion';
import { cn } from '@/lib/utils';

export default function AgentsPage() {
  const { agents, loading } = useAgents();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Equipe</h1>
        <Surface variant="elevated" padding="xl">
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="Nenhum agente cadastrado"
            description="Agentes aparecem automaticamente ao se inscreverem."
          />
        </Surface>
      </div>
    );
  }

  const sorted = [...agents].sort((a, b) => (b.monthly_sales || 0) - (a.monthly_sales || 0));
  const top3 = sorted.slice(0, 3);
  const medals = ['🥇', '🥈', '🥉'];
  const podiumBorders = ['border-solar/40 shadow-glow', 'border-aurora-1/30', 'border-aurora-2/30'];

  return (
    <motion.div
      variants={staggerParent(0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={slideUp}>
        <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Ranking</h1>
        <p className="mt-1 text-sm text-text-soft">
          {agents.length} agente{agents.length !== 1 ? 's' : ''} · ordenado por vendas do mês
        </p>
      </motion.div>

      {top3.length >= 3 && (
        <motion.div variants={slideUp}>
          <Surface variant="elevated" padding="lg">
            <div className="flex items-center gap-2 mb-5">
              <Trophy className="w-4 h-4 text-solar" />
              <h3 className="text-sm font-medium text-text">Leaderboard</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {top3.map((agent, i) => (
                <div
                  key={agent.id}
                  className={cn(
                    'relative p-4 bg-surface-1 border rounded-md text-center transition-transform hover:scale-[1.02]',
                    podiumBorders[i]
                  )}
                >
                  {i === 0 && (
                    <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 text-solar" />
                  )}
                  <span className="text-2xl">{medals[i]}</span>
                  <Avatar
                    name={getDisplayName(agent.name, 'Agente')}
                    src={agent.avatar_url}
                    size="lg"
                    ring={i === 0 ? 'solar' : 'subtle'}
                    className="mx-auto mt-2"
                  />
                  <p className="text-sm font-medium text-text mt-2 truncate">
                    {getDisplayName(agent.name, 'Agente').split(' ').slice(0, 2).join(' ')}
                  </p>
                  <p className="text-[11px] text-text-faint">
                    {(agent.stand_name || '').replace('Stand ', '')}
                  </p>
                  <div className="mt-3">
                    <p className="text-2xl font-medium text-solar-gradient">
                      <NumberFlow value={agent.monthly_sales} />
                    </p>
                    <p className="text-[10px] text-text-faint uppercase tracking-wider">vendas</p>
                  </div>
                  {agent.monthly_target > 0 && (
                    <ProgressBar
                      value={agent.monthly_sales}
                      max={agent.monthly_target}
                      className="mt-3"
                    />
                  )}
                </div>
              ))}
            </div>
          </Surface>
        </motion.div>
      )}

      <motion.div variants={staggerParent(0.03)} className="space-y-2">
        {sorted.map((agent, i) => (
          <motion.div key={agent.id} variants={slideUp}>
            <Surface variant="flat" padding="md" interactive>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-text-faint w-6 text-center">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Avatar
                  name={getDisplayName(agent.name, 'Agente')}
                  src={agent.avatar_url}
                  size="md"
                  status={agent.status === 'online' ? 'online' : agent.status === 'em_atendimento' ? 'busy' : 'offline'}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text truncate">
                      {getDisplayName(agent.name, 'Agente')}
                    </h3>
                    <Badge
                      variant={agent.role === 'gerente' ? 'aurora' : 'info'}
                      size="xs"
                    >
                      {agent.role === 'gerente' ? 'Gerente' : 'Corretor'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-text-faint truncate">
                    {(agent.stand_name || '').replace('Stand ', '')}
                  </p>
                </div>

                <div className="hidden lg:grid grid-cols-4 gap-6 text-center">
                  <div>
                    <p className="text-sm font-mono text-text">
                      {agent.monthly_sales}/{agent.monthly_target}
                    </p>
                    <p className="text-[10px] text-text-faint">Vendas</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-text">
                      <NumberFlow value={agent.total_leads} />
                    </p>
                    <p className="text-[10px] text-text-faint">Leads</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-solar">
                      {formatPercent(agent.conversion_rate)}
                    </p>
                    <p className="text-[10px] text-text-faint">Conv.</p>
                  </div>
                  <div>
                    <p className="text-sm font-mono text-text">{formatCurrency(agent.revenue)}</p>
                    <p className="text-[10px] text-text-faint">Receita</p>
                  </div>
                </div>

                {agent.phone && (
                  <div className="flex gap-1">
                    <a
                      href={generateWhatsAppLink(agent.phone, 'Oi!')}
                      target="_blank"
                      rel="noopener"
                      className="w-8 h-8 rounded-md flex items-center justify-center text-success hover:bg-success/10"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${agent.phone}`}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-info hover:bg-info/10"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            </Surface>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

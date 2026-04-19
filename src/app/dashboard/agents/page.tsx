'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAgents } from '@/lib/hooks/use-agents';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AgentsPage() {
  const { agents, loading } = useAgents();

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp}>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Equipe</h1>
        <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">{agents.length} membro{agents.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {agents.length === 0 ? (
        <GlassCard hover={false} className="!p-8 text-center">
          <Users className="w-10 h-10 mx-auto text-[var(--sf-text-muted)] mb-3" />
          <p className="text-sm text-[var(--sf-text-tertiary)]">Nenhum agente cadastrado</p>
        </GlassCard>
      ) : (
        <motion.div variants={stagger} className="space-y-2">
          {agents.map((agent, i) => (
            <motion.div key={agent.id} variants={fadeUp}>
              <div className="p-3.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--sf-text-muted)] w-5 text-center">{i + 1}</span>
                  <Avatar name={agent.full_name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{agent.full_name}</h3>
                      <Badge variant={agent.role === 'gerente' ? 'violet' : 'cyan'} className="!text-[9px]">
                        {agent.role === 'gerente' ? 'Gerente' : 'Corretor'}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">{agent.email}</p>
                  </div>
                  {agent.phone && (
                    <a href={`tel:${agent.phone}`} className="p-2 rounded-xl text-blue-600 dark:text-cyan-400 active:bg-blue-500/10">
                      <Users className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

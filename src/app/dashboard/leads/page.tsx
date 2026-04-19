'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Phone, MessageCircle, Mail, SlidersHorizontal, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { leads, stands } from '@/lib/mock-data';
import { formatCurrency, getLeadStageLabel, getLeadSourceLabel, generateWhatsAppLink, timeAgo } from '@/lib/utils';
import type { Lead } from '@/types';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const stageVariant: Record<string, 'cyan' | 'violet' | 'emerald' | 'amber' | 'red' | 'zinc'> = {
  novo: 'cyan', qualificado: 'violet', visita_agendada: 'amber',
  proposta: 'violet', negociacao: 'amber', fechado: 'emerald', perdido: 'red',
};

const stageFilters = ['all', 'novo', 'qualificado', 'visita_agendada', 'proposta', 'negociacao', 'fechado', 'perdido'];

export default function LeadsPage() {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.phone.includes(search) || l.email.toLowerCase().includes(search.toLowerCase());
      const matchStage = stageFilter === 'all' || l.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [search, stageFilter]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    leads.forEach((l) => { counts[l.stage] = (counts[l.stage] || 0) + 1; });
    return counts;
  }, []);

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Leads</h1>
          <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">{filtered.length} de {leads.length} leads</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNewLead(true)}>
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Novo Lead</span>
        </Button>
      </motion.div>

      {/* Search + Filter bar */}
      <motion.div variants={fadeUp} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nome, telefone..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20 transition-all"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-2xl border transition-all ${
            stageFilter !== 'all'
              ? 'bg-blue-500/10 dark:bg-cyan-500/15 border-blue-500/20 dark:border-cyan-500/30 text-blue-600 dark:text-cyan-300'
              : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* Filter chips — expandable on mobile */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {stageFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setStageFilter(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border whitespace-nowrap transition-all ${
                    stageFilter === s
                      ? 'bg-blue-500/10 dark:bg-cyan-500/15 text-blue-600 dark:text-cyan-300 border-blue-500/20 dark:border-cyan-500/30'
                      : 'bg-[var(--sf-accent-light)] text-[var(--sf-text-tertiary)] border-[var(--sf-border)] active:bg-white/10'
                  }`}
                >
                  {s === 'all' ? 'Todos' : getLeadStageLabel(s)}
                  <span className="text-[10px] opacity-60">{stageCounts[s] || 0}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead List — touch-optimized cards */}
      <motion.div variants={stagger} className="space-y-2">
        {filtered.map((lead) => (
          <motion.div key={lead.id} variants={fadeUp}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedLead(lead)}
              className="p-3.5 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] active:border-[var(--sf-border-hover)] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar name={lead.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{lead.name}</h3>
                    {/* AI Score pill */}
                    <div className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      lead.ai_score >= 70 ? 'bg-emerald-500/15 text-emerald-400' :
                      lead.ai_score >= 40 ? 'bg-amber-500/15 text-amber-400' :
                      'bg-red-500/15 text-red-400'
                    }`}>
                      {lead.ai_score}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={stageVariant[lead.stage]} className="!text-[9px]">{getLeadStageLabel(lead.stage)}</Badge>
                    <span className="text-[10px] text-[var(--sf-text-muted)]">·</span>
                    <span className="text-[10px] text-[var(--sf-text-tertiary)]">{formatCurrency(lead.estimated_value)}</span>
                  </div>
                  <p className="text-[10px] text-[var(--sf-text-muted)] mt-0.5">
                    {lead.stand_name.replace('Stand ', '')} · {getLeadSourceLabel(lead.source)} · {timeAgo(lead.updated_at)}
                  </p>
                </div>
                {/* Quick actions */}
                <div className="flex flex-col gap-1">
                  <a
                    href={generateWhatsAppLink(lead.phone, `Olá ${lead.name.split(' ')[0]}!`)}
                    target="_blank"
                    rel="noopener"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl text-green-400 active:bg-green-500/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href={`tel:${lead.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl text-blue-600 dark:text-cyan-400 active:bg-blue-500/10 dark:bg-cyan-500/10 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Lead Detail Modal — mobile-optimized */}
      <Modal open={!!selectedLead} onClose={() => setSelectedLead(null)} title={selectedLead?.name || ''} size="lg">
        {selectedLead && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={selectedLead.name} size="lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--sf-text-primary)]">{selectedLead.name}</h3>
                <p className="text-sm text-[var(--sf-text-tertiary)]">{selectedLead.email}</p>
                <p className="text-sm text-[var(--sf-text-tertiary)]">{selectedLead.phone}</p>
              </div>
            </div>

            {/* Action buttons — large touch targets */}
            <div className="grid grid-cols-3 gap-2">
              <a href={`tel:${selectedLead.phone}`} className="block">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 rounded-2xl active:bg-cyan-500/20">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <span className="text-[11px] font-medium text-blue-600 dark:text-cyan-300">Ligar</span>
                </div>
              </a>
              <a href={generateWhatsAppLink(selectedLead.phone, `Olá ${selectedLead.name.split(' ')[0]}!`)} target="_blank" rel="noopener" className="block">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-green-500/10 border border-green-500/20 rounded-2xl active:bg-green-500/20">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                  <span className="text-[11px] font-medium text-green-300">WhatsApp</span>
                </div>
              </a>
              <a href={`mailto:${selectedLead.email}`} className="block">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-violet-500/10 border border-violet-500/20 rounded-2xl active:bg-violet-500/20">
                  <Mail className="w-5 h-5 text-violet-400" />
                  <span className="text-[11px] font-medium text-violet-300">Email</span>
                </div>
              </a>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Valor Estimado', value: formatCurrency(selectedLead.estimated_value) },
                { label: 'Score IA', value: `${selectedLead.ai_score}/100` },
                { label: 'Origem', value: getLeadSourceLabel(selectedLead.source) },
                { label: 'Stand', value: selectedLead.stand_name.replace('Stand ', '') },
                { label: 'Agente', value: selectedLead.agent_name },
                { label: 'Atualizado', value: timeAgo(selectedLead.updated_at) },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                  <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{item.value}</p>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>

            <Badge variant={stageVariant[selectedLead.stage]}>{getLeadStageLabel(selectedLead.stage)}</Badge>
          </div>
        )}
      </Modal>

      {/* New Lead Modal */}
      <Modal open={showNewLead} onClose={() => setShowNewLead(false)} title="Novo Lead" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Nome completo', placeholder: 'Nome do lead' },
              { label: 'Telefone', placeholder: '(11) 99999-0000' },
              { label: 'Email', placeholder: 'email@exemplo.com' },
            ].map((field) => (
              <div key={field.label} className="space-y-1.5">
                <label className="text-xs text-[var(--sf-text-secondary)] font-medium">{field.label}</label>
                <input className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" placeholder={field.placeholder} />
              </div>
            ))}
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-secondary)] font-medium">Origem</label>
              <select className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20">
                <option value="whatsapp">WhatsApp</option>
                <option value="site">Site</option>
                <option value="stand">Stand</option>
                <option value="evento">Evento</option>
                <option value="indicacao">Indicação</option>
                <option value="instagram">Instagram</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-secondary)] font-medium">Stand</label>
            <select className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20">
              {stands.filter(s => s.status === 'ativo').map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNewLead(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={() => setShowNewLead(false)}>Salvar Lead</Button>
          </div>
        </div>
      </Modal>

      {/* Mobile FAB for new lead */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNewLead(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center shadow-[0_4px_24px_rgb(103,232,249,0.3)] border border-[var(--sf-border-hover)]"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}

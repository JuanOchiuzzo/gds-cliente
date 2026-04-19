'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useLeads } from '@/lib/hooks/use-leads';
import { formatCurrency, getLeadStageLabel, getLeadSourceLabel, generateWhatsAppLink, timeAgo } from '@/lib/utils';
import { MessageCircle, Phone, GripVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { LeadRow } from '@/lib/hooks/use-leads';

type Stage = 'novo' | 'qualificado' | 'visita_agendada' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
const stages: { key: Stage; label: string; color: string; dotColor: string; bg: string }[] = [
  { key: 'novo', label: 'Novo Lead', color: 'text-blue-600 dark:text-cyan-400', dotColor: 'bg-cyan-400', bg: 'bg-cyan-500/5' },
  { key: 'qualificado', label: 'Qualificado', color: 'text-violet-500', dotColor: 'bg-violet-400', bg: 'bg-violet-500/5' },
  { key: 'visita_agendada', label: 'Visita Agendada', color: 'text-amber-500', dotColor: 'bg-amber-400', bg: 'bg-amber-500/5' },
  { key: 'proposta', label: 'Proposta', color: 'text-indigo-500', dotColor: 'bg-indigo-400', bg: 'bg-indigo-500/5' },
  { key: 'negociacao', label: 'Negociação', color: 'text-orange-500', dotColor: 'bg-orange-400', bg: 'bg-orange-500/5' },
  { key: 'fechado', label: 'Fechado ✓', color: 'text-emerald-500', dotColor: 'bg-emerald-400', bg: 'bg-emerald-500/5' },
  { key: 'perdido', label: 'Perdido', color: 'text-red-500', dotColor: 'bg-red-400', bg: 'bg-red-500/5' },
];

export default function PipelinePage() {
  const { leads, loading, update } = useLeads();
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [mobileStageIdx, setMobileStageIdx] = useState(0);

  const grouped = useMemo(() => {
    const map: Record<Stage, LeadRow[]> = { novo: [], qualificado: [], visita_agendada: [], proposta: [], negociacao: [], fechado: [], perdido: [] };
    leads.forEach((l) => { if (map[l.stage as Stage]) map[l.stage as Stage].push(l); });
    return map;
  }, [leads]);

  const handleDrop = async (stage: Stage) => {
    if (!draggedLead) return;
    const { error } = await update(draggedLead, { stage });
    if (error) toast.error('Erro ao mover lead');
    else toast.success(`Lead movido para ${getLeadStageLabel(stage)}`);
    setDraggedLead(null);
  };

  const currentStage = stages[mobileStageIdx];

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Pipeline</h1>
        <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5 lg:hidden">Deslize entre as etapas</p>
        <p className="text-sm text-[var(--sf-text-tertiary)] mt-1 hidden lg:block">Arraste os leads entre as colunas</p>
      </div>

      {/* MOBILE */}
      <div className="lg:hidden space-y-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {stages.map((s, i) => (
            <button key={s.key} onClick={() => setMobileStageIdx(i)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border whitespace-nowrap text-xs font-medium transition-all ${
                mobileStageIdx === i ? `${s.bg} ${s.color} border-current/30` : 'bg-[var(--sf-surface)] text-[var(--sf-text-tertiary)] border-[var(--sf-border)]'
              }`}>
              <div className={`w-2 h-2 rounded-full ${s.dotColor} ${mobileStageIdx === i ? '' : 'opacity-40'}`} />
              {s.label} <span className="text-[10px] opacity-60">{grouped[s.key].length}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between px-1">
          <button onClick={() => setMobileStageIdx(Math.max(0, mobileStageIdx - 1))} disabled={mobileStageIdx === 0} className="p-2 rounded-xl text-[var(--sf-text-tertiary)] disabled:opacity-30"><ChevronLeft className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${currentStage.dotColor}`} />
            <span className={`text-sm font-semibold ${currentStage.color}`}>{currentStage.label}</span>
            <span className="text-xs text-[var(--sf-text-muted)] bg-[var(--sf-surface)] px-2 py-0.5 rounded-lg">{grouped[currentStage.key].length}</span>
          </div>
          <button onClick={() => setMobileStageIdx(Math.min(stages.length - 1, mobileStageIdx + 1))} disabled={mobileStageIdx === stages.length - 1} className="p-2 rounded-xl text-[var(--sf-text-tertiary)] disabled:opacity-30"><ChevronRight className="w-5 h-5" /></button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentStage.key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2 min-h-[200px]">
            {grouped[currentStage.key].length === 0 ? (
              <div className="text-center py-12 text-[var(--sf-text-muted)]"><p className="text-sm">Nenhum lead nesta etapa</p></div>
            ) : grouped[currentStage.key].map((lead) => (
              <motion.div key={lead.id} whileTap={{ scale: 0.98 }} onClick={() => setSelectedLead(lead)}
                className="p-3.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Avatar name={lead.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{lead.name}</p>
                    <span className="text-xs text-[var(--sf-text-tertiary)]">{formatCurrency(lead.estimated_value)}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex flex-col gap-1">
                      <a href={generateWhatsAppLink(lead.phone, `Olá ${lead.name.split(' ')[0]}!`)} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()} className="p-2 rounded-xl text-green-600 dark:text-green-400"><MessageCircle className="w-4 h-4" /></a>
                      <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="p-2 rounded-xl text-blue-600 dark:text-cyan-400"><Phone className="w-4 h-4" /></a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DESKTOP Kanban */}
      <div className="hidden lg:flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {stages.map((stage) => (
          <div key={stage.key} className="flex-shrink-0 w-72" onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(stage.key)}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className={`w-2 h-2 rounded-full ${stage.dotColor}`} />
              <span className={`text-sm font-semibold ${stage.color}`}>{stage.label}</span>
              <span className="ml-auto text-xs text-[var(--sf-text-muted)] bg-[var(--sf-surface)] px-2 py-0.5 rounded-lg">{grouped[stage.key].length}</span>
            </div>
            <div className="space-y-2 min-h-[200px] p-2 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
              {grouped[stage.key].map((lead) => (
                <div key={lead.id} draggable onDragStart={() => setDraggedLead(lead.id)} onClick={() => setSelectedLead(lead)}
                  className="p-3 bg-[var(--sf-bg-secondary)] border border-[var(--sf-border)] rounded-2xl hover:border-[var(--sf-border-hover)] cursor-grab active:cursor-grabbing group">
                  <div className="flex items-start gap-2">
                    <GripVertical className="w-4 h-4 text-[var(--sf-text-muted)] mt-0.5 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Avatar name={lead.name} size="sm" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--sf-text-primary)] truncate">{lead.name}</p>
                          <p className="text-[10px] text-[var(--sf-text-tertiary)]">{lead.stand_name || ''}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-[var(--sf-text-secondary)]">{formatCurrency(lead.estimated_value)}</span>
                        <span className="text-[10px] text-[var(--sf-text-muted)]">{timeAgo(lead.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedLead} onClose={() => setSelectedLead(null)} title={selectedLead?.name || ''} size="md">
        {selectedLead && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedLead.name} size="lg" />
              <div><p className="font-semibold text-[var(--sf-text-primary)]">{selectedLead.name}</p><p className="text-sm text-[var(--sf-text-tertiary)]">{selectedLead.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl"><p className="text-sm font-semibold text-[var(--sf-text-primary)]">{formatCurrency(selectedLead.estimated_value)}</p><p className="text-[10px] text-[var(--sf-text-tertiary)]">Valor</p></div>
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl"><p className="text-sm font-semibold text-[var(--sf-text-primary)]">{selectedLead.ai_score}/100</p><p className="text-[10px] text-[var(--sf-text-tertiary)]">Score IA</p></div>
            </div>
            {selectedLead.phone && (
              <div className="grid grid-cols-2 gap-2">
                <a href={generateWhatsAppLink(selectedLead.phone, `Olá ${selectedLead.name.split(' ')[0]}!`)} target="_blank" rel="noopener">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl text-sm font-medium text-green-700 dark:text-green-300"><MessageCircle className="w-4 h-4" /> WhatsApp</div>
                </a>
                <a href={`tel:${selectedLead.phone}`}>
                  <div className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 rounded-2xl text-sm font-medium text-blue-700 dark:text-cyan-300"><Phone className="w-4 h-4" /> Ligar</div>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

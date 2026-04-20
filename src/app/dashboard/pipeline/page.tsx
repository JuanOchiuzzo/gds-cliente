'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Ring } from '@/components/ui/ring';
import { NumberFlow, CurrencyFlow } from '@/components/ui/number-flow';
import { useLeads, type LeadRow } from '@/lib/hooks/use-leads';
import {
  formatCurrency,
  getLeadStageLabel,
  generateWhatsAppLink,
  getFirstName,
  timeAgo,
} from '@/lib/utils';
import { staggerParent, slideUp, spring } from '@/lib/motion';
import { cn } from '@/lib/utils';
import { fireConfetti } from '@/components/effects/confetti';

type Stage =
  | 'novo'
  | 'qualificado'
  | 'visita_agendada'
  | 'proposta'
  | 'negociacao'
  | 'fechado'
  | 'perdido';

interface StageMeta {
  key: Stage;
  label: string;
  accent: string;
  ring: string;
  heat: number;
}

const STAGES: StageMeta[] = [
  { key: 'novo', label: 'Novo', accent: 'text-info', ring: 'ring-info/30', heat: 0 },
  { key: 'qualificado', label: 'Qualificado', accent: 'text-aurora-1', ring: 'ring-aurora-1/30', heat: 1 },
  { key: 'visita_agendada', label: 'Visita', accent: 'text-aurora-2', ring: 'ring-aurora-2/30', heat: 2 },
  { key: 'proposta', label: 'Proposta', accent: 'text-warning', ring: 'ring-warning/30', heat: 3 },
  { key: 'negociacao', label: 'Negociação', accent: 'text-solar', ring: 'ring-solar/30', heat: 4 },
  { key: 'fechado', label: 'Fechado', accent: 'text-success', ring: 'ring-success/30', heat: 5 },
  { key: 'perdido', label: 'Perdido', accent: 'text-danger', ring: 'ring-danger/30', heat: -1 },
];

export default function PipelinePage() {
  const { leads, loading, update } = useLeads();
  const [selectedLead, setSelectedLead] = useState<LeadRow | null>(null);
  const [draggedLead, setDraggedLead] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);
  const [mobileStageIdx, setMobileStageIdx] = useState(0);

  const grouped = useMemo(() => {
    const map: Record<Stage, LeadRow[]> = {
      novo: [],
      qualificado: [],
      visita_agendada: [],
      proposta: [],
      negociacao: [],
      fechado: [],
      perdido: [],
    };
    leads.forEach((l) => {
      if (map[l.stage as Stage]) map[l.stage as Stage].push(l);
    });
    return map;
  }, [leads]);

  const totals = useMemo(() => {
    const t: Record<Stage, number> = {
      novo: 0,
      qualificado: 0,
      visita_agendada: 0,
      proposta: 0,
      negociacao: 0,
      fechado: 0,
      perdido: 0,
    };
    leads.forEach((l) => {
      t[l.stage as Stage] += l.estimated_value || 0;
    });
    return t;
  }, [leads]);

  const handleDrop = async (stage: Stage) => {
    if (!draggedLead) return;
    const lead = leads.find((l) => l.id === draggedLead);
    const wasNotClosed = lead?.stage !== 'fechado';
    const { error } = await update(draggedLead, { stage });
    if (error) toast.error('Erro ao mover lead');
    else {
      if (stage === 'fechado' && wasNotClosed) {
        fireConfetti();
        toast.success(`🎉 Venda fechada: ${lead?.name || 'Lead'}`);
      } else {
        toast.success(`Movido para ${getLeadStageLabel(stage)}`);
      }
    }
    setDraggedLead(null);
    setOverStage(null);
  };

  const currentStage = STAGES[mobileStageIdx];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerParent(0.05)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={slideUp}>
        <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Pipeline</h1>
        <p className="mt-1.5 text-sm text-text-soft">
          Arraste leads entre os {STAGES.length} estágios do funil
        </p>
      </motion.div>

      {/* MOBILE */}
      <div className="lg:hidden space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          {STAGES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setMobileStageIdx(i)}
              className={cn(
                'flex items-center gap-1.5 px-3 h-8 rounded-full border whitespace-nowrap text-xs font-medium transition-colors flex-shrink-0',
                mobileStageIdx === i
                  ? `bg-surface-2 ${s.accent} border-border-glow`
                  : 'bg-surface-1 text-text-faint border-border'
              )}
            >
              {s.label}
              <span className="text-[10px] text-text-faint font-mono">
                {grouped[s.key].length}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setMobileStageIdx(Math.max(0, mobileStageIdx - 1))}
            disabled={mobileStageIdx === 0}
            className="w-9 h-9 rounded-md text-text-faint hover:bg-surface-1 disabled:opacity-30 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className={cn('text-base font-medium', currentStage.accent)}>
              {currentStage.label}
            </span>
            <Badge variant="neutral" size="xs">
              {grouped[currentStage.key].length}
            </Badge>
          </div>
          <button
            onClick={() => setMobileStageIdx(Math.min(STAGES.length - 1, mobileStageIdx + 1))}
            disabled={mobileStageIdx === STAGES.length - 1}
            className="w-9 h-9 rounded-md text-text-faint hover:bg-surface-1 disabled:opacity-30 flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStage.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-2 min-h-[280px]"
          >
            {grouped[currentStage.key].length === 0 ? (
              <div className="text-center py-14 text-text-faint">
                <p className="text-sm">Nenhum lead nesta etapa</p>
              </div>
            ) : (
              grouped[currentStage.key].map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onClick={() => setSelectedLead(lead)}
                  draggable={false}
                />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* DESKTOP Kanban */}
      <div className="hidden lg:flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
        {STAGES.map((stage) => {
          const isOver = overStage === stage.key && draggedLead;
          return (
            <div
              key={stage.key}
              className="flex-shrink-0 w-[300px] snap-start"
              onDragOver={(e) => {
                e.preventDefault();
                setOverStage(stage.key);
              }}
              onDragLeave={() => setOverStage(null)}
              onDrop={() => handleDrop(stage.key)}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className={cn('text-sm font-medium', stage.accent)}>
                    {stage.label}
                  </span>
                  <Badge variant="neutral" size="xs">
                    {grouped[stage.key].length}
                  </Badge>
                </div>
                <span className="text-[11px] text-text-faint font-mono">
                  {formatCurrency(totals[stage.key])}
                </span>
              </div>

              <div
                className={cn(
                  'min-h-[420px] p-2 rounded-lg transition-all',
                  'bg-surface-0/50 border border-border',
                  isOver && `border-transparent ring-2 ${stage.ring} bg-surface-1`
                )}
              >
                <AnimatePresence>
                  {grouped[stage.key].map((lead) => (
                    <motion.div
                      key={lead.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={spring}
                      className="mb-2 last:mb-0"
                    >
                      <LeadCard
                        lead={lead}
                        draggable
                        onDragStart={() => setDraggedLead(lead.id)}
                        onClick={() => setSelectedLead(lead)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(v) => !v && setSelectedLead(null)}>
        <DialogContent size="md">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar name={selectedLead.name} size="lg" ring="solar" />
                  <div>
                    <p className="font-display italic text-2xl text-text">{selectedLead.name}</p>
                    <p className="text-xs text-text-soft mt-0.5">{selectedLead.email}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3">
                <Surface variant="flat" padding="md">
                  <p className="text-[11px] text-text-faint uppercase tracking-wider mb-1">Valor</p>
                  <p className="text-xl font-medium text-solar">
                    <CurrencyFlow value={selectedLead.estimated_value} />
                  </p>
                </Surface>
                <Surface variant="flat" padding="md" className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-text-faint uppercase tracking-wider mb-1">
                      Score IA
                    </p>
                    <p className="text-xl font-medium text-text">
                      <NumberFlow value={selectedLead.ai_score} suffix="/100" />
                    </p>
                  </div>
                  <Ring value={selectedLead.ai_score} size={52} strokeWidth={4} showLabel={false} />
                </Surface>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="solar" size="sm">
                  {getLeadStageLabel(selectedLead.stage)}
                </Badge>
                {selectedLead.source && <Badge variant="aurora" size="sm">{selectedLead.source}</Badge>}
                {selectedLead.stand_name && (
                  <Badge variant="neutral" size="sm">{selectedLead.stand_name}</Badge>
                )}
              </div>

              {selectedLead.phone && (
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <a
                    href={generateWhatsAppLink(
                      selectedLead.phone,
                      `Olá ${getFirstName(selectedLead.name)}!`
                    )}
                    target="_blank"
                    rel="noopener"
                  >
                    <Button variant="outline" className="w-full border-success/30 text-success hover:bg-success/10 hover:border-success">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </Button>
                  </a>
                  <a href={`tel:${selectedLead.phone}`}>
                    <Button variant="outline" className="w-full border-info/30 text-info hover:bg-info/10 hover:border-info">
                      <Phone className="w-4 h-4" />
                      Ligar
                    </Button>
                  </a>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function LeadCard({
  lead,
  draggable,
  onClick,
  onDragStart,
}: {
  lead: LeadRow;
  draggable: boolean;
  onClick: () => void;
  onDragStart?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onClick={onClick}
      className={cn(
        'group p-3 bg-surface-0 border border-border rounded-md transition-all',
        'hover:border-border-glow hover:bg-surface-1',
        draggable && 'cursor-grab active:cursor-grabbing active:opacity-70'
      )}
    >
      <div className="flex items-center gap-2.5">
        <Avatar name={lead.name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text truncate">{lead.name}</p>
          <p className="text-[11px] text-text-faint truncate">
            {lead.stand_name || 'Sem stand'}
          </p>
        </div>
        {lead.ai_score > 0 && (
          <Ring
            value={lead.ai_score}
            size={28}
            strokeWidth={2.5}
            showLabel={false}
            variant={lead.ai_score > 75 ? 'solar' : 'aurora'}
          />
        )}
      </div>
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border">
        <span className="text-[12px] text-text-soft font-mono">
          {formatCurrency(lead.estimated_value)}
        </span>
        <span className="text-[10px] text-text-faint">{timeAgo(lead.updated_at)}</span>
      </div>
    </div>
  );
}

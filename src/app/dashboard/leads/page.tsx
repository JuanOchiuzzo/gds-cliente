'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  Trash2,
  Edit3,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Chip } from '@/components/ui/chip';
import { Ring } from '@/components/ui/ring';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useLeads, type LeadRow } from '@/lib/hooks/use-leads';
import { useStands } from '@/lib/hooks/use-stands';
import { useAuth } from '@/lib/auth-context';
import { fireConfetti } from '@/components/effects/confetti';
import {
  formatCurrency,
  getLeadStageLabel,
  getLeadSourceLabel,
  generateWhatsAppLink,
  getFirstName,
  timeAgo,
  isValidEmail,
  isValidBRPhone,
  onlyDigits,
  cn,
} from '@/lib/utils';
import { tryConsume, RATE_LIMITS } from '@/lib/rate-limit';
import { staggerParent, slideUp } from '@/lib/motion';

const STAGE_VARIANT: Record<string, BadgeProps['variant']> = {
  novo: 'info',
  qualificado: 'aurora',
  visita_agendada: 'warning',
  proposta: 'aurora',
  negociacao: 'solar',
  fechado: 'success',
  perdido: 'danger',
};

const STAGE_ORDER = [
  'novo',
  'qualificado',
  'visita_agendada',
  'proposta',
  'negociacao',
  'fechado',
  'perdido',
];
const SOURCE_OPTIONS = ['whatsapp', 'site', 'evento', 'stand', 'indicacao', 'instagram', 'telefone'];

export default function LeadsPage() {
  const { leads, loading, loadingMore, hasMore, total, loadMore, create, update, remove } = useLeads();
  const { stands } = useStands();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStageChange, setShowStageChange] = useState(false);

  // Forms
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'stand',
    stand_id: '',
    value: '',
    notes: '',
  });

  const filtered = useMemo(
    () =>
      leads.filter((l) => {
        const matchSearch =
          (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
          (l.phone || '').includes(search);
        const matchStage = stageFilter === 'all' || l.stage === stageFilter;
        return matchSearch && matchStage;
      }),
    [leads, search, stageFilter]
  );

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }
    if (form.email && !isValidEmail(form.email)) {
      toast.error('Email inválido');
      return;
    }
    if (form.phone && !isValidBRPhone(form.phone)) {
      toast.error('Telefone inválido (use DDD + número)');
      return;
    }
    if (!tryConsume(`lead:create:${user?.id ?? 'anon'}`, RATE_LIMITS.createLead)) {
      toast.error('Muitos leads em pouco tempo. Aguarde um instante.');
      return;
    }
    await create({
      name: form.name.trim(),
      phone: form.phone ? onlyDigits(form.phone) : null,
      email: form.email ? form.email.trim().toLowerCase() : null,
      source: form.source as LeadRow['source'],
      stand_id: form.stand_id || null,
      agent_id: user?.id || null,
      estimated_value: Number(form.value) || 0,
      notes: form.notes || null,
    });
    toast.success('Lead criado');
    setShowNew(false);
    setForm({ name: '', phone: '', email: '', source: 'stand', stand_id: '', value: '', notes: '' });
  };

  const openEdit = (lead: LeadRow) => {
    setForm({
      name: lead.name,
      phone: lead.phone || '',
      email: lead.email || '',
      source: lead.source || 'stand',
      stand_id: lead.stand_id || '',
      value: String(lead.estimated_value || ''),
      notes: lead.notes || '',
    });
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!selected || !form.name.trim()) return;
    if (form.email && !isValidEmail(form.email)) {
      toast.error('Email inválido');
      return;
    }
    if (form.phone && !isValidBRPhone(form.phone)) {
      toast.error('Telefone inválido (use DDD + número)');
      return;
    }
    await update(selected.id, {
      name: form.name.trim(),
      phone: form.phone ? onlyDigits(form.phone) : null,
      email: form.email ? form.email.trim().toLowerCase() : null,
      source: form.source,
      estimated_value: Number(form.value) || 0,
      notes: form.notes || null,
    });
    toast.success('Lead atualizado');
    setShowEdit(false);
    setSelected(null);
  };

  const handleStageChange = async (newStage: string) => {
    if (!selected) return;
    const wasNotClosed = selected.stage !== 'fechado';
    await update(selected.id, { stage: newStage });
    if (newStage === 'fechado' && wasNotClosed) {
      fireConfetti();
      toast.success(`🎉 Venda fechada: ${selected.name}`);
    } else {
      toast.success(`Movido para ${getLeadStageLabel(newStage)}`);
    }
    setShowStageChange(false);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm(`Excluir ${selected.name}?`)) return;
    await remove(selected.id);
    toast.success('Lead excluído');
    setSelected(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-border-strong border-t-solar rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerParent(0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={slideUp} className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display italic text-3xl lg:text-4xl tracking-tight">Leads</h1>
          <p className="mt-1 text-sm text-text-soft">
            {filtered.length} de {total || leads.length} total
          </p>
        </div>
        <Button variant="solar" size="md" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Novo lead</span>
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={slideUp} className="space-y-3">
        <Input
          icon={<Search className="w-4 h-4" />}
          placeholder="Buscar por nome ou telefone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          <Chip active={stageFilter === 'all'} onClick={() => setStageFilter('all')}>
            Todos
          </Chip>
          {STAGE_ORDER.map((s) => (
            <Chip
              key={s}
              active={stageFilter === s}
              onClick={() => setStageFilter(s)}
            >
              {getLeadStageLabel(s)}
            </Chip>
          ))}
        </div>
      </motion.div>

      {/* Lead list */}
      {filtered.length === 0 ? (
        <Surface variant="elevated" padding="xl">
          <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title={leads.length === 0 ? 'Nenhum lead ainda' : 'Nada encontrado'}
            description={
              leads.length === 0
                ? 'Comece adicionando seu primeiro lead.'
                : 'Tente ajustar filtros ou busca.'
            }
            action={
              leads.length === 0 ? (
                <Button variant="solar" onClick={() => setShowNew(true)}>
                  <Plus className="w-4 h-4" />
                  Novo lead
                </Button>
              ) : null
            }
          />
        </Surface>
      ) : (
        <motion.div variants={staggerParent(0.02)} className="space-y-2">
          {filtered.map((lead) => (
            <motion.div key={lead.id} variants={slideUp}>
              <div
                onClick={() => setSelected(lead)}
                className="group flex items-center gap-3 p-3 bg-surface-0 border border-border rounded-md hover:border-border-glow hover:bg-surface-1 transition-colors cursor-pointer"
              >
                <Avatar name={lead.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-text truncate">{lead.name}</h3>
                    <Badge
                      variant={STAGE_VARIANT[lead.stage] || 'neutral'}
                      size="xs"
                    >
                      {getLeadStageLabel(lead.stage)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-text-faint">
                    <span className="font-mono">{formatCurrency(lead.estimated_value)}</span>
                    {lead.stand_name && <span>· {lead.stand_name}</span>}
                    <span>· {timeAgo(lead.updated_at)}</span>
                  </div>
                </div>

                {lead.ai_score > 0 && (
                  <Ring
                    value={lead.ai_score}
                    size={36}
                    strokeWidth={3}
                    variant={lead.ai_score >= 70 ? 'solar' : 'aurora'}
                  />
                )}

                <div className="hidden sm:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {lead.phone && (
                    <>
                      <a
                        href={generateWhatsAppLink(
                          lead.phone,
                          `Olá ${getFirstName(lead.name)}!`
                        )}
                        target="_blank"
                        rel="noopener"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-success hover:bg-success/10 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${lead.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-info hover:bg-info/10 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          {hasMore && stageFilter === 'all' && !search && (
            <div className="pt-3 flex justify-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? 'Carregando…' : `Carregar mais (${total - leads.length} restantes)`}
              </Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Detail dialog */}
      <Dialog
        open={!!selected && !showEdit && !showStageChange}
        onOpenChange={(v) => !v && setSelected(null)}
      >
        <DialogContent size="lg">
          {selected && (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle className="flex items-start gap-3">
                  <Avatar name={selected.name} size="lg" ring="solar" />
                  <div className="flex-1 min-w-0">
                    <p className="font-display italic text-2xl text-text">{selected.name}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5 text-[11px] text-text-soft">
                      {selected.email && <span>{selected.email}</span>}
                      {selected.phone && <span>· {selected.phone}</span>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant={STAGE_VARIANT[selected.stage]} size="sm">
                        {getLeadStageLabel(selected.stage)}
                      </Badge>
                      {selected.source && (
                        <Badge variant="neutral" size="sm">
                          {getLeadSourceLabel(selected.source)}
                        </Badge>
                      )}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              {/* Quick actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {selected.phone && (
                  <>
                    <a href={`tel:${selected.phone}`}>
                      <Button variant="outline" className="w-full flex-col h-auto py-3 border-info/30 text-info hover:bg-info/10">
                        <Phone className="w-4 h-4 mb-0.5" />
                        <span className="text-[11px]">Ligar</span>
                      </Button>
                    </a>
                    <a
                      href={generateWhatsAppLink(
                        selected.phone,
                        `Olá ${getFirstName(selected.name)}!`
                      )}
                      target="_blank"
                      rel="noopener"
                    >
                      <Button variant="outline" className="w-full flex-col h-auto py-3 border-success/30 text-success hover:bg-success/10">
                        <MessageCircle className="w-4 h-4 mb-0.5" />
                        <span className="text-[11px]">WhatsApp</span>
                      </Button>
                    </a>
                  </>
                )}
                <Button
                  variant="outline"
                  className="w-full flex-col h-auto py-3 border-aurora-1/30 text-aurora-1 hover:bg-aurora-1/10"
                  onClick={() => setShowStageChange(true)}
                >
                  <ArrowRight className="w-4 h-4 mb-0.5" />
                  <span className="text-[11px]">Mover</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex-col h-auto py-3"
                  onClick={() => openEdit(selected)}
                >
                  <Edit3 className="w-4 h-4 mb-0.5" />
                  <span className="text-[11px]">Editar</span>
                </Button>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Valor', value: formatCurrency(selected.estimated_value) },
                  { label: 'Score IA', value: `${selected.ai_score}/100` },
                  { label: 'Origem', value: getLeadSourceLabel(selected.source || '—') },
                  { label: 'Stand', value: selected.stand_name || '—' },
                  { label: 'Agente', value: selected.agent_name || '—' },
                  { label: 'Atualizado', value: timeAgo(selected.updated_at) },
                ].map((i) => (
                  <Surface key={i.label} variant="flat" padding="sm">
                    <p className="text-[10px] text-text-faint uppercase tracking-wider mb-1">
                      {i.label}
                    </p>
                    <p className="text-sm font-medium text-text truncate">{i.value}</p>
                  </Surface>
                ))}
              </div>

              {selected.notes && (
                <Surface variant="flat" padding="md">
                  <div className="flex items-center gap-1.5 mb-2">
                    <FileText className="w-3.5 h-3.5 text-text-faint" />
                    <span className="text-[10px] text-text-faint uppercase tracking-wider font-medium">
                      Notas
                    </span>
                  </div>
                  <p className="text-sm text-text-soft">{selected.notes}</p>
                </Surface>
              )}

              <button
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 h-10 rounded-md bg-danger/10 border border-danger/25 text-danger text-xs font-medium hover:bg-danger/15 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Excluir lead
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change stage */}
      <Dialog open={showStageChange} onOpenChange={setShowStageChange}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Mover para…</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {STAGE_ORDER.map((stage) => {
              const isCurrent = selected?.stage === stage;
              return (
                <button
                  key={stage}
                  onClick={() => !isCurrent && handleStageChange(stage)}
                  disabled={isCurrent}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-md border text-left transition-colors',
                    isCurrent
                      ? 'bg-solar/10 border-solar/30'
                      : 'bg-surface-1 border-border hover:border-border-glow hover:bg-surface-2'
                  )}
                >
                  <Badge variant={STAGE_VARIANT[stage]} size="sm">
                    {getLeadStageLabel(stage)}
                  </Badge>
                  {isCurrent && (
                    <span className="text-[10px] text-text-faint ml-auto">atual</span>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Editar lead</DialogTitle>
          </DialogHeader>
          <LeadForm
            form={form}
            setForm={setForm}
            stands={stands}
            onCancel={() => setShowEdit(false)}
            onSubmit={handleEdit}
            submitLabel="Salvar"
          />
        </DialogContent>
      </Dialog>

      {/* New */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Novo lead</DialogTitle>
          </DialogHeader>
          <LeadForm
            form={form}
            setForm={setForm}
            stands={stands}
            onCancel={() => setShowNew(false)}
            onSubmit={handleCreate}
            submitLabel="Salvar lead"
          />
        </DialogContent>
      </Dialog>

      {/* Mobile FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNew(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Plus className="w-6 h-6 text-canvas" />
      </motion.button>
    </motion.div>
  );
}

interface FormShape {
  name: string;
  phone: string;
  email: string;
  source: string;
  stand_id: string;
  value: string;
  notes: string;
}

function LeadForm({
  form,
  setForm,
  stands,
  onCancel,
  onSubmit,
  submitLabel,
}: {
  form: FormShape;
  setForm: (f: FormShape) => void;
  stands: Array<{ id: string; name: string; status: string }>;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Nome"
          placeholder="Nome completo"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Telefone"
          placeholder="(11) 99999-0000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Email"
          placeholder="email@exemplo.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Valor estimado"
          type="number"
          placeholder="500000"
          value={form.value}
          onChange={(e) => setForm({ ...form, value: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          label="Origem"
          value={form.source}
          onChange={(v) => setForm({ ...form, source: v })}
          options={SOURCE_OPTIONS.map((s) => ({ value: s, label: getLeadSourceLabel(s) }))}
        />
        {stands.length > 0 && (
          <Select
            label="Stand"
            value={form.stand_id}
            onChange={(v) => setForm({ ...form, stand_id: v })}
            options={[
              { value: '', label: '—' },
              ...stands
                .filter((s) => s.status === 'ativo')
                .map((s) => ({ value: s.id, label: s.name })),
            ]}
          />
        )}
      </div>
      <Textarea
        label="Notas"
        rows={3}
        placeholder="Observações…"
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />
      <div className="flex gap-2 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="solar" className="flex-1" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

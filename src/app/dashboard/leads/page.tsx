'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Phone, MessageCircle, SlidersHorizontal, Trash2, Edit3, ArrowRight, FileText, Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Modal } from '@/components/ui/modal';
import { useLeads, type LeadRow } from '@/lib/hooks/use-leads';
import { useStands } from '@/lib/hooks/use-stands';
import { useAuth } from '@/lib/auth-context';
import { formatCurrency, getLeadStageLabel, getLeadSourceLabel, generateWhatsAppLink, timeAgo } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.03 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };
const stageVariant: Record<string, 'cyan' | 'violet' | 'emerald' | 'amber' | 'red' | 'zinc'> = {
  novo: 'cyan', qualificado: 'violet', visita_agendada: 'amber', proposta: 'violet', negociacao: 'amber', fechado: 'emerald', perdido: 'red',
};
const stageOrder = ['novo', 'qualificado', 'visita_agendada', 'proposta', 'negociacao', 'fechado', 'perdido'];
const sourceOptions = ['whatsapp', 'site', 'evento', 'stand', 'indicacao', 'instagram', 'telefone'];

export default function LeadsPage() {
  const { leads, loading, create, update, remove } = useLeads();
  const { stands } = useStands();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStageChange, setShowStageChange] = useState(false);

  // New lead form
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSource, setNewSource] = useState('stand');
  const [newStandId, setNewStandId] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newNotes, setNewNotes] = useState('');

  // Edit form
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSource, setEditSource] = useState('');
  const [editValue, setEditValue] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const filtered = useMemo(() => leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || (l.phone || '').includes(search);
    const matchStage = stageFilter === 'all' || l.stage === stageFilter;
    return matchSearch && matchStage;
  }), [leads, search, stageFilter]);

  const handleCreate = async () => {
    if (!newName) { toast.error('Nome é obrigatório'); return; }
    await create({
      name: newName, phone: newPhone || null, email: newEmail || null,
      source: newSource as LeadRow['source'], stand_id: newStandId || null,
      agent_id: user?.id || null, estimated_value: Number(newValue) || 0,
      notes: newNotes || null,
    });
    toast.success('Lead criado!');
    setShowNew(false);
    setNewName(''); setNewPhone(''); setNewEmail(''); setNewValue(''); setNewNotes(''); setNewSource('stand');
  };

  const openEdit = (lead: LeadRow) => {
    setEditName(lead.name);
    setEditPhone(lead.phone || '');
    setEditEmail(lead.email || '');
    setEditSource(lead.source || 'stand');
    setEditValue(String(lead.estimated_value || ''));
    setEditNotes(lead.notes || '');
    setShowEdit(true);
  };

  const handleEdit = async () => {
    if (!selected || !editName) return;
    await update(selected.id, {
      name: editName, phone: editPhone || null, email: editEmail || null,
      source: editSource, estimated_value: Number(editValue) || 0,
      notes: editNotes || null,
    });
    toast.success('Lead atualizado!');
    setShowEdit(false);
    setSelected(null);
  };

  const handleStageChange = async (newStage: string) => {
    if (!selected) return;
    await update(selected.id, { stage: newStage });
    toast.success(`Movido para ${getLeadStageLabel(newStage)}`);
    setShowStageChange(false);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm(`Tem certeza que deseja excluir ${selected.name}?`)) return;
    await remove(selected.id);
    toast.success('Lead excluído');
    setSelected(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Leads</h1>
          <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">{filtered.length} de {leads.length} leads</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Novo Lead</span>
        </Button>
      </motion.div>

      {/* Search + Filter */}
      <motion.div variants={fadeUp} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sf-text-muted)]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar nome, telefone..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] placeholder:text-[var(--sf-text-muted)] outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`p-2.5 rounded-2xl border transition-all ${stageFilter !== 'all' ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-600 dark:text-cyan-300' : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'}`}>
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </motion.div>

      {showFilters && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {['all', ...stageOrder].map((s) => (
            <button key={s} onClick={() => setStageFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border whitespace-nowrap transition-all ${
                stageFilter === s ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-200 dark:border-cyan-500/20 text-blue-700 dark:text-cyan-300' : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-tertiary)]'
              }`}>
              {s === 'all' ? 'Todos' : getLeadStageLabel(s)}
            </button>
          ))}
        </div>
      )}

      {/* Lead List */}
      {filtered.length === 0 ? (
        <GlassCard hover={false} className="!p-8 text-center">
          <p className="text-sm text-[var(--sf-text-tertiary)]">{leads.length === 0 ? 'Nenhum lead cadastrado' : 'Nenhum lead encontrado'}</p>
          <Button variant="neon" size="sm" className="mt-4" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> Novo Lead</Button>
        </GlassCard>
      ) : (
        <motion.div variants={stagger} className="space-y-2">
          {filtered.map((lead) => (
            <motion.div key={lead.id} variants={fadeUp}>
              <motion.div whileTap={{ scale: 0.98 }} onClick={() => setSelected(lead)}
                className="p-3.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] cursor-pointer">
                <div className="flex items-center gap-3">
                  <Avatar name={lead.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{lead.name}</h3>
                      <div className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        lead.ai_score >= 70 ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' :
                        lead.ai_score >= 40 ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400' :
                        'bg-red-100 dark:bg-red-500/15 text-red-700 dark:text-red-400'
                      }`}>{lead.ai_score}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={stageVariant[lead.stage] || 'zinc'} className="!text-[9px]">{getLeadStageLabel(lead.stage)}</Badge>
                      <span className="text-[10px] text-[var(--sf-text-tertiary)]">{formatCurrency(lead.estimated_value)}</span>
                    </div>
                    {lead.notes && <p className="text-[10px] text-[var(--sf-text-muted)] mt-0.5 truncate">{lead.notes}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    {lead.phone && (
                      <>
                        <a href={generateWhatsAppLink(lead.phone, `Olá ${lead.name.split(' ')[0]}!`)} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl text-green-600 dark:text-green-400 active:bg-green-500/10"><MessageCircle className="w-4 h-4" /></a>
                        <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl text-blue-600 dark:text-cyan-400 active:bg-blue-500/10"><Phone className="w-4 h-4" /></a>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── LEAD DETAIL MODAL ── */}
      <Modal open={!!selected && !showEdit && !showStageChange} onClose={() => setSelected(null)} title={selected?.name || ''} size="lg">
        {selected && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Avatar name={selected.name} size="lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-[var(--sf-text-primary)]">{selected.name}</h3>
                {selected.email && <p className="text-sm text-[var(--sf-text-tertiary)]">{selected.email}</p>}
                {selected.phone && <p className="text-sm text-[var(--sf-text-tertiary)]">{selected.phone}</p>}
              </div>
              <Badge variant={stageVariant[selected.stage] || 'zinc'}>{getLeadStageLabel(selected.stage)}</Badge>
            </div>

            {/* Quick Actions — large touch targets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {selected.phone && (
                <>
                  <a href={`tel:${selected.phone}`} className="block">
                    <div className="flex flex-col items-center gap-1.5 p-3 bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 rounded-2xl">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                      <span className="text-[11px] font-medium text-blue-700 dark:text-cyan-300">Ligar</span>
                    </div>
                  </a>
                  <a href={generateWhatsAppLink(selected.phone, `Olá ${selected.name.split(' ')[0]}!`)} target="_blank" rel="noopener" className="block">
                    <div className="flex flex-col items-center gap-1.5 p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-2xl">
                      <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-[11px] font-medium text-green-700 dark:text-green-300">WhatsApp</span>
                    </div>
                  </a>
                </>
              )}
              <button onClick={() => setShowStageChange(true)} className="block w-full">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 rounded-2xl">
                  <ArrowRight className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  <span className="text-[11px] font-medium text-violet-700 dark:text-violet-300">Mover Etapa</span>
                </div>
              </button>
              <button onClick={() => openEdit(selected)} className="block w-full">
                <div className="flex flex-col items-center gap-1.5 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl">
                  <Edit3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <span className="text-[11px] font-medium text-amber-700 dark:text-amber-300">Editar</span>
                </div>
              </button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Valor Estimado', value: formatCurrency(selected.estimated_value) },
                { label: 'Score IA', value: `${selected.ai_score}/100` },
                { label: 'Origem', value: getLeadSourceLabel(selected.source || '') },
                { label: 'Stand', value: selected.stand_name || '—' },
                { label: 'Agente', value: selected.agent_name || '—' },
                { label: 'Atualizado', value: timeAgo(selected.updated_at) },
              ].map((i) => (
                <div key={i.label} className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                  <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{i.value}</p>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)]">{i.label}</p>
                </div>
              ))}
            </div>

            {/* Notes */}
            {selected.notes && (
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="w-3.5 h-3.5 text-[var(--sf-text-muted)]" />
                  <span className="text-[10px] text-[var(--sf-text-tertiary)] font-medium">Notas</span>
                </div>
                <p className="text-xs text-[var(--sf-text-secondary)]">{selected.notes}</p>
              </div>
            )}

            {/* Delete */}
            <button onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-xs font-medium">
              <Trash2 className="w-3.5 h-3.5" /> Excluir Lead
            </button>
          </div>
        )}
      </Modal>

      {/* ── CHANGE STAGE MODAL ── */}
      <Modal open={showStageChange} onClose={() => setShowStageChange(false)} title="Mover para..." size="sm">
        <div className="space-y-2">
          {stageOrder.map((stage) => {
            const isCurrent = selected?.stage === stage;
            return (
              <button key={stage} onClick={() => !isCurrent && handleStageChange(stage)} disabled={isCurrent}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-[var(--sf-accent-light)] border-[var(--sf-accent)]/20 text-[var(--sf-accent)] font-semibold'
                    : 'bg-[var(--sf-surface)] border-[var(--sf-border)] text-[var(--sf-text-secondary)] active:bg-[var(--sf-surface-hover)]'
                }`}>
                <Badge variant={stageVariant[stage] || 'zinc'}>{getLeadStageLabel(stage)}</Badge>
                {isCurrent && <span className="text-[10px] text-[var(--sf-text-muted)] ml-auto">atual</span>}
              </button>
            );
          })}
        </div>
      </Modal>

      {/* ── EDIT LEAD MODAL ── */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Editar Lead" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Nome *</label>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Telefone</label>
              <input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Email</label>
              <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Valor estimado</label>
              <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" /></div>
          </div>
          <Select label="Origem" value={editSource} onChange={setEditSource} options={sourceOptions.map((s) => ({ value: s, label: getLeadSourceLabel(s) }))} />
          <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Notas</label>
            <textarea rows={3} value={editNotes} onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none resize-none" placeholder="Observações sobre o lead..." />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowEdit(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleEdit}>Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* ── NEW LEAD MODAL ── */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Novo Lead" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Nome *</label>
              <input value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder="Nome" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Telefone</label>
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder="(11) 99999-0000" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Email</label>
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder="email@exemplo.com" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Valor estimado</label>
              <input type="number" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder="500000" /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select label="Origem" value={newSource} onChange={setNewSource} options={sourceOptions.map((s) => ({ value: s, label: getLeadSourceLabel(s) }))} />
            {stands.length > 0 && (
              <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Stand</label>
                <select value={newStandId} onChange={(e) => setNewStandId(e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none">
                  <option value="">Selecionar...</option>
                  {stands.filter((s) => s.status === 'ativo').map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select></div>
            )}
          </div>
          <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Notas</label>
            <textarea rows={3} value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none resize-none" placeholder="Observações..." />
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleCreate}>Salvar Lead</Button>
          </div>
        </div>
      </Modal>

      {/* FAB */}
      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNew(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-lg border border-white/20">
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}

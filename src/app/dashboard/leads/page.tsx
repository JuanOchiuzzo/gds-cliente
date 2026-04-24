'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Edit3,
  FileText,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Input, Textarea } from '@/components/ui/input';
import { Ring } from '@/components/ui/ring';
import { Select } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetBody } from '@/components/ui/sheet';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { useLeads, type LeadRow } from '@/lib/hooks/use-leads';
import { useStands } from '@/lib/hooks/use-stands';
import { tryConsume, RATE_LIMITS } from '@/lib/rate-limit';
import {
  cn,
  formatCurrency,
  generateWhatsAppLink,
  getLeadSourceLabel,
  getLeadStageLabel,
  isValidBRPhone,
  isValidEmail,
  onlyDigits,
  timeAgo,
} from '@/lib/utils';

const STAGE_VARIANT: Record<string, BadgeVariant> = {
  novo: 'info',
  qualificado: 'iris',
  visita_agendada: 'warn',
  proposta: 'cyan',
  negociacao: 'iris',
  fechado: 'ok',
  perdido: 'bad',
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

const SOURCE_OPTIONS = [
  'whatsapp',
  'site',
  'evento',
  'stand',
  'indicacao',
  'instagram',
  'telefone',
];

type FormShape = {
  name: string;
  phone: string;
  email: string;
  source: string;
  stand_id: string;
  value: string;
  notes: string;
};

const EMPTY_FORM: FormShape = {
  name: '',
  phone: '',
  email: '',
  source: 'stand',
  stand_id: '',
  value: '',
  notes: '',
};

export default function LeadsPage() {
  const { leads, loading, total, create, update, remove } = useLeads();
  const { stands } = useStands();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const [sheet, setSheet] = useState<null | 'new' | 'edit' | 'stage' | 'detail'>(null);
  const [form, setForm] = useState<FormShape>(EMPTY_FORM);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return leads.filter((l) => {
      const matchSearch =
        (l.name || '').toLowerCase().includes(q) || (l.phone || '').includes(search);
      const matchStage = stageFilter === 'all' || l.stage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [leads, search, stageFilter]);

  const openDetail = (l: LeadRow) => {
    setSelected(l);
    setSheet('detail');
  };

  const openNew = () => {
    setForm(EMPTY_FORM);
    setSheet('new');
  };

  const openEdit = (l: LeadRow) => {
    setSelected(l);
    setForm({
      name: l.name,
      phone: l.phone || '',
      email: l.email || '',
      source: l.source || 'stand',
      stand_id: l.stand_id || '',
      value: String(l.estimated_value || ''),
      notes: l.notes || '',
    });
    setSheet('edit');
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error('Nome é obrigatório');
    if (form.email && !isValidEmail(form.email)) return toast.error('Email inválido');
    if (form.phone && !isValidBRPhone(form.phone))
      return toast.error('Telefone inválido (DDD + número)');
    if (!tryConsume(`lead:create:${user?.id ?? 'anon'}`, RATE_LIMITS.createLead))
      return toast.error('Aguarde um instante antes de criar outro lead.');

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
    setSheet(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = async () => {
    if (!selected || !form.name.trim()) return;
    if (form.email && !isValidEmail(form.email)) return toast.error('Email inválido');
    if (form.phone && !isValidBRPhone(form.phone))
      return toast.error('Telefone inválido');
    await update(selected.id, {
      name: form.name.trim(),
      phone: form.phone ? onlyDigits(form.phone) : null,
      email: form.email ? form.email.trim().toLowerCase() : null,
      source: form.source,
      estimated_value: Number(form.value) || 0,
      notes: form.notes || null,
    });
    toast.success('Lead atualizado');
    setSheet(null);
    setSelected(null);
  };

  const handleStageChange = async (newStage: string) => {
    if (!selected) return;
    await update(selected.id, { stage: newStage });
    toast.success(`Movido para ${getLeadStageLabel(newStage)}`);
    setSheet(null);
    setSelected(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm(`Excluir ${selected.name}?`)) return;
    await remove(selected.id);
    toast.success('Lead excluído');
    setSheet(null);
    setSelected(null);
  };

  if (loading) return <PageSkeleton />;

  return (
    <div className="animate-fade-in">
      <PageHeader
        eyebrow="Pipeline · ativos"
        title={<>Leads</>}
        description={`${filtered.length} de ${total || leads.length} no funil`}
        actions={
          <Button onClick={openNew} size="md">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Novo lead</span>
          </Button>
        }
      />

      {/* Filters */}
      <div className="space-y-3">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Buscar por nome ou telefone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
          <Chip active={stageFilter === 'all'} onClick={() => setStageFilter('all')}>
            Todos · {leads.length}
          </Chip>
          {STAGE_ORDER.map((s) => (
            <Chip key={s} active={stageFilter === s} onClick={() => setStageFilter(s)}>
              {getLeadStageLabel(s)}
            </Chip>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="mt-5">
        {filtered.length === 0 ? (
          <Card variant="glass" padding="xl">
            <EmptyState
              icon={<FileText className="h-5 w-5" />}
              title={leads.length === 0 ? 'Nenhum lead ainda' : 'Nada encontrado'}
              description={
                leads.length === 0
                  ? 'Comece adicionando seu primeiro lead ao funil.'
                  : 'Tente ajustar filtros ou busca.'
              }
              action={
                leads.length === 0 ? (
                  <Button onClick={openNew}>
                    <Plus className="h-4 w-4" />
                    Novo lead
                  </Button>
                ) : null
              }
            />
          </Card>
        ) : (
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.02 } } }}
            className="space-y-2"
          >
            {filtered.map((l) => (
              <motion.li
                key={l.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                }}
              >
                <button
                  onClick={() => openDetail(l)}
                  className="group flex w-full items-center gap-3 rounded-[16px] border border-line bg-ink-900 p-3 text-left transition-all press hover:border-line-strong hover:bg-ink-800"
                >
                  <Avatar name={l.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-fg">{l.name}</h3>
                      <Badge
                        variant={STAGE_VARIANT[l.stage] || 'neutral'}
                        size="xs"
                      >
                        {getLeadStageLabel(l.stage)}
                      </Badge>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-fg-muted">
                      <span className="font-mono">{formatCurrency(l.estimated_value)}</span>
                      {l.stand_name && <span>· {l.stand_name}</span>}
                      <span>· {timeAgo(l.updated_at)}</span>
                    </div>
                  </div>
                  {l.ai_score > 0 && (
                    <Ring
                      value={l.ai_score}
                      size={36}
                      stroke={3}
                      gradient={l.ai_score >= 70 ? 'iris' : 'cyan'}
                      label={`${l.ai_score}`}
                    />
                  )}
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Detail / Actions sheet */}
      <Sheet open={sheet === 'detail'} onOpenChange={(o) => !o && setSheet(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader
                title={selected.name}
                description={`${getLeadSourceLabel(selected.source || 'stand')} · ${timeAgo(selected.updated_at)}`}
              />
              <SheetBody>
                <div className="mb-4 flex items-center justify-between gap-3 rounded-[16px] border border-line bg-white/[0.03] p-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-faint">
                      Valor estimado
                    </p>
                    <p className="mt-1 font-display text-xl">
                      {formatCurrency(selected.estimated_value)}
                    </p>
                  </div>
                  <Badge variant={STAGE_VARIANT[selected.stage] || 'neutral'} size="md">
                    {getLeadStageLabel(selected.stage)}
                  </Badge>
                </div>

                {selected.notes && (
                  <div className="mb-4 rounded-[14px] border border-line bg-white/[0.02] p-3 text-sm text-fg-soft">
                    {selected.notes}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {selected.phone && (
                    <a
                      href={generateWhatsAppLink(
                        selected.phone,
                        `Olá ${selected.name.split(' ')[0]}!`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button block variant="secondary">
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </Button>
                    </a>
                  )}
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`}>
                      <Button block variant="secondary">
                        <Phone className="h-4 w-4" /> Ligar
                      </Button>
                    </a>
                  )}
                  <Button block variant="outline" onClick={() => openEdit(selected)}>
                    <Edit3 className="h-4 w-4" /> Editar
                  </Button>
                  <Button
                    block
                    variant="outline"
                    onClick={() => setSheet('stage')}
                  >
                    <ArrowRight className="h-4 w-4" /> Mover etapa
                  </Button>
                </div>

                <Button
                  block
                  variant="ghost"
                  className="mt-3 text-bad hover:bg-bad/10"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" /> Excluir lead
                </Button>
              </SheetBody>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Stage change */}
      <Sheet open={sheet === 'stage'} onOpenChange={(o) => !o && setSheet('detail')}>
        <SheetContent>
          <SheetHeader title="Mover etapa" description="Escolha a nova fase no funil" />
          <SheetBody>
            <ul className="space-y-2 pt-2">
              {STAGE_ORDER.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => handleStageChange(s)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-[14px] border px-4 py-3 text-sm font-medium press',
                      selected?.stage === s
                        ? 'border-iris/40 bg-iris/10 text-fg'
                        : 'border-line bg-white/[0.02] text-fg-soft hover:border-line-strong hover:bg-white/[0.05]',
                    )}
                  >
                    {getLeadStageLabel(s)}
                    {selected?.stage === s && <Badge variant="iris" size="xs">atual</Badge>}
                  </button>
                </li>
              ))}
            </ul>
          </SheetBody>
        </SheetContent>
      </Sheet>

      {/* New / Edit */}
      <Sheet
        open={sheet === 'new' || sheet === 'edit'}
        onOpenChange={(o) => !o && setSheet(null)}
      >
        <SheetContent>
          <SheetHeader
            title={sheet === 'new' ? 'Novo lead' : 'Editar lead'}
            description={sheet === 'new' ? 'Adicione um lead ao seu funil' : 'Atualize os dados do lead'}
          />
          <SheetBody>
            <div className="space-y-3 pt-2">
              <Input
                label="Nome"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nome completo"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Telefone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
                <Input
                  label="Valor (R$)"
                  type="number"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                  placeholder="0"
                />
              </div>
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="cliente@email.com"
              />
              <Select
                label="Origem"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {getLeadSourceLabel(s)}
                  </option>
                ))}
              </Select>
              <Select
                label="Stand"
                value={form.stand_id}
                onChange={(e) => setForm({ ...form, stand_id: e.target.value })}
              >
                <option value="">— Nenhum —</option>
                {stands.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Notas"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Contexto, preferências, histórico…"
              />

              <div className="flex gap-2 pt-3">
                <Button
                  block
                  variant="secondary"
                  onClick={() => setSheet(null)}
                >
                  Cancelar
                </Button>
                <Button
                  block
                  onClick={sheet === 'new' ? handleCreate : handleEdit}
                >
                  {sheet === 'new' ? 'Criar' : 'Salvar'}
                </Button>
              </div>
            </div>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  );
}

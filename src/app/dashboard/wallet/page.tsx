'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Flame,
  Lock,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Snowflake,
  Thermometer,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { NumberFlow } from '@/components/ui/number-flow';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useWallet, type WalletClientRow } from '@/lib/hooks/use-wallet';
import { useStands } from '@/lib/hooks/use-stands';
import { cn, generateWhatsAppLink, timeAgo } from '@/lib/utils';

type Temp = 'quente' | 'morno' | 'frio';
const TEMPS: { value: Temp; label: string; icon: React.ReactNode; variant: 'hot' | 'warm' | 'cold' }[] = [
  { value: 'quente', label: 'Quente', icon: <Flame className="h-3 w-3" />, variant: 'hot' },
  { value: 'morno', label: 'Morno', icon: <Thermometer className="h-3 w-3" />, variant: 'warm' },
  { value: 'frio', label: 'Frio', icon: <Snowflake className="h-3 w-3" />, variant: 'cold' },
];

const EMPTY_FORM = {
  name: '',
  phone: '',
  email: '',
  temperature: 'morno' as Temp,
  interested_product: '',
  stand_id: '',
  notes: '',
};

export default function WalletPage() {
  const { clients, tasks, loading, createClient, updateClient, deleteClient, completeTask } = useWallet();
  const { stands } = useStands();

  const [search, setSearch] = useState('');
  const [tempFilter, setTempFilter] = useState<'all' | Temp>('all');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<WalletClientRow | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c) => {
      const matchSearch =
        (c.name || '').toLowerCase().includes(q) || (c.phone || '').includes(search);
      const matchTemp = tempFilter === 'all' || c.temperature === tempFilter;
      return matchSearch && matchTemp;
    });
  }, [clients, search, tempFilter]);

  const pendingTasks = tasks.filter((t) => !t.completed);
  const stats = {
    total: clients.length,
    hot: clients.filter((c) => c.temperature === 'quente').length,
    warm: clients.filter((c) => c.temperature === 'morno').length,
    cold: clients.filter((c) => c.temperature === 'frio').length,
  };

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setSheetOpen(true);
  };
  const openEdit = (c: WalletClientRow) => {
    setEditing(c);
    setForm({
      name: c.name,
      phone: c.phone || '',
      email: c.email || '',
      temperature: c.temperature,
      interested_product: c.interested_product || '',
      stand_id: c.stand_id || '',
      notes: c.notes || '',
    });
    setSheetOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Informe o nome do cliente.');
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      temperature: form.temperature,
      interested_product: form.interested_product.trim() || null,
      stand_id: form.stand_id || null,
      notes: form.notes.trim() || null,
    };
    const res = editing
      ? await updateClient(editing.id, payload)
      : await createClient(payload);
    setSaving(false);
    if (res.error) {
      toast.error('Não foi possível salvar.');
      return;
    }
    toast.success(editing ? 'Cliente atualizado.' : 'Cliente adicionado.');
    setSheetOpen(false);
  };

  const confirmDelete = async (c: WalletClientRow) => {
    if (!confirm(`Remover ${c.name} da sua carteira?`)) return;
    const { error } = await deleteClient(c.id);
    if (error) toast.error('Erro ao remover.');
    else toast.success('Cliente removido.');
  };

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader
        eyebrow="Privada"
        title="Minha carteira"
        description="Clientes e tarefas visíveis apenas para você."
        actions={
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4" /> Novo
          </Button>
        }
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5 grid grid-cols-4 gap-2 sm:gap-3"
      >
        <StatTile label="Total" value={stats.total} icon={<Lock className="h-3.5 w-3.5" />} tone="iris" />
        <StatTile label="Quentes" value={stats.hot} icon={<Flame className="h-3.5 w-3.5" />} tone="hot" />
        <StatTile label="Mornos" value={stats.warm} icon={<Thermometer className="h-3.5 w-3.5" />} tone="warm" />
        <StatTile label="Frios" value={stats.cold} icon={<Snowflake className="h-3.5 w-3.5" />} tone="cold" />
      </motion.section>

      {pendingTasks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mb-5"
        >
          <Card variant="glass" padding="lg">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-fg-faint">
                Tarefas pendentes
              </p>
              <Badge variant="iris" size="sm">{pendingTasks.length}</Badge>
            </div>
            <ul className="space-y-2">
              {pendingTasks.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-[12px] border border-line bg-white/[0.02] p-3">
                  <button
                    onClick={() => completeTask(t.id)}
                    className="text-fg-muted hover:text-ok transition-colors"
                    aria-label="Concluir"
                  >
                    <Circle className="h-5 w-5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-fg">{t.description}</p>
                    <p className="truncate text-xs text-fg-muted">
                      {t.client_name || 'Sem cliente'} · {timeAgo(t.due_date)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </motion.section>
      )}

      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fg-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Chip active={tempFilter === 'all'} onClick={() => setTempFilter('all')}>Todos</Chip>
        {TEMPS.map((t) => (
          <Chip key={t.value} active={tempFilter === t.value} onClick={() => setTempFilter(t.value)}>
            {t.icon} {t.label}
          </Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" padding="xl">
          <EmptyState
            icon={<Lock className="h-5 w-5" />}
            title={clients.length === 0 ? 'Sua carteira está vazia' : 'Nenhum resultado'}
            description={
              clients.length === 0
                ? 'Adicione clientes privados com quem você está trabalhando.'
                : 'Tente outro termo de busca ou filtro.'
            }
            action={
              clients.length === 0 ? (
                <Button onClick={openNew} size="md">
                  <Plus className="h-4 w-4" /> Adicionar cliente
                </Button>
              ) : null
            }
          />
        </Card>
      ) : (
        <motion.ul
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
          className="space-y-2"
        >
          {filtered.map((c) => {
            const temp = TEMPS.find((t) => t.value === c.temperature);
            return (
              <motion.li
                key={c.id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              >
                <Card variant="solid" padding="md" className="flex items-center gap-3">
                  <Avatar name={c.name} size="md" />
                  <button onClick={() => openEdit(c)} className="min-w-0 flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-fg">{c.name}</p>
                      {temp && (
                        <Badge variant={temp.variant} size="xs">
                          {temp.icon}
                        </Badge>
                      )}
                    </div>
                    <p className="truncate text-xs text-fg-muted">
                      {c.interested_product || c.stand_name || 'Sem interesse definido'}
                    </p>
                  </button>
                  <div className="flex items-center gap-1">
                    {c.phone && (
                      <a
                        href={generateWhatsAppLink(c.phone, `Olá ${c.name}, tudo bem?`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ok/15 text-ok press"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => confirmDelete(c)}
                      className="flex h-9 w-9 items-center justify-center rounded-[10px] text-fg-muted hover:bg-bad/15 hover:text-bad transition-colors"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader
            title={editing ? 'Editar cliente' : 'Novo cliente'}
            description="Dados visíveis somente para você."
          />
          <SheetBody>
            <div className="space-y-3">
              <Input label="Nome *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-fg-faint">
                  Temperatura
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, temperature: t.value })}
                      className={cn(
                        'flex h-11 items-center justify-center gap-1.5 rounded-[12px] border text-sm font-medium transition-colors',
                        form.temperature === t.value
                          ? 'border-iris bg-iris/15 text-fg'
                          : 'border-line bg-white/[0.02] text-fg-muted',
                      )}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Interesse"
                value={form.interested_product}
                onChange={(e) => setForm({ ...form, interested_product: e.target.value })}
                placeholder="Ex: Apto 2Q · Torre A"
              />
              <Select
                label="Stand"
                value={form.stand_id}
                onChange={(e) => setForm({ ...form, stand_id: e.target.value })}
              >
                <option value="">Nenhum</option>
                {stands.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Select>
              <Textarea
                label="Anotações"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={3}
              />
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={save} loading={saving}>{editing ? 'Salvar' : 'Adicionar'}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon,
  tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone: 'iris' | 'hot' | 'warm' | 'cold';
}) {
  const map = {
    iris: 'text-iris-hi',
    hot: 'text-hot',
    warm: 'text-warm',
    cold: 'text-cold',
  } as const;
  return (
    <Card variant="solid" padding="sm" className="text-center">
      <div className={cn('mx-auto mb-1 flex h-6 w-6 items-center justify-center', map[tone])}>
        {icon}
      </div>
      <p className="font-display text-xl text-fg">
        <NumberFlow value={value} />
      </p>
      <p className="text-[10px] font-medium uppercase tracking-wider text-fg-faint">{label}</p>
    </Card>
  );
}

'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  Clock,
  MessageCircle,
  Phone,
  Plus,
} from 'lucide-react';
import { format, parseISO, isBefore, isToday, isTomorrow, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Avatar } from '@/components/ui/avatar';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
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
import { useAppointments, type AppointmentRow } from '@/lib/hooks/use-appointments';
import { useStands } from '@/lib/hooks/use-stands';
import { generateWhatsAppLink } from '@/lib/utils';

const STATUS_LABELS: Record<string, { label: string; variant: BadgeVariant }> = {
  pendente: { label: 'Pendente', variant: 'warn' },
  confirmado: { label: 'Confirmado', variant: 'info' },
  realizado: { label: 'Realizado', variant: 'ok' },
  cancelado: { label: 'Cancelado', variant: 'bad' },
  nao_compareceu: { label: 'Não veio', variant: 'bad' },
};

type Filter = 'upcoming' | 'today' | 'past' | 'all';

const EMPTY_FORM = {
  client_name: '',
  client_phone: '',
  client_email: '',
  stand_id: '',
  product_name: '',
  date: '',
  time: '',
  notes: '',
};

export default function AppointmentsPage() {
  const { appointments, loading, create, update } = useAppointments();
  const { stands } = useStands();

  const [filter, setFilter] = useState<Filter>('upcoming');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const filtered = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => {
        const d = parseISO(a.date);
        if (filter === 'today') return a.date === today;
        if (filter === 'upcoming') return !isBefore(d, new Date(today));
        if (filter === 'past') return isBefore(d, new Date(today));
        return true;
      })
      .sort((a, b) => {
        const aKey = `${a.date}T${a.time}`;
        const bKey = `${b.date}T${b.time}`;
        return filter === 'past' ? bKey.localeCompare(aKey) : aKey.localeCompare(bKey);
      });
  }, [appointments, filter, today]);

  const stats = {
    today: appointments.filter((a) => a.date === today).length,
    upcoming: appointments.filter((a) => !isBefore(parseISO(a.date), new Date(today))).length,
    done: appointments.filter((a) => a.status === 'realizado').length,
  };

  const save = async () => {
    if (!form.client_name.trim() || !form.date || !form.time) {
      toast.error('Preencha cliente, data e hora.');
      return;
    }
    setSaving(true);
    const { error } = await create({
      client_name: form.client_name.trim(),
      client_phone: form.client_phone.trim() || null,
      client_email: form.client_email.trim() || null,
      stand_id: form.stand_id || null,
      product_name: form.product_name.trim() || null,
      date: form.date,
      time: form.time,
      status: 'pendente',
      visit_notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error('Erro ao criar visita.');
      return;
    }
    toast.success('Visita agendada.');
    setSheetOpen(false);
    setForm(EMPTY_FORM);
  };

  const confirmVisit = async (a: AppointmentRow) => {
    const { error } = await update(a.id, { status: 'confirmado' });
    if (error) toast.error('Erro ao confirmar.');
    else toast.success('Confirmado.');
  };
  const markDone = async (a: AppointmentRow) => {
    const { error } = await update(a.id, { status: 'realizado' });
    if (error) toast.error('Erro.');
    else toast.success('Marcada como realizada.');
  };

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Visitas"
        description="Todas as visitas agendadas aos seus stands."
        actions={
          <Button size="sm" onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4" /> Nova
          </Button>
        }
      />

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-5 grid grid-cols-3 gap-2 sm:gap-3"
      >
        <StatTile label="Hoje" value={stats.today} icon={<CalendarCheck className="h-4 w-4" />} />
        <StatTile label="Próximas" value={stats.upcoming} icon={<Clock className="h-4 w-4" />} />
        <StatTile label="Realizadas" value={stats.done} icon={<CheckCircle2 className="h-4 w-4" />} />
      </motion.section>

      <div className="mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Chip active={filter === 'upcoming'} onClick={() => setFilter('upcoming')}>Próximas</Chip>
        <Chip active={filter === 'today'} onClick={() => setFilter('today')}>Hoje</Chip>
        <Chip active={filter === 'past'} onClick={() => setFilter('past')}>Passadas</Chip>
        <Chip active={filter === 'all'} onClick={() => setFilter('all')}>Todas</Chip>
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" padding="xl">
          <EmptyState
            icon={<CalendarX className="h-5 w-5" />}
            title="Nenhuma visita"
            description={
              filter === 'today' ? 'Nada agendado para hoje.' : 'Ainda sem visitas neste filtro.'
            }
            action={
              <Button onClick={() => setSheetOpen(true)} size="md">
                <Plus className="h-4 w-4" /> Agendar visita
              </Button>
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
          {filtered.map((a) => {
            const d = parseISO(a.date);
            const dateLabel = isToday(d)
              ? 'Hoje'
              : isTomorrow(d)
              ? 'Amanhã'
              : format(d, "EEE, dd 'de' MMM", { locale: ptBR });
            const s = STATUS_LABELS[a.status] ?? { label: a.status, variant: 'neutral' as BadgeVariant };
            return (
              <motion.li
                key={a.id}
                variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              >
                <Card variant="solid" padding="md">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-[12px] bg-[linear-gradient(135deg,#2a1f6b,#0f1830)] text-iris-hi">
                      <span className="text-[10px] leading-none text-fg-muted">{a.time.split(':')[0]}h</span>
                      <span className="text-sm font-bold">{a.time.split(':')[1]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-fg">{a.client_name}</p>
                        <Badge variant={s.variant} size="xs">{s.label}</Badge>
                      </div>
                      <p className="truncate text-xs text-fg-muted">
                        {dateLabel} · {a.stand_name || 'Sem stand'}
                      </p>
                      {a.product_name && (
                        <p className="mt-0.5 truncate text-xs text-fg-soft">{a.product_name}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {a.client_phone && (
                      <a
                        href={generateWhatsAppLink(a.client_phone, `Olá ${a.client_name}, confirmando sua visita às ${a.time}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-[10px] bg-ok/15 px-3 text-xs font-medium text-ok press"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    )}
                    {a.status === 'pendente' && (
                      <Button size="xs" variant="secondary" onClick={() => confirmVisit(a)}>
                        Confirmar
                      </Button>
                    )}
                    {a.status === 'confirmado' && (
                      <Button size="xs" variant="secondary" onClick={() => markDone(a)}>
                        <CheckCircle2 className="h-3.5 w-3.5" /> Realizada
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader title="Nova visita" description="Agendar uma visita ao stand." />
          <SheetBody>
            <div className="space-y-3">
              <Input label="Cliente *" value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Telefone" value={form.client_phone} onChange={(e) => setForm({ ...form, client_phone: e.target.value })} />
                <Input label="E-mail" value={form.client_email} onChange={(e) => setForm({ ...form, client_email: e.target.value })} />
              </div>
              <Select label="Stand" value={form.stand_id} onChange={(e) => setForm({ ...form, stand_id: e.target.value })}>
                <option value="">Selecione</option>
                {stands.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
              <Input label="Produto / unidade" value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Data *" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <Input label="Hora *" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <Textarea label="Observações" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={save} loading={saving}>Agendar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function StatTile({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <Card variant="solid" padding="md">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-iris/15 text-iris-hi">{icon}</span>
      </div>
      <p className="mt-2 font-display text-2xl text-fg"><NumberFlow value={value} /></p>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-fg-faint">{label}</p>
    </Card>
  );
}

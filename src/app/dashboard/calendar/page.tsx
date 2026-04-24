'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from 'lucide-react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetBody, SheetFooter } from '@/components/ui/sheet';
import { PageHeader } from '@/components/layout/page-header';
import { PageSkeleton } from '@/components/ui/skeleton';
import { useCalendarEvents } from '@/lib/hooks/use-calendar';
import { cn } from '@/lib/utils';

const TYPE_LABELS: Record<string, { label: string; color: string }> = {
  visita: { label: 'Visita', color: 'bg-iris' },
  reuniao: { label: 'Reunião', color: 'bg-cyanx' },
  plantao: { label: 'Plantão', color: 'bg-ok' },
  follow_up: { label: 'Follow-up', color: 'bg-warn' },
  outro: { label: 'Outro', color: 'bg-fg-muted' },
};

const EMPTY_FORM = {
  title: '',
  type: 'visita',
  date: '',
  time: '',
  duration: '60',
  description: '',
};

export default function CalendarPage() {
  const { events, loading, create } = useCalendarEvents();
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date>(new Date());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of events) {
      const key = format(parseISO(e.start_time), 'yyyy-MM-dd');
      map[key] = (map[key] || 0) + 1;
    }
    return map;
  }, [events]);

  const selectedEvents = useMemo(
    () => events
      .filter((e) => isSameDay(parseISO(e.start_time), selected))
      .sort((a, b) => a.start_time.localeCompare(b.start_time)),
    [events, selected],
  );

  const save = async () => {
    if (!form.title.trim() || !form.date || !form.time) {
      toast.error('Preencha título, data e hora.');
      return;
    }
    setSaving(true);
    const start = new Date(`${form.date}T${form.time}:00`);
    const end = new Date(start.getTime() + Number(form.duration) * 60_000);
    const meta = TYPE_LABELS[form.type] || TYPE_LABELS.outro;
    const { error } = await create({
      title: form.title.trim(),
      type: form.type,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      description: form.description.trim() || null,
      color: meta.color,
    });
    setSaving(false);
    if (error) toast.error('Erro ao criar evento.');
    else {
      toast.success('Evento criado.');
      setSheetOpen(false);
      setForm(EMPTY_FORM);
    }
  };

  if (loading) return <PageSkeleton />;

  return (
    <div>
      <PageHeader
        eyebrow="Agenda"
        title="Calendário"
        actions={
          <Button size="sm" onClick={() => { setForm({ ...EMPTY_FORM, date: format(selected, 'yyyy-MM-dd') }); setSheetOpen(true); }}>
            <Plus className="h-4 w-4" /> Evento
          </Button>
        }
      />

      <Card variant="solid" padding="md" className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <button onClick={() => setCursor(subMonths(cursor, 1))} className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.04] text-fg-soft press">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-sm font-semibold capitalize text-fg">
            {format(cursor, "MMMM 'de' yyyy", { locale: ptBR })}
          </h2>
          <button onClick={() => setCursor(addMonths(cursor, 1))} className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.04] text-fg-soft press">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-fg-faint">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const key = format(d, 'yyyy-MM-dd');
            const count = eventsByDay[key] || 0;
            const outside = !isSameMonth(d, cursor);
            const isSelected = isSameDay(d, selected);
            const isCurrent = isToday(d);
            return (
              <button
                key={key}
                onClick={() => setSelected(d)}
                className={cn(
                  'relative aspect-square flex flex-col items-center justify-center rounded-[10px] text-sm font-medium transition-all press',
                  outside && 'text-fg-faint opacity-50',
                  !outside && !isSelected && !isCurrent && 'text-fg-soft hover:bg-white/[0.04]',
                  isCurrent && !isSelected && 'text-iris-hi bg-iris/10',
                  isSelected && 'bg-[linear-gradient(135deg,#9d8cff,#5a46e0)] text-white shadow-[0_6px_16px_rgba(129,110,255,0.45)]',
                )}
              >
                {format(d, 'd')}
                {count > 0 && (
                  <span className={cn(
                    'absolute bottom-1 h-1 w-1 rounded-full',
                    isSelected ? 'bg-white' : 'bg-iris-hi',
                  )} />
                )}
              </button>
            );
          })}
        </div>
      </Card>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold capitalize text-fg">
          {format(selected, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </h2>
        <span className="text-xs text-fg-muted">{selectedEvents.length} evento(s)</span>
      </div>

      {selectedEvents.length === 0 ? (
        <Card variant="glass" padding="xl">
          <EmptyState icon={<CalendarDays className="h-5 w-5" />} title="Dia livre" description="Sem compromissos neste dia." />
        </Card>
      ) : (
        <ul className="space-y-2">
          {selectedEvents.map((e) => {
            const t = TYPE_LABELS[e.type] || TYPE_LABELS.outro;
            return (
              <li key={e.id}>
                <Card variant="solid" padding="md" className="flex items-start gap-3">
                  <div className={cn('h-12 w-1 shrink-0 rounded-full', t.color)} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{e.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-fg-muted">
                      <Clock className="h-3 w-3" />
                      {format(parseISO(e.start_time), 'HH:mm')} – {format(parseISO(e.end_time), 'HH:mm')}
                      <span className="ml-1 text-fg-faint">· {t.label}</span>
                    </p>
                    {e.description && <p className="mt-1 text-xs text-fg-soft">{e.description}</p>}
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader title="Novo evento" />
          <SheetBody>
            <div className="space-y-3">
              <Input label="Título *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <Select label="Tipo" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {Object.entries(TYPE_LABELS).map(([v, m]) => <option key={v} value={v}>{m.label}</option>)}
              </Select>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Data *" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <Input label="Hora *" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              </div>
              <Select label="Duração" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                <option value="30">30 min</option>
                <option value="60">1 hora</option>
                <option value="90">1h 30min</option>
                <option value="120">2 horas</option>
              </Select>
              <Textarea label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
          </SheetBody>
          <SheetFooter>
            <Button variant="ghost" onClick={() => setSheetOpen(false)}>Cancelar</Button>
            <Button onClick={save} loading={saving}>Criar</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

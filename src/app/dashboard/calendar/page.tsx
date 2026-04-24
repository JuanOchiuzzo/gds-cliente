'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useCalendarEvents } from '@/lib/hooks/use-calendar';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn, toDateOrNull } from '@/lib/utils';
import { staggerParent, slideUp } from '@/lib/motion';

const TYPE_VARIANT: Record<string, BadgeProps['variant']> = {
  visita: 'info',
  reuniao: 'aurora',
  plantao: 'solar',
  follow_up: 'success',
  outro: 'neutral',
};

export default function CalendarPage() {
  const { events, loading, create } = useCalendarEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'visita',
    start: '',
    end: '',
  });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) =>
    events.filter((e) => {
      const startTime = toDateOrNull(e.start_time);
      return startTime ? isSameDay(startTime, date) : false;
    });

  const handleCreate = async () => {
    if (!form.title || !form.start || !form.end) {
      toast.error('Preencha todos os campos');
      return;
    }

    const startTime = toDateOrNull(form.start);
    const endTime = toDateOrNull(form.end);

    if (!startTime || !endTime) {
      toast.error('Data ou horário inválido');
      return;
    }

    if (endTime <= startTime) {
      toast.error('O horário final precisa ser depois do inicial');
      return;
    }

    await create({
      title: form.title,
      type: form.type,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      color: '#5BF1C6',
    });
    toast.success('Evento criado');
    setShowNew(false);
    setForm({ title: '', type: 'visita', start: '', end: '' });
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
      variants={staggerParent(0.05)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={slideUp}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Calendário</h1>
          <p className="mt-1 text-sm text-text-soft capitalize">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate((d) => addDays(d, -7))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Hoje
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate((d) => addDays(d, 7))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="solar" size="md" onClick={() => setShowNew(true)}>
            <Plus className="w-4 h-4" /> Evento
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          return (
            <Surface
              key={day.toISOString()}
              variant="flat"
              padding="sm"
              className={cn(
                'min-h-[180px]',
                isToday && 'border-solar/40 ring-1 ring-solar/20'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] text-text-faint uppercase tracking-wider">
                    {format(day, 'EEE', { locale: ptBR })}
                  </p>
                  <p
                    className={cn(
                      'text-xl font-medium mt-0.5',
                      isToday ? 'text-solar' : 'text-text'
                    )}
                  >
                    {format(day, 'dd')}
                  </p>
                </div>
                {dayEvents.length > 0 && (
                  <Badge variant="neutral" size="xs">
                    {dayEvents.length}
                  </Badge>
                )}
              </div>
              <div className="space-y-1.5">
                {dayEvents.map((event) => {
                  const startTime = toDateOrNull(event.start_time);
                  const endTime = toDateOrNull(event.end_time);

                  return (
                    <div
                      key={event.id}
                      className="p-2 rounded-sm border border-border bg-surface-1 hover:border-border-glow transition-colors"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            event.type === 'visita' && 'bg-info',
                            event.type === 'reuniao' && 'bg-aurora-1',
                            event.type === 'plantao' && 'bg-solar',
                            event.type === 'follow_up' && 'bg-success'
                          )}
                        />
                        <p className="text-xs font-medium text-text truncate">{event.title}</p>
                      </div>
                      <p className="text-[10px] text-text-faint font-mono">
                        {startTime ? format(startTime, 'HH:mm') : '--:--'} –{' '}
                        {endTime ? format(endTime, 'HH:mm') : '--:--'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Surface>
          );
        })}
      </div>

      {events.length === 0 && (
        <Surface variant="elevated" padding="xl">
          <EmptyState
            icon={<CalendarDays className="w-6 h-6" />}
            title="Nenhum evento"
            description="Crie seu primeiro evento no calendário."
            action={
              <Button variant="solar" onClick={() => setShowNew(true)}>
                <Plus className="w-4 h-4" /> Criar evento
              </Button>
            }
          />
        </Surface>
      )}

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Novo evento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              label="Título"
              placeholder="Título do evento"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Select
              label="Tipo"
              value={form.type}
              onChange={(v) => setForm({ ...form, type: v })}
              options={[
                { value: 'visita', label: 'Visita' },
                { value: 'reuniao', label: 'Reunião' },
                { value: 'plantao', label: 'Plantão' },
                { value: 'follow_up', label: 'Follow-up' },
              ]}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Início"
                type="datetime-local"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              />
              <Input
                label="Fim"
                type="datetime-local"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowNew(false)}>
                Cancelar
              </Button>
              <Button variant="solar" className="flex-1" onClick={handleCreate}>
                Criar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, CalendarDays } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useCalendarEvents } from '@/lib/hooks/use-calendar';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };
const typeVariant: Record<string, 'cyan' | 'violet' | 'emerald' | 'amber'> = {
  visita: 'cyan', reuniao: 'violet', plantao: 'amber', follow_up: 'emerald', outro: 'cyan',
};

export default function CalendarPage() {
  const { events, loading, create } = useCalendarEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('visita');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) =>
    events.filter((e) => isSameDay(new Date(e.start_time), date));

  const handleCreate = async () => {
    if (!newTitle || !newStart || !newEnd) { toast.error('Preencha todos os campos'); return; }
    await create({ title: newTitle, type: newType, start_time: new Date(newStart).toISOString(), end_time: new Date(newEnd).toISOString(), color: '#2563eb' });
    toast.success('Evento criado!');
    setShowNew(false);
    setNewTitle(''); setNewStart(''); setNewEnd('');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--accent)]/30 border-t-[var(--accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--text)]">Calendário</h1>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" onClick={() => setCurrentDate((d) => addDays(d, -7))}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="secondary" size="sm" onClick={() => setCurrentDate(new Date())}>Hoje</Button>
          <Button variant="secondary" size="icon" onClick={() => setCurrentDate((d) => addDays(d, 7))}><ChevronRight className="w-4 h-4" /></Button>
          <Button variant="neon" size="sm" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> Evento</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          return (
            <GlassCard key={day.toISOString()} hover={false} className={`!p-3 min-h-[160px] ${isToday ? '!border-blue-500/30 dark:!border-cyan-500/30' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)] uppercase">{format(day, 'EEE', { locale: ptBR })}</p>
                  <p className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-[var(--text-secondary)]'}`}>{format(day, 'dd')}</p>
                </div>
                {dayEvents.length > 0 && <span className="text-[10px] text-[var(--text-faint)] bg-[var(--bg-card)] px-1.5 py-0.5 rounded">{dayEvents.length}</span>}
              </div>
              <div className="space-y-1.5">
                {dayEvents.map((event) => (
                  <div key={event.id} className="p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]">
                    <p className="text-xs font-medium text-[var(--text)] truncate">{event.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                      {format(new Date(event.start_time), 'HH:mm')} - {format(new Date(event.end_time), 'HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {events.length === 0 && (
        <GlassCard hover={false} className="!p-8 text-center">
          <CalendarDays className="w-10 h-10 mx-auto text-[var(--text-faint)] mb-3" />
          <p className="text-sm text-[var(--text-muted)]">Nenhum evento no calendário</p>
          <Button variant="neon" size="sm" className="mt-4" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> Criar Evento</Button>
        </GlassCard>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Novo Evento" size="md">
        <div className="space-y-4">
          <div className="space-y-1.5"><label className="text-xs text-[var(--text-muted)] font-medium">Título *</label>
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none" placeholder="Título do evento" /></div>
          <Select label="Tipo" value={newType} onChange={setNewType} options={[{value:'visita',label:'Visita'},{value:'reuniao',label:'Reunião'},{value:'plantao',label:'Plantão'},{value:'follow_up',label:'Follow-up'}]} />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs text-[var(--text-muted)] font-medium">Início *</label>
              <input type="datetime-local" value={newStart} onChange={(e) => setNewStart(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--text-muted)] font-medium">Fim *</label>
              <input type="datetime-local" value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="w-full px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl text-sm text-[var(--text)] outline-none" /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleCreate}>Criar</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

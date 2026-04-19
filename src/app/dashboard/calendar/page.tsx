'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, User } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { calendarEvents } from '@/lib/mock-data';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { CalendarEvent } from '@/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const typeVariant: Record<string, 'cyan' | 'violet' | 'emerald' | 'amber'> = {
  visita: 'cyan', reuniao: 'violet', plantao: 'amber', follow_up: 'emerald', outro: 'cyan',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 19));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showNewEvent, setShowNewEvent] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) =>
    calendarEvents.filter((e) => isSameDay(new Date(e.start), date));

  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }} className="space-y-6">
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sf-text-primary)]">Calendário</h1>
          <p className="text-sm text-[var(--sf-text-tertiary)] mt-1">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" onClick={() => setCurrentDate((d) => addDays(d, -7))}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setCurrentDate(new Date(2026, 3, 19))}>
            Hoje
          </Button>
          <Button variant="secondary" size="icon" onClick={() => setCurrentDate((d) => addDays(d, 7))}>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="neon" size="sm" onClick={() => setShowNewEvent(true)}>
            <Plus className="w-4 h-4" /> Evento
          </Button>
        </div>
      </motion.div>

      {/* Week View */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const events = getEventsForDay(day);
          const isToday = isSameDay(day, new Date(2026, 3, 19));
          return (
            <GlassCard
              key={day.toISOString()}
              hover={false}
              className={`!p-3 min-h-[180px] ${isToday ? '!border-blue-500/20 dark:border-cyan-500/30 !shadow-neon-cyan' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)] uppercase">
                    {format(day, 'EEE', { locale: ptBR })}
                  </p>
                  <p className={`text-lg font-bold ${isToday ? 'text-blue-600 dark:text-cyan-400' : 'text-[var(--sf-text-secondary)]'}`}>
                    {format(day, 'dd')}
                  </p>
                </div>
                {events.length > 0 && (
                  <span className="text-[10px] text-[var(--sf-text-muted)] bg-[var(--sf-accent-light)] px-1.5 py-0.5 rounded">
                    {events.length}
                  </span>
                )}
              </div>
              <div className="space-y-1.5">
                {events.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="w-full text-left p-2 rounded-xl border transition-all hover:bg-[var(--sf-accent-light)]"
                    style={{ borderColor: `${event.color}30`, backgroundColor: `${event.color}08` }}
                  >
                    <p className="text-xs font-medium text-[var(--sf-text-primary)] truncate">{event.title}</p>
                    <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-0.5">
                      {format(new Date(event.start), 'HH:mm')} - {format(new Date(event.end), 'HH:mm')}
                    </p>
                  </button>
                ))}
              </div>
            </GlassCard>
          );
        })}
      </motion.div>

      {/* Upcoming Events */}
      <motion.div variants={fadeUp}>
        <GlassCard hover={false}>
          <h3 className="text-sm font-semibold text-[var(--sf-text-secondary)] mb-4">Próximos Eventos</h3>
          <div className="space-y-3">
            {calendarEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="flex items-center gap-3 p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl cursor-pointer hover:bg-[var(--sf-surface)] transition-colors"
              >
                <div className="w-1 h-10 rounded-full" style={{ backgroundColor: event.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--sf-text-primary)]">{event.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-[var(--sf-text-tertiary)]">
                      <Clock className="w-3 h-3" />
                      {format(new Date(event.start), 'dd/MM HH:mm')}
                    </span>
                    {event.stand_name && (
                      <span className="flex items-center gap-1 text-xs text-[var(--sf-text-tertiary)]">
                        <MapPin className="w-3 h-3" />
                        {event.stand_name.replace('Stand ', '')}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[var(--sf-text-tertiary)]">
                      <User className="w-3 h-3" />
                      {event.agent_name}
                    </span>
                  </div>
                </div>
                <Badge variant={typeVariant[event.type]}>{event.type}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>

      {/* Event Detail Modal */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} title={selectedEvent?.title || ''} size="sm">
        {selectedEvent && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--sf-text-secondary)]">{selectedEvent.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--sf-text-tertiary)]" />
                <span className="text-[var(--sf-text-secondary)]">
                  {format(new Date(selectedEvent.start), "dd/MM/yyyy 'às' HH:mm")} — {format(new Date(selectedEvent.end), 'HH:mm')}
                </span>
              </div>
              {selectedEvent.stand_name && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--sf-text-tertiary)]" />
                  <span className="text-[var(--sf-text-secondary)]">{selectedEvent.stand_name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--sf-text-tertiary)]" />
                <span className="text-[var(--sf-text-secondary)]">{selectedEvent.agent_name}</span>
              </div>
            </div>
            <Badge variant={typeVariant[selectedEvent.type]}>{selectedEvent.type}</Badge>
          </div>
        )}
      </Modal>

      {/* New Event Modal */}
      <Modal open={showNewEvent} onClose={() => setShowNewEvent(false)} title="Novo Evento" size="md">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-[var(--sf-text-secondary)]">Título</label>
            <input className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" placeholder="Título do evento" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm text-[var(--sf-text-secondary)]">Início</label>
              <input type="datetime-local" className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm text-[var(--sf-text-secondary)]">Fim</label>
              <input type="datetime-local" className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-[var(--sf-text-secondary)]">Tipo</label>
            <select className="w-full px-4 py-2.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-cyan-500/20">
              <option value="visita">Visita</option>
              <option value="reuniao">Reunião</option>
              <option value="plantao">Plantão</option>
              <option value="follow_up">Follow-up</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="secondary" onClick={() => setShowNewEvent(false)}>Cancelar</Button>
            <Button variant="neon" onClick={() => setShowNewEvent(false)}>Criar Evento</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

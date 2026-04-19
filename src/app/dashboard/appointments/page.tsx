'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus, Calendar, Clock, MapPin, Share2, CheckCircle2,
  XCircle, AlertCircle, Ticket, ExternalLink, ChevronRight, MessageCircle,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { appointments, stands } from '@/lib/mock-data';
import {
  getAppointmentStatusLabel, getVisitResultLabel,
  generateWhatsAppLink, generateVoucherMessage,
} from '@/lib/utils';
import type { Appointment } from '@/types';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusIcon: Record<string, React.ReactNode> = {
  pendente: <AlertCircle className="w-4 h-4 text-amber-500" />,
  confirmado: <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-cyan-400" />,
  realizado: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  cancelado: <XCircle className="w-4 h-4 text-red-500" />,
  nao_compareceu: <XCircle className="w-4 h-4 text-red-400" />,
};
const statusVariant: Record<string, 'amber' | 'cyan' | 'emerald' | 'red' | 'zinc'> = {
  pendente: 'amber', confirmado: 'cyan', realizado: 'emerald', cancelado: 'red', nao_compareceu: 'red',
};
const resultVariant: Record<string, 'emerald' | 'violet' | 'cyan' | 'red' | 'amber'> = {
  interessado: 'cyan', proposta_enviada: 'violet', fechou: 'emerald', desistiu: 'red', reagendar: 'amber',
};

export default function AppointmentsPage() {
  const [selected, setSelected] = useState<Appointment | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showResult, setShowResult] = useState<Appointment | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? appointments : appointments.filter((a) => a.status === filter);
  const upcoming = appointments.filter((a) => a.status === 'pendente' || a.status === 'confirmado');
  const past = appointments.filter((a) => a.status === 'realizado' || a.status === 'cancelado' || a.status === 'nao_compareceu');

  const shareVoucher = (apt: Appointment) => {
    const msg = generateVoucherMessage(apt);
    const url = generateWhatsAppLink(apt.client_phone, msg);
    window.open(url, '_blank');
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Agendamentos</h1>
          <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">{appointments.length} agendamentos</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Agendar</span>
        </Button>
      </motion.div>

      {/* Filter chips */}
      <motion.div variants={fadeUp} className="flex gap-2 overflow-x-auto no-scrollbar">
        {['all', 'pendente', 'confirmado', 'realizado', 'nao_compareceu'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border whitespace-nowrap transition-all ${
              filter === f
                ? 'bg-[var(--sf-accent-light)] text-[var(--sf-accent)] border-[var(--sf-accent)]/20'
                : 'bg-[var(--sf-surface)] text-[var(--sf-text-tertiary)] border-[var(--sf-border)]'
            }`}
          >
            {f === 'all' ? 'Todos' : getAppointmentStatusLabel(f)}
          </button>
        ))}
      </motion.div>

      {/* Appointment list */}
      <motion.div variants={stagger} className="space-y-2">
        {filtered.map((apt) => (
          <motion.div key={apt.id} variants={fadeUp}>
            <motion.div
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(apt)}
              className="p-4 bg-[var(--sf-surface)] backdrop-blur-[var(--sf-blur)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {statusIcon[apt.status]}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--sf-text-primary)] truncate">{apt.client_name}</h3>
                    <Badge variant={statusVariant[apt.status]} className="!text-[9px]">{getAppointmentStatusLabel(apt.status)}</Badge>
                  </div>
                  <p className="text-xs text-[var(--sf-text-secondary)] mt-0.5">{apt.product_name}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-[10px] text-[var(--sf-text-tertiary)]">
                      <Calendar className="w-3 h-3" /> {apt.date}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--sf-text-tertiary)]">
                      <Clock className="w-3 h-3" /> {apt.time}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-[var(--sf-text-tertiary)]">
                      <Ticket className="w-3 h-3" /> {apt.voucher_code}
                    </span>
                  </div>
                  {apt.visit_result && (
                    <div className="mt-1.5">
                      <Badge variant={resultVariant[apt.visit_result]} className="!text-[9px]">
                        {getVisitResultLabel(apt.visit_result)}
                      </Badge>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--sf-text-muted)] flex-shrink-0 mt-1" />
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Appointment Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Detalhes do Agendamento" size="lg">
        {selected && (
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              {statusIcon[selected.status]}
              <Badge variant={statusVariant[selected.status]}>{getAppointmentStatusLabel(selected.status)}</Badge>
              {selected.visit_result && (
                <Badge variant={resultVariant[selected.visit_result]}>{getVisitResultLabel(selected.visit_result)}</Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Cliente', value: selected.client_name },
                { label: 'Produto', value: selected.product_name },
                { label: 'Data', value: `${selected.date} às ${selected.time}` },
                { label: 'Stand', value: selected.stand_name },
              ].map((item) => (
                <div key={item.label} className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                  <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{item.value}</p>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)]">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Voucher card */}
            <div className="p-4 bg-gradient-to-br from-blue-500/5 to-violet-500/5 dark:from-cyan-500/5 dark:to-violet-500/5 border border-blue-500/10 dark:border-cyan-500/10 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-[var(--sf-text-tertiary)] uppercase tracking-wider">Voucher</p>
                  <p className="text-lg font-bold text-[var(--sf-text-primary)] font-mono mt-0.5">{selected.voucher_code}</p>
                </div>
                <Ticket className="w-8 h-8 text-blue-500/30 dark:text-cyan-400/30" />
              </div>
              <p className="text-[10px] text-[var(--sf-text-tertiary)] mt-2">
                {selected.voucher_shared ? '✅ Voucher compartilhado com o cliente' : '⏳ Voucher ainda não compartilhado'}
              </p>
            </div>

            {/* Address with Maps link */}
            <div className="flex items-center gap-2 p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
              <MapPin className="w-4 h-4 text-[var(--sf-text-tertiary)] flex-shrink-0" />
              <p className="text-xs text-[var(--sf-text-secondary)] flex-1">{selected.stand_address}</p>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(selected.stand_address)}`} target="_blank" rel="noopener" className="p-1.5 rounded-lg text-blue-500 dark:text-cyan-400">
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Visit notes */}
            {selected.visit_notes && (
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-xs font-medium text-[var(--sf-text-tertiary)] mb-1">Resultado da Visita</p>
                <p className="text-sm text-[var(--sf-text-secondary)]">{selected.visit_notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => shareVoucher(selected)}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-sm font-medium text-green-600 dark:text-green-300 active:bg-green-500/20"
              >
                <Share2 className="w-4 h-4" /> Enviar Voucher
              </button>
              {(selected.status === 'confirmado' || selected.status === 'pendente') && (
                <button
                  onClick={() => { setSelected(null); setShowResult(selected); }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/10 dark:bg-cyan-500/10 border border-blue-500/20 dark:border-cyan-500/20 rounded-2xl text-sm font-medium text-blue-600 dark:text-cyan-300 active:bg-blue-500/20"
                >
                  <CheckCircle2 className="w-4 h-4" /> Registrar Resultado
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Register Visit Result Modal */}
      <Modal open={!!showResult} onClose={() => setShowResult(null)} title="Resultado da Visita" size="sm">
        {showResult && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--sf-text-secondary)]">Registre o resultado da visita de <span className="font-semibold">{showResult.client_name}</span></p>
            <div className="space-y-2">
              {['interessado', 'proposta_enviada', 'fechou', 'desistiu', 'reagendar'].map((r) => (
                <button
                  key={r}
                  className="w-full text-left px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] active:bg-[var(--sf-accent-light)] transition-colors"
                  onClick={() => setShowResult(null)}
                >
                  {getVisitResultLabel(r)}
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Observações</label>
              <textarea className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none resize-none h-20" placeholder="Como foi a visita?" />
            </div>
          </div>
        )}
      </Modal>

      {/* New Appointment Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Novo Agendamento" size="md">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Produto / Empreendimento</label>
            <select className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none">
              <option>Residencial Parque das Flores</option>
              <option>Edifício Aurora</option>
              <option>Alphaville Premium</option>
            </select>
          </div>
          {[
            { label: 'Nome do cliente', placeholder: 'Nome completo' },
            { label: 'Telefone', placeholder: '(11) 99999-0000' },
            { label: 'Email', placeholder: 'email@exemplo.com' },
          ].map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">{f.label}</label>
              <input className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder={f.placeholder} />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Data</label>
              <input type="date" className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Horário</label>
              <input type="time" className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={() => setShowNew(false)}>Criar Agendamento</Button>
          </div>
          <p className="text-[10px] text-[var(--sf-text-muted)] text-center">Um voucher será gerado automaticamente. Você poderá compartilhar com o cliente via WhatsApp.</p>
        </div>
      </Modal>

      {/* FAB */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNew(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-lg border border-white/20"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, MapPin, Share2, ClipboardCheck, CalendarCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { useAppointments, type AppointmentRow } from '@/lib/hooks/use-appointments';
import { useStands } from '@/lib/hooks/use-stands';
import { generateWhatsAppLink } from '@/lib/utils';
import { Select } from '@/components/ui/select';
import { toast } from 'sonner';

const stagger = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const statusVariant: Record<string, 'cyan' | 'emerald' | 'amber' | 'red' | 'zinc'> = {
  pendente: 'amber', confirmado: 'emerald', realizado: 'cyan', nao_compareceu: 'red', cancelado: 'zinc',
};
const statusLabel: Record<string, string> = {
  pendente: 'Pendente', confirmado: 'Confirmado', realizado: 'Realizado', nao_compareceu: 'Não compareceu', cancelado: 'Cancelado',
};

export default function AppointmentsPage() {
  const { appointments, loading, create, shareVoucher, recordVisit } = useAppointments();
  const { stands } = useStands();
  const [selected, setSelected] = useState<AppointmentRow | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [newClient, setNewClient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newStandId, setNewStandId] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const [resultType, setResultType] = useState('interessado');
  const [resultNotes, setResultNotes] = useState('');

  const handleCreate = async () => {
    if (!newClient || !newDate || !newTime) { toast.error('Preencha cliente, data e hora'); return; }
    await create({
      client_name: newClient, client_phone: newPhone || null,
      product_name: newProduct || null, stand_id: newStandId || null,
      date: newDate, time: newTime,
    });
    toast.success('Agendamento criado!');
    setShowNew(false);
    setNewClient(''); setNewPhone(''); setNewProduct(''); setNewDate(''); setNewTime('');
  };

  const handleShare = async (apt: AppointmentRow) => {
    const stand = stands.find((s) => s.id === apt.stand_id);
    const msg = `Olá ${apt.client_name.split(' ')[0]}! Sua visita está confirmada:\n\n📅 ${apt.date} às ${apt.time}\n📍 ${stand?.name || ''} — ${stand?.address || ''}\n🎫 Voucher: ${apt.voucher_code}\n\nApresente o voucher à recepcionista ao chegar.`;
    const link = generateWhatsAppLink(apt.client_phone || '', msg);
    window.open(link, '_blank');
    await shareVoucher(apt.id);
    toast.success('Voucher compartilhado!');
  };

  const handleRecordVisit = async () => {
    if (!selected) return;
    await recordVisit(selected.id, resultType, resultNotes);
    toast.success('Resultado registrado!');
    setShowResult(false);
    setSelected(null);
    setResultNotes('');
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[var(--sf-accent)]/30 border-t-[var(--sf-accent)] rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-4">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-[var(--sf-text-primary)]">Agendamentos</h1>
          <p className="text-xs text-[var(--sf-text-tertiary)] mt-0.5">{appointments.length} agendamentos</p>
        </div>
        <Button variant="neon" size="sm" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" /> Agendar
        </Button>
      </motion.div>

      {appointments.length === 0 ? (
        <GlassCard hover={false} className="!p-8 text-center">
          <CalendarCheck className="w-10 h-10 mx-auto text-[var(--sf-text-muted)] mb-3" />
          <p className="text-sm text-[var(--sf-text-tertiary)]">Nenhum agendamento</p>
          <Button variant="neon" size="sm" className="mt-4" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" /> Criar Agendamento</Button>
        </GlassCard>
      ) : (
        <motion.div variants={stagger} className="space-y-2">
          {appointments.map((apt) => (
            <motion.div key={apt.id} variants={fadeUp}>
              <motion.div whileTap={{ scale: 0.98 }} onClick={() => setSelected(apt)}
                className="p-3.5 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl active:bg-[var(--sf-surface-hover)] cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-12 rounded-full bg-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{apt.client_name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="flex items-center gap-1 text-[11px] text-[var(--sf-text-tertiary)]">
                        <Clock className="w-3 h-3" /> {apt.date} {apt.time}
                      </span>
                      {apt.product_name && <span className="text-[11px] text-[var(--sf-text-tertiary)]">{apt.product_name}</span>}
                    </div>
                    <p className="text-[10px] text-[var(--sf-text-muted)] mt-0.5">Voucher: {apt.voucher_code}</p>
                  </div>
                  <Badge variant={statusVariant[apt.status]} className="!text-[9px]">{statusLabel[apt.status]}</Badge>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Detail Modal */}
      <Modal open={!!selected && !showResult} onClose={() => setSelected(null)} title={selected?.client_name || ''} size="md">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{selected.date}</p>
                <p className="text-[10px] text-[var(--sf-text-tertiary)]">Data</p>
              </div>
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-sm font-semibold text-[var(--sf-text-primary)]">{selected.time}</p>
                <p className="text-[10px] text-[var(--sf-text-tertiary)]">Horário</p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-cyan-500/10 border border-blue-200 dark:border-cyan-500/20 rounded-2xl text-center">
              <p className="text-xs text-[var(--sf-text-tertiary)]">Voucher</p>
              <p className="text-xl font-bold text-blue-700 dark:text-cyan-300 tracking-wider">{selected.voucher_code}</p>
            </div>
            {selected.product_name && <p className="text-sm text-[var(--sf-text-secondary)]">Produto: {selected.product_name}</p>}
            <Badge variant={statusVariant[selected.status]}>{statusLabel[selected.status]}</Badge>

            {selected.visit_result && (
              <div className="p-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl">
                <p className="text-xs font-semibold text-[var(--sf-text-primary)]">Resultado: {selected.visit_result}</p>
                {selected.visit_notes && <p className="text-xs text-[var(--sf-text-tertiary)] mt-1">{selected.visit_notes}</p>}
              </div>
            )}

            <div className="flex gap-2">
              {selected.client_phone && !selected.voucher_shared && (
                <Button variant="primary" size="sm" className="flex-1" onClick={() => handleShare(selected)}>
                  <Share2 className="w-4 h-4" /> Compartilhar Voucher
                </Button>
              )}
              {selected.status !== 'realizado' && selected.status !== 'cancelado' && (
                <Button variant="secondary" size="sm" className="flex-1" onClick={() => setShowResult(true)}>
                  <ClipboardCheck className="w-4 h-4" /> Registrar Resultado
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Record Visit Result */}
      <Modal open={showResult} onClose={() => setShowResult(false)} title="Resultado da Visita" size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: 'interessado', label: '👍 Interessado' },
              { key: 'proposta_enviada', label: '📄 Proposta Enviada' },
              { key: 'fechou', label: '🎉 Fechou!' },
              { key: 'reagendar', label: '📅 Reagendar' },
              { key: 'desistiu', label: '👎 Desistiu' },
              { key: 'nao_compareceu', label: '❌ Não Compareceu' },
            ].map((r) => (
              <button key={r.key} onClick={() => setResultType(r.key)}
                className={`p-3 rounded-2xl border text-xs font-medium transition-all ${
                  resultType === r.key ? 'bg-blue-50 dark:bg-cyan-500/10 border-blue-300 dark:border-cyan-500/30' : 'bg-[var(--sf-surface)] border-[var(--sf-border)]'
                } text-[var(--sf-text-secondary)]`}>
                {r.label}
              </button>
            ))}
          </div>
          <textarea rows={3} value={resultNotes} onChange={(e) => setResultNotes(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none resize-none" placeholder="Observações da visita..." />
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowResult(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleRecordVisit}>Salvar</Button>
          </div>
        </div>
      </Modal>

      {/* New Appointment */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Novo Agendamento" size="md">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Cliente *</label>
              <input value={newClient} onChange={(e) => setNewClient(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder="Nome do cliente" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Telefone</label>
              <input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder="(11) 99999-0000" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Produto</label>
              <input value={newProduct} onChange={(e) => setNewProduct(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" placeholder="Residencial X" /></div>
            <Select label="Stand" value={newStandId} onChange={setNewStandId} placeholder="Selecionar..." options={stands.filter((s) => s.status === 'ativo').map((s) => ({ value: s.id, label: s.name }))} />
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Data *</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" /></div>
            <div className="space-y-1.5"><label className="text-xs text-[var(--sf-text-tertiary)] font-medium">Horário *</label>
              <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="w-full px-4 py-3 bg-[var(--sf-surface)] border border-[var(--sf-border)] rounded-2xl text-sm text-[var(--sf-text-primary)] outline-none" /></div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowNew(false)}>Cancelar</Button>
            <Button variant="neon" className="flex-1" onClick={handleCreate}>Criar Agendamento</Button>
          </div>
        </div>
      </Modal>

      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNew(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 dark:from-cyan-500 dark:to-violet-500 flex items-center justify-center shadow-lg border border-white/20">
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </motion.div>
  );
}

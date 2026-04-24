'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, Share2, ClipboardCheck, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Surface } from '@/components/ui/surface';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Input, Textarea } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useAppointments, type AppointmentRow } from '@/lib/hooks/use-appointments';
import { useStands } from '@/lib/hooks/use-stands';
import { generateWhatsAppLink, getFirstName, cn } from '@/lib/utils';
import { staggerParent, slideUp } from '@/lib/motion';

const STATUS_VARIANT: Record<string, BadgeProps['variant']> = {
  pendente: 'warning',
  confirmado: 'success',
  realizado: 'info',
  nao_compareceu: 'danger',
  cancelado: 'neutral',
};
const STATUS_LABEL: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  nao_compareceu: 'Não compareceu',
  cancelado: 'Cancelado',
};

const RESULTS = [
  { key: 'interessado', label: '👍 Interessado' },
  { key: 'proposta_enviada', label: '📄 Proposta' },
  { key: 'fechou', label: '🎉 Fechou!' },
  { key: 'reagendar', label: '📅 Reagendar' },
  { key: 'desistiu', label: '👎 Desistiu' },
  { key: 'nao_compareceu', label: '❌ Não compareceu' },
];

export default function AppointmentsPage() {
  const { appointments, loading, create, shareVoucher, recordVisit } = useAppointments();
  const { stands } = useStands();
  const [selected, setSelected] = useState<AppointmentRow | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const [form, setForm] = useState({
    client: '',
    phone: '',
    product: '',
    stand_id: '',
    date: '',
    time: '',
  });

  const [result, setResult] = useState({ type: 'interessado', notes: '' });

  const handleCreate = async () => {
    if (!form.client || !form.date || !form.time) {
      toast.error('Preencha cliente, data e hora');
      return;
    }
    await create({
      client_name: form.client,
      client_phone: form.phone || null,
      product_name: form.product || null,
      stand_id: form.stand_id || null,
      date: form.date,
      time: form.time,
    });
    toast.success('Agendamento criado');
    setShowNew(false);
    setForm({ client: '', phone: '', product: '', stand_id: '', date: '', time: '' });
  };

  const handleShare = async (apt: AppointmentRow) => {
    const stand = stands.find((s) => s.id === apt.stand_id);
    const msg = `Olá ${getFirstName(apt.client_name)}! Sua visita está confirmada:\n\n📅 ${apt.date} às ${apt.time}\n📍 ${stand?.name || ''} — ${stand?.address || ''}\n🎫 Voucher: ${apt.voucher_code}\n\nApresente o voucher à recepcionista ao chegar.`;
    const link = generateWhatsAppLink(apt.client_phone || '', msg);
    window.open(link, '_blank');
    await shareVoucher(apt.id);
    toast.success('Voucher compartilhado');
  };

  const handleRecordVisit = async () => {
    if (!selected) return;
    await recordVisit(selected.id, result.type, result.notes);
    toast.success('Resultado registrado');
    setShowResult(false);
    setSelected(null);
    setResult({ type: 'interessado', notes: '' });
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
      variants={staggerParent(0.04)}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={slideUp} className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl tracking-tight">Agendamentos</h1>
          <p className="mt-1 text-sm text-text-soft">{appointments.length} agendamentos</p>
        </div>
        <Button variant="solar" onClick={() => setShowNew(true)}>
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Agendar</span>
        </Button>
      </motion.div>

      {appointments.length === 0 ? (
        <Surface variant="elevated" padding="xl">
          <EmptyState
            icon={<CalendarCheck className="w-6 h-6" />}
            title="Nenhum agendamento"
            description="Crie seu primeiro agendamento e gere um voucher."
            action={
              <Button variant="solar" onClick={() => setShowNew(true)}>
                <Plus className="w-4 h-4" /> Criar agendamento
              </Button>
            }
          />
        </Surface>
      ) : (
        <motion.div variants={staggerParent(0.03)} className="relative pl-8">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
          {appointments.map((apt) => (
            <motion.div key={apt.id} variants={slideUp} className="relative mb-3 last:mb-0">
              <div className="absolute -left-8 top-4 w-3 h-3 rounded-full bg-solar border-2 border-canvas ring-2 ring-border" />
              <Surface
                variant="flat"
                padding="md"
                interactive
                onClick={() => setSelected(apt)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-text truncate">{apt.client_name}</p>
                      <Badge variant={STATUS_VARIANT[apt.status]} size="xs">
                        {STATUS_LABEL[apt.status]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-text-faint">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {apt.date} · {apt.time}
                      </span>
                      {apt.product_name && <span>· {apt.product_name}</span>}
                    </div>
                    <p className="text-[10px] text-text-ghost font-mono mt-0.5">
                      voucher {apt.voucher_code}
                    </p>
                  </div>
                </div>
              </Surface>
            </motion.div>
          ))}
        </motion.div>
      )}

      <Dialog
        open={!!selected && !showResult}
        onOpenChange={(v) => !v && setSelected(null)}
      >
        <DialogContent size="md">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  {selected.client_name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <Surface variant="flat" padding="md">
                  <p className="text-[11px] text-text-faint uppercase tracking-wider mb-1">Data</p>
                  <p className="text-sm font-medium text-text">{selected.date}</p>
                </Surface>
                <Surface variant="flat" padding="md">
                  <p className="text-[11px] text-text-faint uppercase tracking-wider mb-1">Horário</p>
                  <p className="text-sm font-medium text-text">{selected.time}</p>
                </Surface>
              </div>

              <Surface variant="flat" padding="md" className="text-center bg-solar/10 border-solar/30 mb-4">
                <p className="text-[11px] text-text-faint uppercase tracking-wider mb-1">Voucher</p>
                <p className="text-2xl font-mono text-solar tracking-widest">
                  {selected.voucher_code}
                </p>
              </Surface>

              {selected.product_name && (
                <p className="text-sm text-text-soft mb-4">Produto: {selected.product_name}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant={STATUS_VARIANT[selected.status]}>
                  {STATUS_LABEL[selected.status]}
                </Badge>
              </div>

              {selected.visit_result && (
                <Surface variant="flat" padding="md" className="mb-4">
                  <p className="text-xs text-text-faint uppercase tracking-wider mb-1">Resultado</p>
                  <p className="text-sm text-text">{selected.visit_result}</p>
                  {selected.visit_notes && (
                    <p className="text-xs text-text-soft mt-1">{selected.visit_notes}</p>
                  )}
                </Surface>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                {selected.client_phone && !selected.voucher_shared && (
                  <Button variant="solar" size="sm" className="flex-1" onClick={() => handleShare(selected)}>
                    <Share2 className="w-4 h-4" /> Voucher
                  </Button>
                )}
                {selected.status !== 'realizado' && selected.status !== 'cancelado' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowResult(true)}
                  >
                    <ClipboardCheck className="w-4 h-4" /> Registrar resultado
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Resultado da visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {RESULTS.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setResult({ ...result, type: r.key })}
                  className={cn(
                    'h-11 rounded-md border text-xs font-medium transition-colors',
                    result.type === r.key
                      ? 'bg-solar/10 border-solar/30 text-solar'
                      : 'bg-surface-1 border-border text-text-soft hover:border-border-glow'
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <Textarea
              placeholder="Observações da visita…"
              rows={3}
              value={result.notes}
              onChange={(e) => setResult({ ...result, notes: e.target.value })}
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowResult(false)}>
                Cancelar
              </Button>
              <Button variant="solar" className="flex-1" onClick={handleRecordVisit}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Novo agendamento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Cliente"
                placeholder="Nome do cliente"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
              />
              <Input
                label="Telefone"
                placeholder="(11) 99999-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <Input
                label="Produto"
                placeholder="Residencial X"
                value={form.product}
                onChange={(e) => setForm({ ...form, product: e.target.value })}
              />
              <Select
                label="Stand"
                value={form.stand_id}
                onChange={(v) => setForm({ ...form, stand_id: v })}
                options={stands
                  .filter((s) => s.status === 'ativo')
                  .map((s) => ({ value: s.id, label: s.name }))}
              />
              <Input
                label="Data"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
              <Input
                label="Horário"
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
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

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNew(true)}
        className="lg:hidden fixed bottom-24 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-solar to-solar-hot flex items-center justify-center shadow-glow"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <Plus className="w-6 h-6 text-canvas" />
      </motion.button>
    </motion.div>
  );
}

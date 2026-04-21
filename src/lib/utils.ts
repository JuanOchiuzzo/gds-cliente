import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

export function getDisplayName(name: string | null | undefined, fallback = 'Usuário'): string {
  const normalized = name?.trim();
  return normalized || fallback;
}

export function getFirstName(name: string | null | undefined, fallback = 'Cliente'): string {
  return getDisplayName(name, fallback).split(/\s+/)[0] || fallback;
}

export function toDateOrNull(value: string | number | Date | null | undefined): Date | null {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatCurrency(value: number): string {
  const amount = normalizeNumber(value);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(normalizeNumber(value));
}

export function formatPercent(value: number): string {
  return `${normalizeNumber(value).toFixed(1)}%`;
}

export function getInitials(name: string): string {
  return getDisplayName(name, 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getLeadStageLabel(stage: string): string {
  const labels: Record<string, string> = {
    novo: 'Novo Lead',
    qualificado: 'Qualificado',
    visita_agendada: 'Visita Agendada',
    proposta: 'Proposta',
    negociacao: 'Negociação',
    fechado: 'Fechado ✓',
    perdido: 'Perdido',
  };
  return labels[stage] || stage;
}

export function getLeadSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    whatsapp: 'WhatsApp',
    site: 'Site',
    evento: 'Evento',
    stand: 'Stand',
    indicacao: 'Indicação',
    instagram: 'Instagram',
    telefone: 'Telefone',
  };
  return labels[source] || source;
}

export function getStandStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    ativo: 'Ativo',
    inativo: 'Inativo',
    em_montagem: 'Em Montagem',
  };
  return labels[status] || status;
}

export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = `${phone || ''}`.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/55${cleanPhone}?text=${encodedMessage}`;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = toDateOrNull(dateStr);
  if (!date) return 'data indisponível';
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min atrás`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d atrás`;
  return date.toLocaleDateString('pt-BR');
}


export function getTemperatureLabel(temp: string): string {
  const labels: Record<string, string> = { quente: '🔥 Quente', morno: '🌤️ Morno', frio: '❄️ Frio' };
  return labels[temp] || temp;
}

export function getTaskTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    ligar: '📞 Ligar', agendar_visita: '🏠 Agendar Visita',
    enviar_proposta: '📄 Enviar Proposta', follow_up: '🔄 Follow-up', outro: '📋 Outro',
  };
  return labels[type] || type;
}

export function getVisitResultLabel(result: string): string {
  const labels: Record<string, string> = {
    interessado: 'Interessado', proposta_enviada: 'Proposta Enviada',
    fechou: 'Fechou Negócio! 🎉', desistiu: 'Desistiu', reagendar: 'Reagendar',
  };
  return labels[result] || result;
}

/**
 * Extracts a field from a Supabase joined relation. Supabase may return the
 * joined record as an object (many-to-one) or as an array (one-to-many or
 * when FK is ambiguous). This helper handles both safely.
 */
export function pickRelation<T = unknown>(
  relation: unknown,
  field: string
): T | null {
  if (!relation) return null;
  if (Array.isArray(relation)) {
    const first = relation[0];
    if (!first || typeof first !== 'object') return null;
    const value = (first as Record<string, unknown>)[field];
    return (value as T) ?? null;
  }
  if (typeof relation !== 'object') return null;
  const value = (relation as Record<string, unknown>)[field];
  return (value as T) ?? null;
}

export function getAppointmentStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendente: 'Pendente', confirmado: 'Confirmado', realizado: 'Realizado',
    cancelado: 'Cancelado', nao_compareceu: 'Não Compareceu',
  };
  return labels[status] || status;
}

export function generateVoucherMessage(appointment: {
  client_name: string; voucher_code: string; date: string;
  time: string; stand_name: string; stand_address: string; product_name: string;
}): string {
  const firstName = getFirstName(appointment.client_name);
  return `Olá ${firstName}! 😊\n\nSua visita está confirmada:\n\n📍 ${appointment.stand_name}\n📌 ${appointment.stand_address}\n🏠 ${appointment.product_name}\n📅 ${appointment.date} às ${appointment.time}\n\n🎫 Seu voucher: *${appointment.voucher_code}*\nApresente à recepcionista ao chegar.\n\n📍 Google Maps: https://maps.google.com/?q=${encodeURIComponent(appointment.stand_address)}\n\nTe esperamos! — StandForge`;
}

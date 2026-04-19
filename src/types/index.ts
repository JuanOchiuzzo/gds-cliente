// ============================================================
// StandForge CRM — Core Type Definitions
// ============================================================

export type UserRole = 'admin' | 'gerente' | 'corretor' | 'visualizador';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string;
  created_at: string;
}

export interface Stand {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  photo_url: string;
  status: 'ativo' | 'inativo' | 'em_montagem';
  type: 'fixo' | 'evento' | 'shopping' | 'virtual';
  total_units: number;
  sold_units: number;
  reserved_units: number;
  monthly_target: number;
  monthly_sales: number;
  manager_id: string;
  manager_name: string;
  created_at: string;
}

export interface StandUnit {
  id: string;
  stand_id: string;
  unit_name: string;
  block: string;
  floor: number;
  area_m2: number;
  price: number;
  status: 'disponivel' | 'reservado' | 'vendido';
  buyer_name?: string;
  sold_at?: string;
}

export type LeadSource = 'whatsapp' | 'site' | 'evento' | 'stand' | 'indicacao' | 'instagram' | 'telefone';
export type LeadStage = 'novo' | 'qualificado' | 'visita_agendada' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  source: LeadSource;
  stage: LeadStage;
  stand_id: string;
  stand_name: string;
  agent_id: string;
  agent_name: string;
  estimated_value: number;
  ai_score: number; // 0-100
  notes: string;
  interested_unit?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  lead_id?: string;
  stand_id?: string;
  agent_id: string;
  agent_name: string;
  type: 'call' | 'whatsapp' | 'visit' | 'email' | 'note' | 'status_change' | 'sale';
  description: string;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string;
  role: 'corretor' | 'gerente';
  stand_id: string;
  stand_name: string;
  total_sales: number;
  total_leads: number;
  conversion_rate: number;
  monthly_target: number;
  monthly_sales: number;
  revenue: number;
  status: 'online' | 'offline' | 'em_atendimento';
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'visita' | 'reuniao' | 'plantao' | 'follow_up' | 'outro';
  start: string;
  end: string;
  lead_id?: string;
  lead_name?: string;
  stand_id?: string;
  stand_name?: string;
  agent_id: string;
  agent_name: string;
  color: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  content: string;
  type: 'text' | 'image' | 'file';
  channel: string;
  created_at: string;
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'warning' | 'info' | 'action';
  stand_name?: string;
  created_at: string;
}

export interface KPIData {
  label: string;
  value: number;
  change: number; // percentage
  prefix?: string;
  suffix?: string;
  icon: string;
}

export interface FunnelStage {
  name: string;
  value: number;
  fill: string;
}


// ── Carteira (Wallet) ─────────────────────────────────────
export type ClientTemperature = 'quente' | 'morno' | 'frio';

export interface WalletClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  cpf?: string;
  temperature: ClientTemperature;
  notes: string;
  interested_product?: string;
  stand_id?: string;
  stand_name?: string;
  agent_id: string;
  is_private: true; // always private to the agent
  created_at: string;
  updated_at: string;
}

export interface ClientTask {
  id: string;
  client_id: string;
  client_name: string;
  type: 'ligar' | 'agendar_visita' | 'enviar_proposta' | 'follow_up' | 'outro';
  description: string;
  due_date: string;
  completed: boolean;
  created_at: string;
}

// ── Plantão (Queue) ───────────────────────────────────────
export interface QueuePosition {
  id: string;
  agent_id: string;
  agent_name: string;
  position: number;
  status: 'aguardando' | 'atendendo' | 'ausente';
  stand_id: string;
  stand_name: string;
  entered_at: string;
}

// ── Agendamento Completo ──────────────────────────────────
export interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  product_name: string;
  stand_id: string;
  stand_name: string;
  stand_address: string;
  agent_id: string;
  agent_name: string;
  date: string;
  time: string;
  status: 'pendente' | 'confirmado' | 'realizado' | 'cancelado' | 'nao_compareceu';
  visit_result?: 'interessado' | 'proposta_enviada' | 'fechou' | 'desistiu' | 'reagendar';
  visit_notes?: string;
  voucher_code: string;
  voucher_shared: boolean;
  created_at: string;
}


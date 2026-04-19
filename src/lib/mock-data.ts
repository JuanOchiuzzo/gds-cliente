// ============================================================
// StandForge CRM — Rich Mock Data
// ============================================================
import type {
  Stand, Lead, Agent, Activity, StandUnit, CalendarEvent,
  ChatMessage, AIInsight, KPIData, FunnelStage,
} from '@/types';

// ── KPIs ──────────────────────────────────────────────────
export const kpiData: KPIData[] = [
  { label: 'Vendas do Mês', value: 47, change: 12.5, suffix: ' un', icon: 'TrendingUp' },
  { label: 'Leads Ativos', value: 284, change: 8.3, icon: 'Users' },
  { label: 'Taxa de Conversão', value: 16.5, change: 2.1, suffix: '%', icon: 'Target' },
  { label: 'Stands em Operação', value: 12, change: 0, icon: 'Building2' },
  { label: 'Receita Projetada', value: 23500000, change: 15.2, prefix: 'R$', icon: 'DollarSign' },
];

// ── Funnel ────────────────────────────────────────────────
export const funnelData: FunnelStage[] = [
  { name: 'Novos Leads', value: 284, fill: '#67e8f9' },
  { name: 'Qualificados', value: 187, fill: '#818cf8' },
  { name: 'Visita Agendada', value: 98, fill: '#a855f7' },
  { name: 'Proposta', value: 64, fill: '#c084fc' },
  { name: 'Negociação', value: 38, fill: '#34d399' },
  { name: 'Fechados', value: 47, fill: '#22d3ee' },
];

// ── Stands ────────────────────────────────────────────────
export const stands: Stand[] = [
  {
    id: 's1', name: 'Stand Shopping Eldorado', address: 'Av. Rebouças, 3970', city: 'São Paulo', state: 'SP',
    lat: -23.5714, lng: -46.6920, photo_url: '/stands/eldorado.jpg', status: 'ativo', type: 'shopping',
    total_units: 120, sold_units: 47, reserved_units: 15, monthly_target: 12, monthly_sales: 14,
    manager_id: 'a1', manager_name: 'Ricardo Mendes', created_at: '2025-08-15',
  },
  {
    id: 's2', name: 'Stand Barra da Tijuca', address: 'Av. das Américas, 4666', city: 'Rio de Janeiro', state: 'RJ',
    lat: -22.9998, lng: -43.3650, photo_url: '/stands/barra.jpg', status: 'ativo', type: 'fixo',
    total_units: 200, sold_units: 89, reserved_units: 22, monthly_target: 15, monthly_sales: 11,
    manager_id: 'a2', manager_name: 'Camila Rocha', created_at: '2025-06-01',
  },
  {
    id: 's3', name: 'Stand Savassi BH', address: 'Rua Pernambuco, 1000', city: 'Belo Horizonte', state: 'MG',
    lat: -19.9352, lng: -43.9378, photo_url: '/stands/savassi.jpg', status: 'ativo', type: 'fixo',
    total_units: 80, sold_units: 32, reserved_units: 8, monthly_target: 8, monthly_sales: 9,
    manager_id: 'a3', manager_name: 'Fernando Lima', created_at: '2025-09-10',
  },
  {
    id: 's4', name: 'Stand Morumbi Town', address: 'Av. Giovanni Gronchi, 5819', city: 'São Paulo', state: 'SP',
    lat: -23.6235, lng: -46.7210, photo_url: '/stands/morumbi.jpg', status: 'ativo', type: 'shopping',
    total_units: 150, sold_units: 63, reserved_units: 18, monthly_target: 10, monthly_sales: 8,
    manager_id: 'a4', manager_name: 'Ana Beatriz Costa', created_at: '2025-07-20',
  },
  {
    id: 's5', name: 'Stand Alphaville', address: 'Alameda Rio Negro, 585', city: 'Barueri', state: 'SP',
    lat: -23.4977, lng: -46.8492, photo_url: '/stands/alphaville.jpg', status: 'ativo', type: 'fixo',
    total_units: 96, sold_units: 41, reserved_units: 12, monthly_target: 10, monthly_sales: 12,
    manager_id: 'a5', manager_name: 'Lucas Ferreira', created_at: '2025-05-15',
  },
  {
    id: 's6', name: 'Stand Expo Imóveis SP', address: 'Pavilhão de Exposições do Anhembi', city: 'São Paulo', state: 'SP',
    lat: -23.5175, lng: -46.6380, photo_url: '/stands/expo.jpg', status: 'ativo', type: 'evento',
    total_units: 300, sold_units: 134, reserved_units: 45, monthly_target: 25, monthly_sales: 28,
    manager_id: 'a1', manager_name: 'Ricardo Mendes', created_at: '2026-01-10',
  },
  {
    id: 's7', name: 'Stand Leblon', address: 'Rua Dias Ferreira, 417', city: 'Rio de Janeiro', state: 'RJ',
    lat: -22.9838, lng: -43.2240, photo_url: '/stands/leblon.jpg', status: 'ativo', type: 'fixo',
    total_units: 60, sold_units: 28, reserved_units: 5, monthly_target: 6, monthly_sales: 5,
    manager_id: 'a6', manager_name: 'Juliana Alves', created_at: '2025-11-01',
  },
  {
    id: 's8', name: 'Stand Virtual SP Premium', address: 'Online — Tour 360°', city: 'São Paulo', state: 'SP',
    lat: -23.5505, lng: -46.6333, photo_url: '/stands/virtual.jpg', status: 'ativo', type: 'virtual',
    total_units: 180, sold_units: 56, reserved_units: 30, monthly_target: 20, monthly_sales: 18,
    manager_id: 'a7', manager_name: 'Pedro Henrique', created_at: '2026-02-01',
  },
  {
    id: 's9', name: 'Stand Campinas Mall', address: 'Rua Conceição, 233', city: 'Campinas', state: 'SP',
    lat: -22.9064, lng: -47.0616, photo_url: '/stands/campinas.jpg', status: 'em_montagem', type: 'shopping',
    total_units: 110, sold_units: 0, reserved_units: 0, monthly_target: 8, monthly_sales: 0,
    manager_id: 'a8', manager_name: 'Mariana Santos', created_at: '2026-03-15',
  },
  {
    id: 's10', name: 'Stand Curitiba Centro', address: 'Rua XV de Novembro, 700', city: 'Curitiba', state: 'PR',
    lat: -25.4284, lng: -49.2733, photo_url: '/stands/curitiba.jpg', status: 'ativo', type: 'fixo',
    total_units: 75, sold_units: 22, reserved_units: 10, monthly_target: 7, monthly_sales: 6,
    manager_id: 'a9', manager_name: 'Thiago Oliveira', created_at: '2025-10-20',
  },
  {
    id: 's11', name: 'Stand Recife Boa Viagem', address: 'Av. Boa Viagem, 3000', city: 'Recife', state: 'PE',
    lat: -8.1206, lng: -34.9013, photo_url: '/stands/recife.jpg', status: 'ativo', type: 'fixo',
    total_units: 90, sold_units: 35, reserved_units: 7, monthly_target: 9, monthly_sales: 7,
    manager_id: 'a10', manager_name: 'Gabriela Nunes', created_at: '2025-12-01',
  },
  {
    id: 's12', name: 'Stand Salvador Pelourinho', address: 'Largo do Pelourinho, 12', city: 'Salvador', state: 'BA',
    lat: -12.9730, lng: -38.5108, photo_url: '/stands/salvador.jpg', status: 'inativo', type: 'evento',
    total_units: 50, sold_units: 50, reserved_units: 0, monthly_target: 0, monthly_sales: 0,
    manager_id: 'a10', manager_name: 'Gabriela Nunes', created_at: '2025-04-01',
  },
];


// ── Agents ────────────────────────────────────────────────
export const agents: Agent[] = [
  { id: 'a1', name: 'Ricardo Mendes', email: 'ricardo@standforge.com', phone: '11999001001', avatar_url: '', role: 'gerente', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', total_sales: 67, total_leads: 180, conversion_rate: 37.2, monthly_target: 12, monthly_sales: 14, revenue: 8900000, status: 'online', created_at: '2024-01-15' },
  { id: 'a2', name: 'Camila Rocha', email: 'camila@standforge.com', phone: '21999002002', avatar_url: '', role: 'gerente', stand_id: 's2', stand_name: 'Stand Barra da Tijuca', total_sales: 54, total_leads: 160, conversion_rate: 33.7, monthly_target: 15, monthly_sales: 11, revenue: 7200000, status: 'online', created_at: '2024-02-10' },
  { id: 'a3', name: 'Fernando Lima', email: 'fernando@standforge.com', phone: '31999003003', avatar_url: '', role: 'gerente', stand_id: 's3', stand_name: 'Stand Savassi BH', total_sales: 42, total_leads: 120, conversion_rate: 35.0, monthly_target: 8, monthly_sales: 9, revenue: 5100000, status: 'em_atendimento', created_at: '2024-03-05' },
  { id: 'a4', name: 'Ana Beatriz Costa', email: 'anab@standforge.com', phone: '11999004004', avatar_url: '', role: 'gerente', stand_id: 's4', stand_name: 'Stand Morumbi Town', total_sales: 38, total_leads: 140, conversion_rate: 27.1, monthly_target: 10, monthly_sales: 8, revenue: 4800000, status: 'online', created_at: '2024-01-20' },
  { id: 'a5', name: 'Lucas Ferreira', email: 'lucas@standforge.com', phone: '11999005005', avatar_url: '', role: 'corretor', stand_id: 's5', stand_name: 'Stand Alphaville', total_sales: 51, total_leads: 130, conversion_rate: 39.2, monthly_target: 10, monthly_sales: 12, revenue: 6300000, status: 'online', created_at: '2024-04-12' },
  { id: 'a6', name: 'Juliana Alves', email: 'juliana@standforge.com', phone: '21999006006', avatar_url: '', role: 'corretor', stand_id: 's7', stand_name: 'Stand Leblon', total_sales: 28, total_leads: 85, conversion_rate: 32.9, monthly_target: 6, monthly_sales: 5, revenue: 4200000, status: 'offline', created_at: '2024-05-08' },
  { id: 'a7', name: 'Pedro Henrique', email: 'pedro@standforge.com', phone: '11999007007', avatar_url: '', role: 'corretor', stand_id: 's8', stand_name: 'Stand Virtual SP Premium', total_sales: 45, total_leads: 200, conversion_rate: 22.5, monthly_target: 20, monthly_sales: 18, revenue: 5600000, status: 'online', created_at: '2024-06-15' },
  { id: 'a8', name: 'Mariana Santos', email: 'mariana@standforge.com', phone: '19999008008', avatar_url: '', role: 'gerente', stand_id: 's9', stand_name: 'Stand Campinas Mall', total_sales: 0, total_leads: 15, conversion_rate: 0, monthly_target: 8, monthly_sales: 0, revenue: 0, status: 'online', created_at: '2025-12-01' },
  { id: 'a9', name: 'Thiago Oliveira', email: 'thiago@standforge.com', phone: '41999009009', avatar_url: '', role: 'corretor', stand_id: 's10', stand_name: 'Stand Curitiba Centro', total_sales: 22, total_leads: 70, conversion_rate: 31.4, monthly_target: 7, monthly_sales: 6, revenue: 2800000, status: 'em_atendimento', created_at: '2024-07-20' },
  { id: 'a10', name: 'Gabriela Nunes', email: 'gabriela@standforge.com', phone: '81999010010', avatar_url: '', role: 'gerente', stand_id: 's11', stand_name: 'Stand Recife Boa Viagem', total_sales: 35, total_leads: 95, conversion_rate: 36.8, monthly_target: 9, monthly_sales: 7, revenue: 3500000, status: 'online', created_at: '2024-08-10' },
  { id: 'a11', name: 'Bruno Carvalho', email: 'bruno@standforge.com', phone: '11999011011', avatar_url: '', role: 'corretor', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', total_sales: 31, total_leads: 90, conversion_rate: 34.4, monthly_target: 8, monthly_sales: 7, revenue: 3900000, status: 'online', created_at: '2024-09-01' },
  { id: 'a12', name: 'Isabela Martins', email: 'isabela@standforge.com', phone: '21999012012', avatar_url: '', role: 'corretor', stand_id: 's2', stand_name: 'Stand Barra da Tijuca', total_sales: 26, total_leads: 75, conversion_rate: 34.6, monthly_target: 7, monthly_sales: 6, revenue: 3200000, status: 'offline', created_at: '2024-10-15' },
  { id: 'a13', name: 'Rafael Souza', email: 'rafael@standforge.com', phone: '11999013013', avatar_url: '', role: 'corretor', stand_id: 's6', stand_name: 'Stand Expo Imóveis SP', total_sales: 58, total_leads: 210, conversion_rate: 27.6, monthly_target: 25, monthly_sales: 28, revenue: 7100000, status: 'online', created_at: '2024-11-01' },
  { id: 'a14', name: 'Larissa Pereira', email: 'larissa@standforge.com', phone: '31999014014', avatar_url: '', role: 'corretor', stand_id: 's3', stand_name: 'Stand Savassi BH', total_sales: 19, total_leads: 55, conversion_rate: 34.5, monthly_target: 5, monthly_sales: 4, revenue: 2300000, status: 'online', created_at: '2025-01-10' },
  { id: 'a15', name: 'Diego Nascimento', email: 'diego@standforge.com', phone: '11999015015', avatar_url: '', role: 'corretor', stand_id: 's5', stand_name: 'Stand Alphaville', total_sales: 33, total_leads: 100, conversion_rate: 33.0, monthly_target: 8, monthly_sales: 7, revenue: 4100000, status: 'em_atendimento', created_at: '2025-02-20' },
];

// ── Leads ─────────────────────────────────────────────────
const leadNames = [
  'João Silva', 'Maria Oliveira', 'Carlos Santos', 'Ana Paula Ferreira', 'Roberto Almeida',
  'Fernanda Costa', 'Paulo Ribeiro', 'Juliana Martins', 'Marcos Pereira', 'Patrícia Lima',
  'André Souza', 'Luciana Rocha', 'Eduardo Mendes', 'Beatriz Carvalho', 'Gustavo Nunes',
  'Renata Alves', 'Felipe Barbosa', 'Camila Dias', 'Rodrigo Gomes', 'Tatiana Araújo',
  'Leonardo Moreira', 'Vanessa Correia', 'Daniel Nascimento', 'Priscila Teixeira', 'Thiago Cardoso',
  'Amanda Vieira', 'Marcelo Pinto', 'Cristiane Lopes', 'Alexandre Freitas', 'Simone Monteiro',
  'Gabriel Machado', 'Natália Duarte', 'Henrique Campos', 'Débora Ramos', 'Vinícius Castro',
  'Aline Fonseca', 'Leandro Azevedo', 'Raquel Borges', 'Fábio Cunha', 'Elaine Melo',
  'Matheus Reis', 'Cláudia Tavares', 'Sérgio Nogueira', 'Adriana Pires', 'Caio Guimarães',
  'Bianca Moura', 'Otávio Sampaio', 'Letícia Brito', 'Hugo Andrade', 'Marília Vasconcelos',
];

const sources: Lead['source'][] = ['whatsapp', 'site', 'evento', 'stand', 'indicacao', 'instagram', 'telefone'];
const stages: Lead['stage'][] = ['novo', 'qualificado', 'visita_agendada', 'proposta', 'negociacao', 'fechado', 'perdido'];

export const leads: Lead[] = leadNames.map((name, i) => {
  const standIdx = i % stands.length;
  const agentIdx = i % agents.length;
  const stage = stages[i < 8 ? 0 : i < 16 ? 1 : i < 24 ? 2 : i < 32 ? 3 : i < 38 ? 4 : i < 45 ? 5 : 6];
  return {
    id: `l${i + 1}`,
    name,
    email: `${name.toLowerCase().replace(/ /g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}@email.com`,
    phone: `11${String(990000000 + i * 111)}`,
    avatar_url: null,
    source: sources[i % sources.length],
    stage,
    stand_id: stands[standIdx].id,
    stand_name: stands[standIdx].name,
    agent_id: agents[agentIdx].id,
    agent_name: agents[agentIdx].name,
    estimated_value: 350000 + Math.floor(Math.random() * 1200000),
    ai_score: Math.floor(30 + Math.random() * 70),
    notes: '',
    created_at: new Date(2026, 0, 1 + Math.floor(Math.random() * 108)).toISOString(),
    updated_at: new Date(2026, 3, 1 + Math.floor(Math.random() * 19)).toISOString(),
  };
});


// ── Activities ────────────────────────────────────────────
export const activities: Activity[] = [
  { id: 'act1', lead_id: 'l1', agent_id: 'a1', agent_name: 'Ricardo Mendes', type: 'sale', description: 'Venda concluída — Apt 1204 Bloco A — R$ 890.000', created_at: new Date(2026, 3, 19, 10, 30).toISOString() },
  { id: 'act2', lead_id: 'l5', agent_id: 'a5', agent_name: 'Lucas Ferreira', type: 'visit', description: 'Visita realizada ao Stand Alphaville com cliente Roberto Almeida', created_at: new Date(2026, 3, 19, 9, 15).toISOString() },
  { id: 'act3', lead_id: 'l12', agent_id: 'a2', agent_name: 'Camila Rocha', type: 'whatsapp', description: 'Enviou proposta comercial via WhatsApp para Luciana Rocha', created_at: new Date(2026, 3, 19, 8, 45).toISOString() },
  { id: 'act4', lead_id: 'l3', agent_id: 'a3', agent_name: 'Fernando Lima', type: 'status_change', description: 'Lead Carlos Santos movido para "Negociação"', created_at: new Date(2026, 3, 18, 17, 0).toISOString() },
  { id: 'act5', lead_id: 'l20', agent_id: 'a7', agent_name: 'Pedro Henrique', type: 'call', description: 'Ligação de follow-up com Tatiana Araújo — interessada em 3 quartos', created_at: new Date(2026, 3, 18, 16, 30).toISOString() },
  { id: 'act6', lead_id: 'l8', agent_id: 'a4', agent_name: 'Ana Beatriz Costa', type: 'email', description: 'Enviou material do empreendimento para Juliana Martins', created_at: new Date(2026, 3, 18, 15, 0).toISOString() },
  { id: 'act7', stand_id: 's6', agent_id: 'a13', agent_name: 'Rafael Souza', type: 'sale', description: 'Venda concluída — Cobertura Duplex — R$ 2.100.000', created_at: new Date(2026, 3, 18, 14, 20).toISOString() },
  { id: 'act8', lead_id: 'l15', agent_id: 'a9', agent_name: 'Thiago Oliveira', type: 'note', description: 'Cliente pediu prazo até sexta para decisão final', created_at: new Date(2026, 3, 18, 11, 0).toISOString() },
  { id: 'act9', lead_id: 'l30', agent_id: 'a10', agent_name: 'Gabriela Nunes', type: 'visit', description: 'Agendou visita para Simone Monteiro no Stand Recife', created_at: new Date(2026, 3, 17, 16, 45).toISOString() },
  { id: 'act10', lead_id: 'l2', agent_id: 'a11', agent_name: 'Bruno Carvalho', type: 'whatsapp', description: 'Primeiro contato com Maria Oliveira — lead do Instagram', created_at: new Date(2026, 3, 17, 10, 0).toISOString() },
];

// ── AI Insights ───────────────────────────────────────────
export const aiInsights: AIInsight[] = [
  { id: 'ai1', title: 'Stand Eldorado acima da meta!', description: 'O Stand Shopping Eldorado está 17% acima da meta mensal. A equipe de Ricardo Mendes está performando excepcionalmente.', type: 'success', stand_name: 'Stand Shopping Eldorado', created_at: new Date().toISOString() },
  { id: 'ai2', title: 'Atenção: Barra da Tijuca', description: 'O Stand Barra da Tijuca está 27% abaixo da meta. Recomendo reforçar a equipe com mais 2 corretores e intensificar campanhas de WhatsApp.', type: 'warning', stand_name: 'Stand Barra da Tijuca', created_at: new Date().toISOString() },
  { id: 'ai3', title: 'Leads do Instagram convertendo mais', description: 'Leads originados do Instagram têm taxa de conversão 42% maior que a média. Considere aumentar investimento neste canal.', type: 'info', created_at: new Date().toISOString() },
  { id: 'ai4', title: 'Ação sugerida: Follow-up urgente', description: '12 leads em "Proposta" não receberam contato há mais de 3 dias. Risco de perda estimado em R$ 4.2M.', type: 'action', created_at: new Date().toISOString() },
  { id: 'ai5', title: 'Expo Imóveis SP: recorde!', description: 'O Stand Expo Imóveis SP bateu recorde de vendas com 28 unidades no mês. Parabéns à equipe de Rafael Souza!', type: 'success', stand_name: 'Stand Expo Imóveis SP', created_at: new Date().toISOString() },
];

// ── Calendar Events ───────────────────────────────────────
export const calendarEvents: CalendarEvent[] = [
  { id: 'ev1', title: 'Visita — João Silva', description: 'Visita ao Stand Eldorado', type: 'visita', start: '2026-04-19T10:00:00', end: '2026-04-19T11:00:00', lead_id: 'l1', lead_name: 'João Silva', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', agent_id: 'a1', agent_name: 'Ricardo Mendes', color: '#67e8f9' },
  { id: 'ev2', title: 'Plantão — Barra', description: 'Plantão no Stand Barra', type: 'plantao', start: '2026-04-19T08:00:00', end: '2026-04-19T18:00:00', stand_id: 's2', stand_name: 'Stand Barra da Tijuca', agent_id: 'a2', agent_name: 'Camila Rocha', color: '#a855f7' },
  { id: 'ev3', title: 'Reunião de equipe', description: 'Alinhamento semanal', type: 'reuniao', start: '2026-04-20T09:00:00', end: '2026-04-20T10:00:00', agent_id: 'a1', agent_name: 'Ricardo Mendes', color: '#818cf8' },
  { id: 'ev4', title: 'Follow-up — Maria Oliveira', description: 'Ligar para Maria sobre proposta', type: 'follow_up', start: '2026-04-20T14:00:00', end: '2026-04-20T14:30:00', lead_id: 'l2', lead_name: 'Maria Oliveira', agent_id: 'a11', agent_name: 'Bruno Carvalho', color: '#34d399' },
  { id: 'ev5', title: 'Visita — Carlos Santos', description: 'Visita ao Stand Savassi', type: 'visita', start: '2026-04-21T15:00:00', end: '2026-04-21T16:00:00', lead_id: 'l3', lead_name: 'Carlos Santos', stand_id: 's3', stand_name: 'Stand Savassi BH', agent_id: 'a3', agent_name: 'Fernando Lima', color: '#67e8f9' },
  { id: 'ev6', title: 'Plantão — Alphaville', description: 'Plantão fim de semana', type: 'plantao', start: '2026-04-19T09:00:00', end: '2026-04-19T17:00:00', stand_id: 's5', stand_name: 'Stand Alphaville', agent_id: 'a5', agent_name: 'Lucas Ferreira', color: '#a855f7' },
];

// ── Chat Messages ─────────────────────────────────────────
export const chatMessages: ChatMessage[] = [
  { id: 'msg1', sender_id: 'a1', sender_name: 'Ricardo Mendes', sender_avatar: '', content: 'Pessoal, acabamos de fechar mais uma venda no Eldorado! 🎉', type: 'text', channel: 'geral', created_at: new Date(2026, 3, 19, 10, 35).toISOString() },
  { id: 'msg2', sender_id: 'a5', sender_name: 'Lucas Ferreira', sender_avatar: '', content: 'Parabéns Ricardo! Aqui no Alphaville também estamos com bom fluxo hoje.', type: 'text', channel: 'geral', created_at: new Date(2026, 3, 19, 10, 37).toISOString() },
  { id: 'msg3', sender_id: 'a2', sender_name: 'Camila Rocha', sender_avatar: '', content: 'Alguém tem o material atualizado do empreendimento Barra Premium?', type: 'text', channel: 'geral', created_at: new Date(2026, 3, 19, 10, 40).toISOString() },
  { id: 'msg4', sender_id: 'a13', sender_name: 'Rafael Souza', sender_avatar: '', content: 'Camila, vou te enviar agora. Acabei de receber da incorporadora.', type: 'text', channel: 'geral', created_at: new Date(2026, 3, 19, 10, 42).toISOString() },
  { id: 'msg5', sender_id: 'a7', sender_name: 'Pedro Henrique', sender_avatar: '', content: 'Galera, o tour virtual novo está incrível. Conversão subiu 15% essa semana!', type: 'text', channel: 'geral', created_at: new Date(2026, 3, 19, 11, 0).toISOString() },
];

// ── Sales Chart Data ──────────────────────────────────────
export const salesChartData = [
  { month: 'Jan', vendas: 32, meta: 35 },
  { month: 'Fev', vendas: 38, meta: 35 },
  { month: 'Mar', vendas: 41, meta: 40 },
  { month: 'Abr', vendas: 47, meta: 42 },
];

export const standPerformanceData = stands
  .filter((s) => s.status === 'ativo')
  .map((s) => ({
    name: s.name.replace('Stand ', ''),
    vendas: s.monthly_sales,
    meta: s.monthly_target,
    percent: Math.round((s.monthly_sales / s.monthly_target) * 100),
  }))
  .sort((a, b) => b.percent - a.percent);


// ── Wallet Clients ────────────────────────────────────────
import type { WalletClient, ClientTask, QueuePosition, Appointment } from '@/types';

export const walletClients: WalletClient[] = [
  { id: 'wc1', name: 'João Silva', phone: '11999001001', email: 'joao@email.com', temperature: 'quente', notes: 'Muito interessado no 3 quartos, pediu proposta', interested_product: 'Residencial Parque das Flores', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', agent_id: 'a1', is_private: true, created_at: '2026-04-10T10:00:00', updated_at: '2026-04-19T09:00:00' },
  { id: 'wc2', name: 'Maria Oliveira', phone: '11999002002', email: 'maria@email.com', temperature: 'morno', notes: 'Visitou stand, pediu para pensar', interested_product: 'Edifício Aurora', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', agent_id: 'a1', is_private: true, created_at: '2026-04-08T14:00:00', updated_at: '2026-04-18T16:00:00' },
  { id: 'wc3', name: 'Carlos Santos', phone: '11999003003', email: 'carlos@email.com', temperature: 'quente', notes: 'Quer fechar até sexta, aguardando aprovação de crédito', interested_product: 'Residencial Parque das Flores', stand_id: 's3', stand_name: 'Stand Savassi BH', agent_id: 'a1', is_private: true, created_at: '2026-04-05T09:00:00', updated_at: '2026-04-19T11:00:00' },
  { id: 'wc4', name: 'Ana Paula Ferreira', phone: '11999004004', email: 'ana@email.com', temperature: 'frio', notes: 'Apenas pesquisando, sem urgência', interested_product: 'Edifício Aurora', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', agent_id: 'a1', is_private: true, created_at: '2026-04-01T11:00:00', updated_at: '2026-04-15T10:00:00' },
  { id: 'wc5', name: 'Roberto Almeida', phone: '11999005005', email: 'roberto@email.com', temperature: 'morno', notes: 'Interessado em investimento, quer saber sobre rentabilidade', interested_product: 'Alphaville Premium', stand_id: 's5', stand_name: 'Stand Alphaville', agent_id: 'a1', is_private: true, created_at: '2026-04-12T15:00:00', updated_at: '2026-04-19T08:00:00' },
  { id: 'wc6', name: 'Fernanda Costa', phone: '11999006006', email: 'fernanda@email.com', temperature: 'quente', notes: 'Proposta enviada, aguardando retorno', interested_product: 'Residencial Parque das Flores', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', agent_id: 'a1', is_private: true, created_at: '2026-04-14T10:00:00', updated_at: '2026-04-19T14:00:00' },
  { id: 'wc7', name: 'Paulo Ribeiro', phone: '11999007007', email: 'paulo@email.com', cpf: '123.456.789-00', temperature: 'morno', notes: 'Recepcionista registrou, completar dados', interested_product: 'Edifício Aurora', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', agent_id: 'a1', is_private: true, created_at: '2026-04-18T16:00:00', updated_at: '2026-04-18T16:00:00' },
  { id: 'wc8', name: 'Juliana Martins', phone: '11999008008', email: 'juliana@email.com', temperature: 'frio', notes: 'Primeiro contato via Instagram', stand_id: 's4', stand_name: 'Stand Morumbi Town', agent_id: 'a1', is_private: true, created_at: '2026-04-16T09:00:00', updated_at: '2026-04-17T11:00:00' },
];

export const clientTasks: ClientTask[] = [
  { id: 'ct1', client_id: 'wc1', client_name: 'João Silva', type: 'enviar_proposta', description: 'Enviar proposta atualizada do 3 quartos', due_date: '2026-04-19T14:00:00', completed: false, created_at: '2026-04-18T10:00:00' },
  { id: 'ct2', client_id: 'wc3', client_name: 'Carlos Santos', type: 'ligar', description: 'Ligar para saber sobre aprovação de crédito', due_date: '2026-04-19T10:00:00', completed: true, created_at: '2026-04-17T09:00:00' },
  { id: 'ct3', client_id: 'wc5', client_name: 'Roberto Almeida', type: 'agendar_visita', description: 'Agendar visita ao Stand Alphaville', due_date: '2026-04-20T09:00:00', completed: false, created_at: '2026-04-18T15:00:00' },
  { id: 'ct4', client_id: 'wc6', client_name: 'Fernanda Costa', type: 'follow_up', description: 'Follow-up sobre proposta enviada', due_date: '2026-04-19T16:00:00', completed: false, created_at: '2026-04-18T14:00:00' },
  { id: 'ct5', client_id: 'wc2', client_name: 'Maria Oliveira', type: 'ligar', description: 'Ligar para saber se decidiu', due_date: '2026-04-21T10:00:00', completed: false, created_at: '2026-04-19T09:00:00' },
  { id: 'ct6', client_id: 'wc7', client_name: 'Paulo Ribeiro', type: 'ligar', description: 'Primeiro contato — registrado pela recepcionista', due_date: '2026-04-19T11:00:00', completed: false, created_at: '2026-04-18T16:00:00' },
];

// ── Queue / Plantão ───────────────────────────────────────
export const queuePositions: QueuePosition[] = [
  { id: 'q1', agent_id: 'a11', agent_name: 'Bruno Carvalho', position: 1, status: 'atendendo', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', entered_at: '2026-04-19T08:00:00' },
  { id: 'q2', agent_id: 'a1', agent_name: 'Ricardo Mendes', position: 2, status: 'aguardando', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', entered_at: '2026-04-19T08:15:00' },
  { id: 'q3', agent_id: 'a13', agent_name: 'Rafael Souza', position: 3, status: 'aguardando', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', entered_at: '2026-04-19T08:30:00' },
  { id: 'q4', agent_id: 'a15', agent_name: 'Diego Nascimento', position: 4, status: 'ausente', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', entered_at: '2026-04-19T08:45:00' },
];

// ── Appointments ──────────────────────────────────────────
export const appointments: Appointment[] = [
  { id: 'ap1', client_name: 'João Silva', client_phone: '11999001001', client_email: 'joao@email.com', product_name: 'Residencial Parque das Flores', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', stand_address: 'Av. Rebouças, 3970 — São Paulo, SP', agent_id: 'a1', agent_name: 'Ricardo Mendes', date: '2026-04-19', time: '10:00', status: 'confirmado', voucher_code: 'SF-ELD-7A3K', voucher_shared: true, created_at: '2026-04-17T10:00:00' },
  { id: 'ap2', client_name: 'Maria Oliveira', client_phone: '11999002002', client_email: 'maria@email.com', product_name: 'Edifício Aurora', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', stand_address: 'Av. Rebouças, 3970 — São Paulo, SP', agent_id: 'a1', agent_name: 'Ricardo Mendes', date: '2026-04-20', time: '14:00', status: 'pendente', voucher_code: 'SF-ELD-9B2M', voucher_shared: false, created_at: '2026-04-18T14:00:00' },
  { id: 'ap3', client_name: 'Carlos Santos', client_phone: '11999003003', client_email: 'carlos@email.com', product_name: 'Residencial Parque das Flores', stand_id: 's3', stand_name: 'Stand Savassi BH', stand_address: 'Rua Pernambuco, 1000 — Belo Horizonte, MG', agent_id: 'a1', agent_name: 'Ricardo Mendes', date: '2026-04-18', time: '15:00', status: 'realizado', visit_result: 'proposta_enviada', visit_notes: 'Cliente gostou muito do apartamento 1204. Pediu proposta com desconto de 5%.', voucher_code: 'SF-SAV-4C1N', voucher_shared: true, created_at: '2026-04-16T09:00:00' },
  { id: 'ap4', client_name: 'Ana Paula Ferreira', client_phone: '11999004004', client_email: 'ana@email.com', product_name: 'Edifício Aurora', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', stand_address: 'Av. Rebouças, 3970 — São Paulo, SP', agent_id: 'a1', agent_name: 'Ricardo Mendes', date: '2026-04-15', time: '11:00', status: 'realizado', visit_result: 'reagendar', visit_notes: 'Veio com o marido, gostaram mas querem ver outras opções antes.', voucher_code: 'SF-ELD-2D5P', voucher_shared: true, created_at: '2026-04-13T10:00:00' },
  { id: 'ap5', client_name: 'Roberto Almeida', client_phone: '11999005005', client_email: 'roberto@email.com', product_name: 'Alphaville Premium', stand_id: 's5', stand_name: 'Stand Alphaville', stand_address: 'Alameda Rio Negro, 585 — Barueri, SP', agent_id: 'a1', agent_name: 'Ricardo Mendes', date: '2026-04-14', time: '09:00', status: 'nao_compareceu', voucher_code: 'SF-ALP-8E3Q', voucher_shared: true, created_at: '2026-04-12T15:00:00' },
  { id: 'ap6', client_name: 'Fernanda Costa', client_phone: '11999006006', client_email: 'fernanda@email.com', product_name: 'Residencial Parque das Flores', stand_id: 's1', stand_name: 'Stand Shopping Eldorado', stand_address: 'Av. Rebouças, 3970 — São Paulo, SP', agent_id: 'a1', agent_name: 'Ricardo Mendes', date: '2026-04-21', time: '10:00', status: 'pendente', voucher_code: 'SF-ELD-6F9R', voucher_shared: false, created_at: '2026-04-19T10:00:00' },
];

// ── Month comparison data ─────────────────────────────────
export const monthComparison = {
  current: { vendas: 47, leads: 284, conversao: 16.5, receita: 23500000, agendamentos: 38 },
  previous: { vendas: 42, leads: 262, conversao: 14.4, receita: 20400000, agendamentos: 31 },
};


// ── Personal Performance ──────────────────────────────────
export const myPerformance = {
  current_month: { sales: 14, leads_attended: 38, visits: 22, proposals: 18, conversion_rate: 36.8, revenue: 8900000 },
  previous_month: { sales: 11, leads_attended: 32, visits: 19, proposals: 14, conversion_rate: 34.4, revenue: 7100000 },
};

// ── Today's Appointments (derived from appointments) ──
export const todayAppointments = appointments.filter((a) => a.date === '2026-04-19');

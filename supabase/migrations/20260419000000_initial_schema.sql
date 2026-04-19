-- ============================================================
-- StandForge CRM — Initial Database Schema
-- ============================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- ── ENUM TYPES ──────────────────────────────────────────────

create type user_role as enum ('admin', 'gerente', 'corretor', 'visualizador');
create type stand_status as enum ('ativo', 'inativo', 'em_montagem');
create type stand_type as enum ('fixo', 'evento', 'shopping', 'virtual');
create type lead_source as enum ('whatsapp', 'site', 'evento', 'stand', 'indicacao', 'instagram', 'telefone');
create type lead_stage as enum ('novo', 'qualificado', 'visita_agendada', 'proposta', 'negociacao', 'fechado', 'perdido');
create type activity_type as enum ('call', 'whatsapp', 'visit', 'email', 'note', 'status_change', 'sale');
create type event_type as enum ('visita', 'reuniao', 'plantao', 'follow_up', 'outro');
create type client_temperature as enum ('quente', 'morno', 'frio');
create type task_type as enum ('ligar', 'agendar_visita', 'enviar_proposta', 'follow_up', 'outro');
create type queue_status as enum ('aguardando', 'atendendo', 'ausente', 'finalizado');
create type appointment_status as enum ('pendente', 'confirmado', 'realizado', 'nao_compareceu', 'cancelado');
create type visit_result as enum ('interessado', 'proposta_enviada', 'fechou', 'desistiu', 'reagendar', 'nao_compareceu');
create type agent_status as enum ('online', 'offline', 'em_atendimento');

-- ── PROFILES ────────────────────────────────────────────────

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text not null,
  avatar_url text,
  role user_role not null default 'corretor',
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── STANDS ──────────────────────────────────────────────────

create table stands (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  address text,
  city text,
  state text,
  lat float8,
  lng float8,
  photo_url text,
  status stand_status not null default 'ativo',
  type stand_type,
  total_units int not null default 0,
  sold_units int not null default 0,
  reserved_units int not null default 0,
  monthly_target int not null default 0,
  monthly_sales int not null default 0,
  manager_id uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── STAND UNITS ─────────────────────────────────────────────

create table stand_units (
  id uuid primary key default uuid_generate_v4(),
  stand_id uuid not null references stands(id) on delete cascade,
  unit_name text not null,
  block text,
  floor int,
  area_m2 numeric,
  price numeric not null default 0,
  status text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido')),
  buyer_name text,
  sold_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── LEADS ───────────────────────────────────────────────────

create table leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  avatar_url text,
  source lead_source,
  stage lead_stage not null default 'novo',
  stand_id uuid references stands(id),
  agent_id uuid references profiles(id),
  estimated_value numeric not null default 0,
  ai_score int not null default 50,
  notes text,
  interested_unit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── ACTIVITIES ──────────────────────────────────────────────

create table activities (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id) on delete set null,
  stand_id uuid references stands(id) on delete set null,
  agent_id uuid references profiles(id),
  type activity_type not null,
  description text,
  created_at timestamptz not null default now()
);

-- ── CALENDAR EVENTS ─────────────────────────────────────────

create table calendar_events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  type event_type not null default 'outro',
  start_time timestamptz not null,
  end_time timestamptz not null,
  lead_id uuid references leads(id) on delete set null,
  stand_id uuid references stands(id) on delete set null,
  agent_id uuid references profiles(id),
  color text default '#2563eb',
  created_at timestamptz not null default now()
);

-- ── WALLET CLIENTS (private to each agent) ──────────────────

create table wallet_clients (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  cpf text,
  temperature client_temperature not null default 'morno',
  notes text,
  interested_product text,
  stand_id uuid references stands(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── CLIENT TASKS ────────────────────────────────────────────

create table client_tasks (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references wallet_clients(id) on delete cascade,
  agent_id uuid not null references profiles(id) on delete cascade,
  type task_type not null default 'outro',
  description text not null,
  due_date timestamptz not null,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

-- ── QUEUE (Plantão) ─────────────────────────────────────────

create table queue (
  id uuid primary key default uuid_generate_v4(),
  stand_id uuid not null references stands(id) on delete cascade,
  agent_id uuid not null references profiles(id) on delete cascade,
  position int not null,
  status queue_status not null default 'aguardando',
  entered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(stand_id, agent_id, entered_at::date)
);

-- ── APPOINTMENTS ────────────────────────────────────────────

create table appointments (
  id uuid primary key default uuid_generate_v4(),
  agent_id uuid not null references profiles(id) on delete cascade,
  client_name text not null,
  client_phone text,
  client_email text,
  product_name text,
  stand_id uuid references stands(id),
  date date not null,
  time time not null,
  status appointment_status not null default 'pendente',
  voucher_code text not null default upper(substr(md5(random()::text), 1, 8)),
  voucher_shared boolean not null default false,
  visit_result visit_result,
  visit_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── CHAT MESSAGES ───────────────────────────────────────────

create table chat_messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  type text not null default 'text' check (type in ('text', 'image', 'file')),
  channel text not null default 'geral',
  created_at timestamptz not null default now()
);

-- ── INDEXES ─────────────────────────────────────────────────

create index idx_leads_stage on leads(stage);
create index idx_leads_agent on leads(agent_id);
create index idx_leads_stand on leads(stand_id);
create index idx_activities_agent on activities(agent_id);
create index idx_activities_created on activities(created_at desc);
create index idx_wallet_agent on wallet_clients(agent_id);
create index idx_tasks_agent on client_tasks(agent_id);
create index idx_tasks_due on client_tasks(due_date) where not completed;
create index idx_queue_stand on queue(stand_id);
create index idx_appointments_agent on appointments(agent_id);
create index idx_appointments_date on appointments(date);
create index idx_chat_channel on chat_messages(channel, created_at desc);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────

alter table profiles enable row level security;
alter table stands enable row level security;
alter table stand_units enable row level security;
alter table leads enable row level security;
alter table activities enable row level security;
alter table calendar_events enable row level security;
alter table wallet_clients enable row level security;
alter table client_tasks enable row level security;
alter table queue enable row level security;
alter table appointments enable row level security;
alter table chat_messages enable row level security;

-- Profiles: users can read all, update own
create policy "Profiles are viewable by authenticated users" on profiles
  for select to authenticated using (true);
create policy "Users can update own profile" on profiles
  for update to authenticated using (auth.uid() = id);

-- Stands: readable by all authenticated
create policy "Stands are viewable by authenticated users" on stands
  for select to authenticated using (true);
create policy "Admins and gerentes can manage stands" on stands
  for all to authenticated using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'gerente'))
  );

-- Stand Units: readable by all authenticated
create policy "Stand units are viewable by authenticated users" on stand_units
  for select to authenticated using (true);

-- Leads: readable by all authenticated, writable by assigned agent or admin/gerente
create policy "Leads are viewable by authenticated users" on leads
  for select to authenticated using (true);
create policy "Leads can be managed by assigned agent or admin" on leads
  for all to authenticated using (
    agent_id = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'gerente'))
  );

-- Activities: readable by all, writable by own agent
create policy "Activities are viewable by authenticated users" on activities
  for select to authenticated using (true);
create policy "Agents can create activities" on activities
  for insert to authenticated with check (agent_id = auth.uid());

-- Calendar Events: readable by all, writable by own agent
create policy "Calendar events are viewable by authenticated users" on calendar_events
  for select to authenticated using (true);
create policy "Agents can manage own events" on calendar_events
  for all to authenticated using (agent_id = auth.uid());

-- Wallet Clients: PRIVATE — only the owning agent can see/manage
create policy "Wallet clients are private to agent" on wallet_clients
  for all to authenticated using (agent_id = auth.uid());

-- Client Tasks: PRIVATE — only the owning agent
create policy "Client tasks are private to agent" on client_tasks
  for all to authenticated using (agent_id = auth.uid());

-- Queue: readable by all at same stand
create policy "Queue is viewable by authenticated users" on queue
  for select to authenticated using (true);
create policy "Admins and gerentes can manage queue" on queue
  for all to authenticated using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'gerente'))
  );

-- Appointments: agents see own, admins/gerentes see all
create policy "Agents can see own appointments" on appointments
  for select to authenticated using (
    agent_id = auth.uid() or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'gerente'))
  );
create policy "Agents can manage own appointments" on appointments
  for all to authenticated using (agent_id = auth.uid());

-- Chat: readable by all authenticated
create policy "Chat messages are viewable by authenticated users" on chat_messages
  for select to authenticated using (true);
create policy "Users can send messages" on chat_messages
  for insert to authenticated with check (sender_id = auth.uid());

-- ── REALTIME ────────────────────────────────────────────────

alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table activities;
alter publication supabase_realtime add table queue;
alter publication supabase_realtime add table chat_messages;
alter publication supabase_realtime add table appointments;

-- ── FUNCTIONS ───────────────────────────────────────────────

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tr_profiles_updated before update on profiles for each row execute function update_updated_at();
create trigger tr_stands_updated before update on stands for each row execute function update_updated_at();
create trigger tr_leads_updated before update on leads for each row execute function update_updated_at();
create trigger tr_wallet_updated before update on wallet_clients for each row execute function update_updated_at();
create trigger tr_appointments_updated before update on appointments for each row execute function update_updated_at();
create trigger tr_queue_updated before update on queue for each row execute function update_updated_at();

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'corretor'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

# 🏗️ StandForge CRM

> **O futuro da gestão de stands imobiliários**

CRM premium, mobile-first, com design futurista glassmorphism + dark mode neon para gestão de stands de vendas imobiliárias no Brasil.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Ready-3ecf8e)

## ✨ Features

- **Dashboard** com KPIs animados, funil de vendas, mapa interativo e AI Insights
- **Gestão de Stands** com cards premium, filtros e detalhes completos
- **Leads & Pipeline Kanban** com drag-and-drop e integração WhatsApp
- **Agentes/Corretores** com leaderboard animado e métricas individuais
- **Calendário** com visualização semanal e gestão de eventos
- **Chat da Equipe** em tempo real
- **Relatórios & Analytics** com charts interativos
- **Nexus AI Copilot** — assistente inteligente integrado
- **Command Palette** (Cmd/Ctrl + K) para busca rápida
- **PWA** instalável como app nativo
- **100% Mobile-first** com bottom navigation

## 🚀 Setup Rápido

```bash
# 1. Instalar dependências
cd standforge-crm
npm install

# 2. Configurar variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas credenciais Supabase (opcional para demo)

# 3. Rodar em desenvolvimento
npm run dev

# 4. Abrir no navegador
# http://localhost:3000
```

## 🗄️ Supabase (Opcional)

O app funciona com dados mock por padrão. Para conectar ao Supabase:

### 1. Criar projeto no [supabase.com](https://supabase.com)

### 2. Criar tabelas

```sql
-- Profiles
create table profiles (
  id uuid references auth.users primary key,
  email text not null,
  full_name text not null,
  avatar_url text,
  role text check (role in ('admin', 'gerente', 'corretor', 'visualizador')) default 'corretor',
  phone text,
  created_at timestamptz default now()
);

-- Stands
create table stands (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  state text,
  lat float8,
  lng float8,
  photo_url text,
  status text check (status in ('ativo', 'inativo', 'em_montagem')) default 'ativo',
  type text check (type in ('fixo', 'evento', 'shopping', 'virtual')),
  total_units int default 0,
  sold_units int default 0,
  reserved_units int default 0,
  monthly_target int default 0,
  monthly_sales int default 0,
  manager_id uuid references profiles(id),
  created_at timestamptz default now()
);

-- Leads
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  avatar_url text,
  source text check (source in ('whatsapp', 'site', 'evento', 'stand', 'indicacao', 'instagram', 'telefone')),
  stage text check (stage in ('novo', 'qualificado', 'visita_agendada', 'proposta', 'negociacao', 'fechado', 'perdido')) default 'novo',
  stand_id uuid references stands(id),
  agent_id uuid references profiles(id),
  estimated_value numeric default 0,
  ai_score int default 50,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Activities
create table activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  stand_id uuid references stands(id),
  agent_id uuid references profiles(id),
  type text check (type in ('call', 'whatsapp', 'visit', 'email', 'note', 'status_change', 'sale')),
  description text,
  created_at timestamptz default now()
);

-- Calendar Events
create table calendar_events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text check (type in ('visita', 'reuniao', 'plantao', 'follow_up', 'outro')),
  start_time timestamptz not null,
  end_time timestamptz not null,
  lead_id uuid references leads(id),
  stand_id uuid references stands(id),
  agent_id uuid references profiles(id),
  color text default '#67e8f9',
  created_at timestamptz default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table stands enable row level security;
alter table leads enable row level security;
alter table activities enable row level security;
alter table calendar_events enable row level security;

-- Enable Realtime
alter publication supabase_realtime add table leads;
alter publication supabase_realtime add table activities;
```

### 3. Configurar `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 📱 PWA — Instalar como App

1. Abra o app no Chrome (mobile ou desktop)
2. Toque em "Adicionar à tela inicial" / "Instalar app"
3. O app funciona como app nativo com ícone na home

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── page.tsx              # Login
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Estilos globais
│   └── dashboard/
│       ├── layout.tsx        # Dashboard layout (sidebar + topbar + bottom nav)
│       ├── page.tsx          # Dashboard principal
│       ├── stands/page.tsx   # Gestão de stands
│       ├── leads/page.tsx    # Gestão de leads
│       ├── pipeline/page.tsx # Pipeline Kanban
│       ├── agents/page.tsx   # Agentes/Corretores
│       ├── calendar/page.tsx # Calendário
│       ├── chat/page.tsx     # Chat da equipe
│       ├── reports/page.tsx  # Relatórios
│       ├── settings/page.tsx # Configurações
│       └── ai/page.tsx       # Nexus AI (mobile)
├── components/
│   ├── ui/                   # Componentes base (GlassCard, Button, Badge, etc.)
│   ├── layout/               # Sidebar, Topbar, BottomNav
│   ├── dashboard/            # Charts, Map
│   ├── command-palette.tsx   # Cmd+K
│   └── ai-fab.tsx            # FAB do Nexus AI
├── lib/
│   ├── utils.ts              # Utilitários
│   ├── mock-data.ts          # Dados mock
│   └── supabase/             # Clients Supabase
└── types/
    └── index.ts              # TypeScript types
```

## 📲 Evoluir para App Nativo

Para criar versão nativa iOS/Android mantendo o design system:

1. **Expo + React Native** — Reuse types, utils e lógica de negócio
2. **NativeWind** — Tailwind para React Native (mesmas classes)
3. **Moti** — Equivalente ao Framer Motion para RN
4. **React Native Reanimated** — Animações nativas de alta performance
5. **Supabase JS** — Mesmo client funciona em RN

O design system (cores, glassmorphism, tipografia) é 100% portável.

## 🛠️ Tech Stack

| Tecnologia | Uso |
|---|---|
| Next.js 15 | Framework React (App Router) |
| React 19 | UI Library |
| TypeScript 5.7 | Type Safety |
| Tailwind CSS 3.4 | Styling |
| Framer Motion 11 | Animações |
| Supabase | Backend (Auth, DB, Realtime, Storage) |
| Recharts | Charts & Gráficos |
| React Leaflet | Mapas interativos |
| cmdk | Command Palette |
| Sonner | Toast notifications |
| Lucide React | Ícones |
| date-fns | Manipulação de datas |

---

**StandForge CRM** — Feito com 💎 para o mercado imobiliário brasileiro.

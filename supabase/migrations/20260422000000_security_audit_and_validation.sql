-- ============================================================
-- Trilha 2: Segurança comercial mínima
-- ============================================================
-- Este arquivo adiciona:
--   1. Validação server-side via CHECK constraints (email/phone)
--   2. Audit log table + triggers para LGPD / rastreabilidade
--   3. RLS policies para audit_logs
-- ============================================================

-- ── 1. CHECK CONSTRAINTS (validação server-side) ───────────

-- Email: formato básico (regex). NULL continua permitido.
alter table leads
  drop constraint if exists leads_email_format_chk;
alter table leads
  add constraint leads_email_format_chk
  check (email is null or email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$');

alter table profiles
  drop constraint if exists profiles_email_format_chk;
alter table profiles
  add constraint profiles_email_format_chk
  check (email ~* '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$');

-- Telefone BR: apenas dígitos, 10 ou 11 chars (DDD + número).
-- A aplicação normaliza antes de gravar (onlyDigits).
alter table leads
  drop constraint if exists leads_phone_format_chk;
alter table leads
  add constraint leads_phone_format_chk
  check (phone is null or (phone ~ '^[0-9]+$' and length(phone) between 10 and 13));

alter table profiles
  drop constraint if exists profiles_phone_format_chk;
alter table profiles
  add constraint profiles_phone_format_chk
  check (phone is null or (phone ~ '^[0-9]+$' and length(phone) between 10 and 13));

-- estimated_value não negativo
alter table leads
  drop constraint if exists leads_estimated_value_non_negative_chk;
alter table leads
  add constraint leads_estimated_value_non_negative_chk
  check (estimated_value >= 0);

-- ai_score entre 0 e 100
alter table leads
  drop constraint if exists leads_ai_score_range_chk;
alter table leads
  add constraint leads_ai_score_range_chk
  check (ai_score between 0 and 100);


-- ── 2. AUDIT LOGS ──────────────────────────────────────────

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  actor_id uuid references auth.users(id) on delete set null,
  actor_email text,
  old_data jsonb,
  new_data jsonb,
  changed_fields text[],
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_table_record_idx on audit_logs (table_name, record_id);
create index if not exists audit_logs_actor_idx on audit_logs (actor_id);
create index if not exists audit_logs_created_at_idx on audit_logs (created_at desc);


-- ── 3. TRIGGER FUNCTION para audit ─────────────────────────

create or replace function public.fn_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_actor uuid;
  v_email text;
  v_old jsonb;
  v_new jsonb;
  v_changed text[];
begin
  -- captura usuário autenticado (pode ser null em operações de sistema)
  v_actor := auth.uid();
  begin
    select email into v_email from auth.users where id = v_actor;
  exception when others then
    v_email := null;
  end;

  if (tg_op = 'INSERT') then
    v_new := to_jsonb(new);
    insert into audit_logs (table_name, record_id, operation, actor_id, actor_email, new_data)
      values (tg_table_name, new.id, 'INSERT', v_actor, v_email, v_new);
    return new;
  elsif (tg_op = 'UPDATE') then
    v_old := to_jsonb(old);
    v_new := to_jsonb(new);
    select array_agg(key) into v_changed
      from jsonb_each(v_new)
      where v_new -> key is distinct from v_old -> key;
    if v_changed is not null and array_length(v_changed, 1) > 0 then
      insert into audit_logs (table_name, record_id, operation, actor_id, actor_email, old_data, new_data, changed_fields)
        values (tg_table_name, new.id, 'UPDATE', v_actor, v_email, v_old, v_new, v_changed);
    end if;
    return new;
  elsif (tg_op = 'DELETE') then
    v_old := to_jsonb(old);
    insert into audit_logs (table_name, record_id, operation, actor_id, actor_email, old_data)
      values (tg_table_name, old.id, 'DELETE', v_actor, v_email, v_old);
    return old;
  end if;
  return null;
end;
$$;


-- ── 4. Triggers nas tabelas sensíveis (LGPD) ───────────────

drop trigger if exists trg_audit_leads on leads;
create trigger trg_audit_leads
  after insert or update or delete on leads
  for each row execute function public.fn_audit_log();

drop trigger if exists trg_audit_profiles on profiles;
create trigger trg_audit_profiles
  after insert or update or delete on profiles
  for each row execute function public.fn_audit_log();

drop trigger if exists trg_audit_stands on stands;
create trigger trg_audit_stands
  after insert or update or delete on stands
  for each row execute function public.fn_audit_log();


-- ── 5. RLS em audit_logs ───────────────────────────────────

alter table audit_logs enable row level security;

-- somente admin ou gerente podem ler audit logs
drop policy if exists "audit_logs_read_admin" on audit_logs;
create policy "audit_logs_read_admin"
  on audit_logs for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role in ('admin', 'gerente')
    )
  );

-- ninguém atualiza ou deleta manualmente; só INSERT via trigger (SECURITY DEFINER)
drop policy if exists "audit_logs_no_update" on audit_logs;
drop policy if exists "audit_logs_no_delete" on audit_logs;


-- ── 6. Comentários de documentação ─────────────────────────

comment on table audit_logs is 'Trilha de auditoria LGPD. Registra INSERT/UPDATE/DELETE em leads, profiles, stands. Somente admin/gerente podem ler.';
comment on column audit_logs.changed_fields is 'Lista de colunas que mudaram em UPDATE (evita ruído de updates sem efeito).';
comment on column audit_logs.actor_id is 'auth.uid() no momento da operação. NULL em operações de sistema.';

-- INS-43: benefit_requests tracking table
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/xzatiewlgmoalpzsnicz/sql
create table if not exists public.benefit_requests (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  provider_id text        not null,
  provider_name text      not null,
  user_email  text,
  project_title text
);

-- Permissive RLS: anyone (including anonymous visitors) can insert
alter table public.benefit_requests enable row level security;

create policy "anon insert"
  on public.benefit_requests
  for insert
  to anon, authenticated
  with check (true);

-- Only authenticated service roles can read
create policy "service read"
  on public.benefit_requests
  for select
  to service_role
  using (true);

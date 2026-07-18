-- INS-46: projects table for architect project uploads
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/xzatiewlgmoalpzsnicz/sql

create table if not exists public.projects (
  id               bigserial primary key,
  created_at       timestamptz not null default now(),
  titulo           text not null,
  tipo             text not null,        -- 'Obra nueva' | 'Reforma' | 'Ambiente'
  ubicacion        text not null,        -- barrio / ciudad
  descripcion      text,
  portada_url      text,                 -- Supabase Storage public URL (or data URL fallback)
  galeria_urls     text[],               -- array of Storage URLs for additional photos
  proveedores      text[],               -- array of provider IDs from _PM_CONTACTS
  arquitecto_email text,
  arquitecto_id    uuid references auth.users(id)
);

-- Row-level security
alter table public.projects enable row level security;

-- Anyone (including anonymous) can read all published projects
create policy "public read"
  on public.projects for select
  using (true);

-- Authenticated architects can insert their own projects
create policy "auth insert"
  on public.projects for insert
  to authenticated
  with check (arquitecto_id = auth.uid());

-- Architect can delete own projects
create policy "auth own delete"
  on public.projects for delete
  to authenticated
  using (arquitecto_id = auth.uid());

-- ── Supabase Storage bucket for project photos ────────────────
-- Run these separately if the bucket doesn't exist yet:
--
-- insert into storage.buckets (id, name, public)
--   values ('project-images', 'project-images', true)
--   on conflict (id) do nothing;
--
-- create policy "public read project images"
--   on storage.objects for select
--   using (bucket_id = 'project-images');
--
-- create policy "auth upload project images"
--   on storage.objects for insert
--   to authenticated
--   with check (bucket_id = 'project-images');

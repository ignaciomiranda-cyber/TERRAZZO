-- ═══════════════════════════════════════════════════════════════
-- Realmood — Supabase infrastructure setup
-- Run each section in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. benefit_requests ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS benefit_requests (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id   text,
  provider_name text,
  benefit_type  text,
  project_title text,
  user_email    text,
  created_at    timestamptz DEFAULT now()
);
ALTER TABLE benefit_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow anon insert"   ON benefit_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "allow auth select"   ON benefit_requests FOR SELECT USING (auth.role() = 'authenticated');


-- ── 2. projects ──────────────────────────────────────────────
-- Columns match _submitUploadProject() in app.html
CREATE TABLE IF NOT EXISTS projects (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo           text        NOT NULL,
  tipo             text,
  ubicacion        text,
  descripcion      text,
  portada_url      text,
  galeria_urls     text[],
  proveedores      text[],
  arquitecto_email text,
  arquitecto_id    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at       timestamptz DEFAULT now()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
-- Authenticated users can insert their own projects
CREATE POLICY "auth insert"         ON projects FOR INSERT WITH CHECK (auth.uid() = arquitecto_id);
-- Public read (Explorar is public)
CREATE POLICY "public select"       ON projects FOR SELECT USING (true);
-- Owner can update/delete
CREATE POLICY "owner update"        ON projects FOR UPDATE USING (auth.uid() = arquitecto_id);
CREATE POLICY "owner delete"        ON projects FOR DELETE USING (auth.uid() = arquitecto_id);


-- ── 3. user_profiles ─────────────────────────────────────────
-- Stores role (arquitecto | proveedor) and profile data
CREATE TABLE IF NOT EXISTS user_profiles (
  id                  uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               text,
  role                text        CHECK (role IN ('arquitecto', 'proveedor')),
  nombre              text,
  ciudad              text,
  -- proveedor-only fields
  marca               text,
  rubro               text,
  benefit_type        text        CHECK (benefit_type IN ('descuento', 'muestra gratis', 'prioridad de entrega') OR benefit_type IS NULL),
  benefit_description text,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now()
);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users can read own profile"   ON user_profiles FOR SELECT  USING (auth.uid() = id);
CREATE POLICY "users can insert own profile" ON user_profiles FOR INSERT  WITH CHECK (auth.uid() = id);
CREATE POLICY "users can update own profile" ON user_profiles FOR UPDATE  USING (auth.uid() = id);


-- ── 4. Storage bucket: project-images ────────────────────────
-- Run in Supabase dashboard → Storage → New bucket, or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read policy for the bucket
CREATE POLICY "public images read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Authenticated users can upload
CREATE POLICY "auth images upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');


-- ── Verification queries (run after setup to confirm) ─────────
-- SELECT count(*) FROM benefit_requests;
-- SELECT count(*) FROM projects;
-- SELECT count(*) FROM user_profiles;
-- SELECT id, name FROM storage.buckets WHERE id = 'project-images';

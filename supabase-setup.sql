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
-- INS-49: admin-only SELECT — any authenticated user could otherwise read all rows via the API
CREATE POLICY "admin_only_select"   ON benefit_requests FOR SELECT USING (auth.jwt() ->> 'email' = 'ignacio.miranda@mi.unc.edu.ar');


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


-- ── 5. INS-50: user_profiles migration for manual providers ──
-- Run this AFTER the initial setup above if the table already exists.

-- Drop FK so id can be auto-generated (not tied to auth.users)
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

-- Allow id to default to a new UUID (for admin-inserted rows with no auth user)
ALTER TABLE user_profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add user_id (nullable) to link a provider row to an auth account after claim
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS wa      text;

-- Backfill existing auth-created rows: user_id = id
UPDATE user_profiles SET user_id = id WHERE user_id IS NULL;

-- Unique index: each auth user links to at most one provider profile
CREATE UNIQUE INDEX IF NOT EXISTS user_profiles_user_id_key
  ON user_profiles (user_id) WHERE user_id IS NOT NULL;

-- Allow admin to INSERT provider rows manually (no auth.uid() requirement)
CREATE POLICY IF NOT EXISTS "admin insert user_profiles"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = 'ignacio.miranda@mi.unc.edu.ar');

-- Allow any authenticated user to read provider profiles (for autocomplete)
CREATE POLICY IF NOT EXISTS "public read proveedores"
  ON user_profiles FOR SELECT
  USING (role = 'proveedor');

-- Allow first-time login to claim an unclaimed provider row by email match
CREATE POLICY IF NOT EXISTS "claim own provider profile"
  ON user_profiles FOR UPDATE
  USING (user_id IS NULL AND email = (auth.jwt() ->> 'email'))
  WITH CHECK (user_id = auth.uid());

-- Drop old policies that used id = auth.uid() so they don't conflict
-- (re-create them below to also cover user_id)
DROP POLICY IF EXISTS "users can read own profile"   ON user_profiles;
DROP POLICY IF EXISTS "users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "users can update own profile" ON user_profiles;

CREATE POLICY "users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id OR auth.uid() = user_id);

CREATE POLICY "users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id OR auth.uid() = user_id);


-- ── Seed data (run once to migrate hardcoded _PM_CONTACTS) ───
-- INSERT INTO user_profiles (role, nombre, rubro, ciudad, wa, benefit_type, benefit_description)
-- VALUES
--   ('proveedor', 'Estudio Bertone',    'Arquitecto · Proyectista',      'Nueva Córdoba, Córdoba', '5493514001234', NULL,            NULL),
--   ('proveedor', 'Obras Martínez SRL', 'Contratista',                   'General Paz, Córdoba',   '5493514003456', NULL,            NULL),
--   ('proveedor', 'Instone',            'Proveedor · Terrazzo',          'Córdoba Capital',        '5493513001001', 'muestra gratis','Muestra gratuita de terrazzo personalizado para tu proyecto — elegís la fórmula en el configurador y la recibís sin costo.'),
--   ('proveedor', 'De Stefano',         'Proveedor · Piedras & Tablas',  'Córdoba Capital',        '5493514004567', 'descuento',     '10% de descuento en primera compra para arquitectos e interioristas que lleguen por Realmood.');


-- ── Verification queries (run after setup to confirm) ─────────
-- SELECT count(*) FROM benefit_requests;
-- SELECT count(*) FROM projects;
-- SELECT count(*) FROM user_profiles;
-- SELECT id, name FROM storage.buckets WHERE id = 'project-images';
-- SELECT id, nombre, role, user_id, email FROM user_profiles WHERE role = 'proveedor';

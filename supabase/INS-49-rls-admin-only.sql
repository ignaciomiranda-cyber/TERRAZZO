-- INS-49: Restrict benefit_requests SELECT to admin only at DB level
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/xzatiewlgmoalpzsnicz/sql
--
-- The old "allow auth select" policy let any authenticated user read all rows.
-- Replace it with an email-check so only the admin can SELECT via the API.

-- ── benefit_requests ─────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "allow auth select" ON benefit_requests;

CREATE POLICY "admin_only_select"
  ON benefit_requests
  FOR SELECT
  USING (auth.jwt() ->> 'email' = 'ignacio.miranda@mi.unc.edu.ar');

-- INSERT policy is unchanged: anon + authenticated users can still submit requests.
-- "allow anon insert" ON benefit_requests FOR INSERT WITH CHECK (true) — leave as-is.


-- ── Verification ─────────────────────────────────────────────────────────────
-- After running, confirm in SQL Editor (service role bypasses RLS so use the
-- Supabase JS client test below, or check via the Policies tab):
--
-- Expected policies on benefit_requests:
--   INSERT  | allow anon insert   | WITH CHECK (true)
--   SELECT  | admin_only_select   | USING (auth.jwt() ->> 'email' = 'ignacio.miranda@mi.unc.edu.ar')
--
-- ── user_profiles (no change needed) ────────────────────────────────────────
-- Already correct — each user reads/writes their own row:
--   SELECT  | users can read own profile   | USING (auth.uid() = id)
--   INSERT  | users can insert own profile | WITH CHECK (auth.uid() = id)
--   UPDATE  | users can update own profile | USING (auth.uid() = id)
--
-- ── projects (no change needed) ──────────────────────────────────────────────
-- Already public read:
--   SELECT  | public select | USING (true)

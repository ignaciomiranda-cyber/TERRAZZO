-- INS-53: agregar campo creador_terrazzo a user_profiles
-- Run in Supabase SQL Editor

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS creador_terrazzo boolean DEFAULT false;

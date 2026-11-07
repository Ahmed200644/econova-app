-- ============================================================
-- EcoNova Student Pilot — Supabase Schema
-- Migration: 001_pilot_schema.sql
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── TABLE: students ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id     TEXT NOT NULL UNIQUE,         -- expo-device unique ID (pilot auth)
  name          TEXT NOT NULL DEFAULT '',
  university    TEXT NOT NULL DEFAULT '',
  faculty       TEXT NOT NULL DEFAULT '',
  academic_year TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TABLE: stations ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.stations (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                 TEXT NOT NULL UNIQUE,  -- e.g. 'ST-101'
  name                 TEXT NOT NULL,
  location             TEXT NOT NULL DEFAULT '',
  accepted_materials   TEXT[] NOT NULL DEFAULT '{}',
  active               BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── TABLE: recycling_transactions ───────────────────────────
CREATE TABLE IF NOT EXISTS public.recycling_transactions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idempotency_key      TEXT NOT NULL UNIQUE,  -- client-generated UUID prevents double-submit
  student_id           UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  station_id           UUID NOT NULL REFERENCES public.stations(id) ON DELETE RESTRICT,
  material             TEXT NOT NULL,         -- 'plastic' | 'paper' | 'metal' | 'ewaste'
  quantity             NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
  points               INTEGER NOT NULL CHECK (points >= 0),
  kg_recycled          NUMERIC(10,3) NOT NULL DEFAULT 0,
  co2e_kg              NUMERIC(10,3) NOT NULL DEFAULT 0,
  verification         TEXT NOT NULL DEFAULT 'qr_code', -- 'qr_code' | 'manual_fallback'
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast student queries
CREATE INDEX IF NOT EXISTS idx_transactions_student_id
  ON public.recycling_transactions (student_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at
  ON public.recycling_transactions (created_at DESC);

-- ── VIEW: student_points ────────────────────────────────────
-- Derives total points, kg, and rank from persisted transactions.
-- This is the single source of truth for leaderboard and dashboards.
CREATE OR REPLACE VIEW public.student_points AS
SELECT
  s.id                                                   AS student_id,
  s.name,
  s.university,
  s.faculty,
  s.academic_year,
  COALESCE(SUM(t.points), 0)::INTEGER                   AS total_points,
  COALESCE(SUM(t.kg_recycled), 0)::NUMERIC(10,2)        AS total_kg_recycled,
  COALESCE(SUM(t.co2e_kg), 0)::NUMERIC(10,3)            AS total_co2e_kg,
  COUNT(t.id)::INTEGER                                   AS total_actions,
  RANK() OVER (ORDER BY COALESCE(SUM(t.points), 0) DESC) AS rank
FROM public.students s
LEFT JOIN public.recycling_transactions t ON t.student_id = s.id
GROUP BY s.id, s.name, s.university, s.faculty, s.academic_year;

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recycling_transactions ENABLE ROW LEVEL SECURITY;

-- students: anyone can insert their own row (device_id check enforced in app)
CREATE POLICY "students_insert_own"
  ON public.students FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "students_select_own"
  ON public.students FOR SELECT
  TO anon
  USING (true);  -- pilot: allow reading all students for leaderboard

CREATE POLICY "students_update_own"
  ON public.students FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- stations: anyone can read active stations
CREATE POLICY "stations_select_active"
  ON public.stations FOR SELECT
  TO anon
  USING (active = TRUE);

-- transactions: anon can insert and read their own
CREATE POLICY "transactions_insert"
  ON public.recycling_transactions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "transactions_select_own"
  ON public.recycling_transactions FOR SELECT
  TO anon
  USING (true);  -- pilot: allow reading all for leaderboard aggregation

-- ── SEED DATA: Pilot Stations ───────────────────────────────
-- QR codes to print: simply encode the 'code' string (e.g. "ST-101")
INSERT INTO public.stations (code, name, location, accepted_materials, active)
VALUES
  ('ST-101', 'EcoNova Main Hub',
   'Faculty of Science Main Gate · Luxor University',
   ARRAY['plastic','paper','metal','ewaste'], TRUE),

  ('ST-102', 'Engineering Block B Station',
   'Faculty of Engineering Courtyard · Luxor University',
   ARRAY['plastic','metal','ewaste'], TRUE),

  ('ST-103', 'Student Union Recycling Station',
   'Student Activities Complex · Luxor University',
   ARRAY['plastic','paper'], TRUE)

ON CONFLICT (code) DO UPDATE SET
  name                 = EXCLUDED.name,
  location             = EXCLUDED.location,
  accepted_materials   = EXCLUDED.accepted_materials,
  active               = EXCLUDED.active;

-- ── DONE ────────────────────────────────────────────────────
-- After running this migration:
-- 1. Copy the Supabase project URL and anon key into .env
-- 2. Print QR codes for ST-101, ST-102, ST-103
-- 3. Deploy updated app build to pilot students

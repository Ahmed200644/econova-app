import { createClient } from '@supabase/supabase-js';

// Expo Metro exposes EXPO_PUBLIC_* variables to client bundles automatically.
// Fill these in your .env file (see .env.example).
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (__DEV__ && (!SUPABASE_URL || !SUPABASE_ANON_KEY)) {
  console.warn(
    '[EcoNova] Supabase credentials missing. ' +
      'Copy .env.example → .env and fill in your project URL and anon key.'
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    // Pilot uses device-ID-based identity, not Supabase Auth sessions.
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
});

// ── Supabase Row Types ───────────────────────────────────────

export interface DbStudent {
  id: string;
  device_id: string;
  name: string;
  university: string;
  faculty: string;
  academic_year: string;
  created_at: string;
}

export interface DbStation {
  id: string;
  code: string;
  name: string;
  location: string;
  accepted_materials: string[];
  active: boolean;
  created_at: string;
}

export interface DbTransaction {
  id: string;
  idempotency_key: string;
  student_id: string;
  station_id: string;
  material: string;
  quantity: number;
  points: number;
  kg_recycled: number;
  co2e_kg: number;
  verification: string;
  created_at: string;
}

export interface DbStudentPoints {
  student_id: string;
  name: string;
  university: string;
  faculty: string;
  academic_year: string;
  total_points: number;
  total_kg_recycled: number;
  total_co2e_kg: number;
  total_actions: number;
  rank: number;
}

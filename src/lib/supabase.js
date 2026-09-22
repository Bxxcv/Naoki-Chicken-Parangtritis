import { createClient } from '@supabase/supabase-js';

// Klien Supabase (anon key = publik by design, lihat docs/SECURITY.md).
// Nilai diisi via env Vercel, BUKAN file .env yg di-commit.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;

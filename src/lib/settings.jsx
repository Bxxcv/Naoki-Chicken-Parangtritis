import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from './supabase.js';

// Pengaturan outlet: dibaca landing (status buka), ditulis di Admin >
// Pengaturan. Default = buka tiap hari 08.00–21.00 (sesuai operasional
// outlet saat ini); ubah dari dashboard bila berubah.
const OUTLET_SLUG = 'parangtritis';

export const DEFAULTS = {
  outlet_name: 'Naoki Chicken Parangtritis',
  address: '',
  phone: '',
  open_time: '08:00',
  close_time: '21:00',
  open_days: '[1,2,3,4,5,6,0]',
  dine_in: 'true',
  takeaway: 'true',
  pickup: 'true',
  delivery: 'true',
  force_closed: 'false',
  qris_image_url: '',
};

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toMinutes(hhmm) {
  const [h, m] = (hhmm || '').split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

// Waktu Asia/Jakarta sekarang (zona outlet, bukan zona perangkat).
export function jakartaNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => (parts.find((p) => p.type === type) || {}).value;
  const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    day: dayMap[get('weekday')] ?? new Date().getDay(),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

// Status buka dari settings. Kembalikan { open, text } jujur.
export function openInfo(settings) {
  const s = { ...DEFAULTS, ...(settings || {}) };
  if (s.force_closed === 'true') return { open: false, text: 'Tutup sementara' };
  let days = [];
  try {
    days = JSON.parse(s.open_days || '[]');
  } catch {
    days = [];
  }
  const open = toMinutes(s.open_time);
  const close = toMinutes(s.close_time);
  if (open == null || close == null) return { open: false, text: 'Jam buka belum diatur' };
  const now = jakartaNow();
  const inRange = open <= close
    ? now.minutes >= open && now.minutes < close
    : now.minutes >= open || now.minutes < close;
  if (days.includes(now.day) && inRange) return { open: true, text: `Buka • Tutup ${s.close_time}` };
  // Cari hari buka terdekat untuk teks jujur.
  for (let i = 0; i < 8; i += 1) {
    const d = (now.day + i) % 7;
    if (!days.includes(d)) continue;
    if (i === 0 && now.minutes < open) return { open: false, text: `Tutup • Buka ${s.open_time}` };
    if (i > 0) return { open: false, text: `Tutup • Buka ${DAY_NAMES[d]} ${s.open_time}` };
    break;
  }
  return { open: false, text: 'Tutup' };
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULTS);
  const [status, setStatus] = useState(isSupabaseConfigured ? 'loading' : 'unconfigured');
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!supabase) {
      setStatus('unconfigured');
      setSettings(DEFAULTS);
      return;
    }
    setStatus('loading');
    setError('');
    const { data: outlet, error: outletError } = await supabase
      .from('outlets')
      .select('id')
      .eq('slug', OUTLET_SLUG)
      .maybeSingle();
    if (outletError || !outlet) {
      setStatus('error');
      setError('Outlet parangtritis belum ada — jalankan migrasi di Supabase.');
      setSettings(DEFAULTS);
      return;
    }
    const { data, error: listError } = await supabase
      .from('settings')
      .select('key,value')
      .eq('outlet_id', outlet.id);
    if (listError) {
      setStatus('error');
      setError(`Gagal memuat pengaturan: ${listError.message}`);
      setSettings(DEFAULTS);
      return;
    }
    const merged = { ...DEFAULTS };
    (data || []).forEach((row) => { merged[row.key] = row.value; });
    setSettings(merged);
    setStatus('ready');
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const save = useCallback(async (patch) => {
    if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
    try {
      const { data: outlet, error: outletError } = await supabase
        .from('outlets')
        .select('id')
        .eq('slug', OUTLET_SLUG)
        .single();
      if (outletError || !outlet) throw new Error('Outlet parangtritis belum ada — jalankan migrasi.');
      const rows = Object.entries(patch).map(([key, value]) => ({
        outlet_id: outlet.id,
        key,
        value: String(value),
      }));
      const { error: upsertError } = await supabase
        .from('settings')
        .upsert(rows, { onConflict: 'outlet_id,key' });
      if (upsertError) throw new Error(upsertError.message);
      await reload();
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message || 'Gagal menyimpan pengaturan.' };
    }
  }, [reload]);

  const value = useMemo(
    () => ({ settings, status, error, reload, save, configured: isSupabaseConfigured }),
    [settings, status, error, reload, save],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings harus dipakai di dalam SettingsProvider');
  return ctx;
}

import { supabase } from './supabase.js';

// Sesi kas POS. Rekonsiliasi diturunkan dari data otoritatif:
//   ekspektasi = modal awal + penjualan tunai lunas + penyesuaian.
// Lihat docs/POS-CASHIER.md.

const OUTLET_SLUG = 'parangtritis';

async function outletId() {
  const { data, error } = await supabase
    .from('outlets')
    .select('id')
    .eq('slug', OUTLET_SLUG)
    .single();
  if (error || !data) throw new Error('Outlet belum siap — jalankan migrasi.');
  return data.id;
}

async function actorId() {
  try {
    const { data } = await supabase.auth.getSession();
    return (data && data.session && data.session.user && data.session.user.id) || null;
  } catch {
    return null;
  }
}

export async function currentSession() {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  try {
    const oid = await outletId();
    const { data, error } = await supabase
      .from('cash_sessions')
      .select('*')
      .eq('outlet_id', oid)
      .eq('status', 'open')
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { ok: true, session: data || null };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function openSession(opening) {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  const amount = Math.round(Number(opening) || 0);
  if (amount < 0) return { ok: false, error: 'Modal awal tidak valid.' };
  try {
    const oid = await outletId();
    const actor = await actorId();
    const { data, error } = await supabase
      .from('cash_sessions')
      .insert({ outlet_id: oid, opened_by: actor, opening_amount_idr: amount })
      .select('*')
      .single();
    if (error) {
      if (/duplicate|unique/i.test(error.message)) return { ok: false, error: 'Masih ada sesi terbuka — tutup dulu.' };
      throw new Error(error.message);
    }
    return { ok: true, session: data };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

export async function sessionAdjustments(sessionId) {
  const { data, error } = await supabase
    .from('cash_transactions')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, items: data || [] };
}

export async function adjustCash(sessionId, kind, amount, reason) {
  const value = Math.round(Number(amount) || 0);
  if (value <= 0) return { ok: false, error: 'Nominal harus lebih dari 0.' };
  if (!reason || reason.trim().length < 3) return { ok: false, error: 'Alasan wajib diisi (audit).' };
  const actor = await actorId();
  const { error } = await supabase.from('cash_transactions').insert({
    session_id: sessionId,
    kind,
    amount_idr: value,
    reason: reason.trim().slice(0, 160),
    actor_id: actor,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

async function cashSalesTotal(outletId, since) {
  const { data, error } = await supabase
    .from('payments')
    .select('amount_idr,orders!inner(outlet_id,created_at)')
    .eq('method', 'cash')
    .eq('status', 'paid')
    .gte('orders.created_at', since);
  if (error) throw new Error(error.message);
  return (data || [])
    .filter((p) => p.orders && p.orders.outlet_id === outletId)
    .reduce((s, p) => s + (Number(p.amount_idr) || 0), 0);
}

export async function sessionSummary(session) {
  const adjRes = await sessionAdjustments(session.id);
  if (!adjRes.ok) return adjRes;
  const adjIn = adjRes.items.filter((t) => t.kind === 'in').reduce((s, t) => s + Number(t.amount_idr), 0);
  const adjOut = adjRes.items.filter((t) => t.kind === 'out').reduce((s, t) => s + Number(t.amount_idr), 0);
  const sales = await cashSalesTotal(session.outlet_id, session.opened_at);
  const expected = Number(session.opening_amount_idr) + sales + adjIn - adjOut;
  return { ok: true, sales, adjIn, adjOut, expected, adjustments: adjRes.items };
}

export async function closeSession(session, declared) {
  const value = Math.round(Number(declared));
  if (!Number.isFinite(value) || value < 0) return { ok: false, error: 'Nominal hitung kas tidak valid.' };
  const summary = await sessionSummary(session);
  if (!summary.ok) return summary;
  const actor = await actorId();
  const { error } = await supabase
    .from('cash_sessions')
    .update({
      status: 'closed',
      closing_amount_declared_idr: value,
      expected_amount_idr: summary.expected,
      variance_idr: value - summary.expected,
      closed_at: new Date().toISOString(),
      closed_by: actor,
    })
    .eq('id', session.id)
    .eq('status', 'open');
  if (error) return { ok: false, error: error.message };
  return { ok: true, expected: summary.expected, variance: value - summary.expected };
}

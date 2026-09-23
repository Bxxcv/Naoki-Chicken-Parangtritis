import { supabase } from './supabase.js';

// API pesanan sisi klien (MVP).
// - Harga/stok dibaca ulang dari database saat submit (bukan harga
//   keranjang), snapshot disimpan per item agar riwayat tak berubah.
// - Total otoritatif penuh (server-side calc) menyusul bersama
//   fungsi backend; sampai saat itu validasi CHECK di DB + RLS
//   adalah batas pengaman. Lihat docs/ORDER-PAYMENT-STATES.md.
// - Stok dikurangi saat order dibuat, dikembalikan saat dibatalkan.

const OUTLET_SLUG = 'parangtritis';

export const ORDER_TYPES = [
  ['dine_in', 'Makan di tempat'],
  ['takeaway', 'Bawa pulang'],
  ['pickup', 'Ambil sendiri'],
  ['delivery', 'Diantar'],
];

export const STATUS_LABEL = {
  pending: 'Baru',
  confirmed: 'Dikonfirmasi',
  preparing: 'Diproses',
  ready: 'Siap',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'completed',
};

export const NEXT_LABEL = {
  pending: 'Proses',
  confirmed: 'Masak',
  preparing: 'Siap',
  ready: 'Selesai',
};

function orderNumber() {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
  return `NK-${date}-${rand}`;
}

export function validateCustomer({ name, phone, address, type }) {
  if (!name || name.trim().length < 3) return 'Nama minimal 3 huruf.';
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length < 9 || digits.length > 15) return 'Nomor HP/WA tidak valid (9–15 digit).';
  if (type === 'delivery' && (!address || address.trim().length < 10)) {
    return 'Alamat pengantaran minimal 10 huruf.';
  }
  return '';
}

async function outletId() {
  const { data, error } = await supabase
    .from('outlets')
    .select('id')
    .eq('slug', OUTLET_SLUG)
    .single();
  if (error || !data) throw new Error('Outlet belum siap — jalankan migrasi database.');
  return data.id;
}

export async function createOrder({ customer, type, items, paymentMethod, notes }) {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  try {
    const oid = await outletId();

    // Harga + stok otoritatif dibaca ulang dari database.
    const ids = items.map((i) => i.id);
    const { data: rows, error: prodError } = await supabase
      .from('products')
      .select('id,name,price_idr,stock_qty,is_available')
      .in('id', ids);
    if (prodError) throw new Error(prodError.message);
    const byId = Object.fromEntries((rows || []).map((r) => [r.id, r]));

    const lines = [];
    for (const item of items) {
      const row = byId[item.id];
      if (!row || row.is_available === false) throw new Error(`"${item.name}" sudah tidak tersedia.`);
      const qty = Math.min(Math.max(1, Math.floor(item.qty)), 50);
      if ((Number(row.stock_qty) || 0) < qty) throw new Error(`Stok "${row.name}" tersisa ${row.stock_qty}.`);
      lines.push({
        product_id: row.id,
        product_name_snapshot: row.name,
        unit_price_idr: Number(row.price_idr) || 0,
        quantity: qty,
        line_total_idr: (Number(row.price_idr) || 0) * qty,
      });
    }
    if (lines.length === 0) throw new Error('Keranjang kosong.');

    const subtotal = lines.reduce((s, l) => s + l.line_total_idr, 0);
    const number = orderNumber();

    // Tautkan ke akun bila pembeli login (untuk halaman Riwayat).
    let userId = null;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = (sessionData && sessionData.session && sessionData.session.user && sessionData.session.user.id) || null;
    } catch {
      userId = null;
    }

    const { data: cust, error: custError } = await supabase
      .from('customers')
      .insert({ name: customer.name.trim(), phone: customer.phone.trim(), address: (customer.address || '').trim() })
      .select('id')
      .single();
    if (custError) throw new Error(custError.message);

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        outlet_id: oid,
        customer_id: cust.id,
        user_id: userId,
        order_number: number,
        order_type: type,
        order_status: 'pending',
        payment_status: 'unpaid',
        subtotal_idr: subtotal,
        total_idr: subtotal,
        notes: (notes || '').trim().slice(0, 200),
      })
      .select('id,order_number')
      .single();
    if (orderError) throw new Error(orderError.message);

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(lines.map((l) => ({ ...l, order_id: order.id })));
    if (itemsError) throw new Error(itemsError.message);

    await supabase.from('order_status_history').insert({
      order_id: order.id, from_status: null, to_status: 'pending',
    });
    await supabase.from('payments').insert({
      order_id: order.id, method: paymentMethod, status: 'unpaid', amount_idr: subtotal,
    });

    // Kurangi stok (finite). Race antar-pembeli diterima di MVP.
    for (const l of lines) {
      const row = byId[l.product_id];
      await supabase
        .from('products')
        .update({ stock_qty: Math.max(0, (Number(row.stock_qty) || 0) - l.quantity) })
        .eq('id', l.product_id);
    }

    return { ok: true, order_number: order.order_number, total: subtotal };
  } catch (err) {
    return { ok: false, error: err.message || 'Gagal membuat pesanan.' };
  }
}

export async function trackOrder(number) {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  const code = (number || '').trim().toUpperCase();
  if (!code) return { ok: false, error: 'Masukkan nomor pesanan.' };
  const { data, error } = await supabase
    .from('orders')
    .select('order_number,order_type,order_status,payment_status,total_idr,created_at,order_items(product_name_snapshot,quantity,unit_price_idr),order_status_history(to_status,created_at)')
    .eq('order_number', code)
    .maybeSingle();
  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: 'Nomor tidak ditemukan. Periksa kembali.' };
  return { ok: true, order: data };
}

export async function myOrders() {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData && sessionData.session && sessionData.session.user;
  if (!user) return { ok: false, error: 'Masuk dulu untuk melihat riwayat.' };
  const { data, error } = await supabase
    .from('orders')
    .select('order_number,order_type,order_status,payment_status,total_idr,created_at,order_items(product_name_snapshot,quantity,unit_price_idr)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return { ok: false, error: error.message };
  return { ok: true, orders: data || [] };
}

export async function kitchenQueue() {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', OUTLET_SLUG).maybeSingle();
  if (!outlet) return { ok: false, error: 'Outlet belum siap.' };
  const { data, error } = await supabase
    .from('orders')
    .select('id,order_number,order_type,order_status,created_at,customers(name),order_items(product_name_snapshot,quantity)')
    .eq('outlet_id', outlet.id)
    .in('order_status', ['pending', 'confirmed', 'preparing', 'ready'])
    .order('created_at', { ascending: true })
    .limit(60);
  if (error) return { ok: false, error: error.message };
  return { ok: true, orders: data || [] };
}

export async function advanceOrder(id, from, to) {
  const { error: updateError } = await supabase
    .from('orders')
    .update({ order_status: to })
    .eq('id', id)
    .eq('order_status', from);
  if (updateError) return { ok: false, error: updateError.message };
  await supabase.from('order_status_history').insert({ order_id: id, from_status: from, to_status: to });
  return { ok: true };
}

export async function cancelOrder(id) {
  const { data: items } = await supabase
    .from('order_items')
    .select('product_id,quantity')
    .eq('order_id', id);
  const { error } = await supabase
    .from('orders')
    .update({ order_status: 'cancelled' })
    .eq('id', id)
    .neq('order_status', 'completed');
  if (error) return { ok: false, error: error.message };
  // Kembalikan stok.
  for (const item of items || []) {
    if (!item.product_id) continue;
    const { data: prod } = await supabase
      .from('products')
      .select('stock_qty')
      .eq('id', item.product_id)
      .maybeSingle();
    if (prod) {
      await supabase
        .from('products')
        .update({ stock_qty: (Number(prod.stock_qty) || 0) + Number(item.quantity) })
        .eq('id', item.product_id);
    }
  }
  await supabase.from('order_status_history').insert({ order_id: id, from_status: null, to_status: 'cancelled' });
  return { ok: true };
}

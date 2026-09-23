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

// Ubah error teknis database menjadi bahasa manusia agar pembeli
// tidak bingung (contoh: RLS, tabel belum ada).
export function friendlyDbError(message) {
  const msg = message || 'Gagal memproses. Coba lagi.';
  if (/row-level security/i.test(msg)) {
    return 'Gagal menyimpan — sesi Anda tidak berhak. Keluar lalu masuk lagi, atau hubungi outlet.';
  }
  if (/does not exist|relation/i.test(msg)) {
    return 'Database belum siap — minta admin menjalankan migrasi.';
  }
  if (/duplicate|unique/i.test(msg)) {
    return 'Nomor bentrok, ulangi sekali lagi.';
  }
  return msg;
}

function orderNumber() {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
  return `NK-${date}-${rand}`;
}

export function validateCustomer({ name, phone, address, type }, opts) {
  const optionalPhone = opts && opts.phoneOptional === true;
  if (!name || name.trim().length < 3) return 'Nama minimal 3 huruf.';
  const digits = (phone || '').replace(/\D/g, '');
  if (!optionalPhone && (digits.length < 9 || digits.length > 15)) {
    return 'Nomor HP/WA tidak valid (9–15 digit).';
  }
  if (optionalPhone && digits.length > 0 && (digits.length < 9 || digits.length > 15)) {
    return 'Nomor HP/WA tidak valid (9–15 digit).';
  }
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

export async function createOrder({ customer, type, items, paymentMethod, notes, proofFile }) {
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

    // Bukti bayar QRIS wajib sudah dipilih (divalidasi di form).
    let proofUrl = '';
    if (paymentMethod === 'manual_qris') {
      if (!proofFile) throw new Error('Foto bukti bayar wajib diupload.');
      const ext = (proofFile.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 4);
      const path = `proofs/${number}.${ext}`;
      const { error: proofError } = await supabase.storage
        .from('payment-proofs')
        .upload(path, proofFile, { contentType: proofFile.type, upsert: true });
      if (proofError) throw new Error(`Upload bukti gagal: ${proofError.message}`);
      proofUrl = path;
    }

    await supabase.from('payments').insert({
      order_id: order.id, method: paymentMethod, status: 'unpaid', amount_idr: subtotal, proof_url: proofUrl || null,
    });

    // Kurangi stok (finite) + catat pergerakan penjualan.
    for (const l of lines) {
      const row = byId[l.product_id];
      const after = Math.max(0, (Number(row.stock_qty) || 0) - l.quantity);
      await supabase
        .from('products')
        .update({ stock_qty: after })
        .eq('id', l.product_id);
      await supabase.from('stock_movements').insert({
        outlet_id: oid,
        product_id: l.product_id,
        product_name_snapshot: l.product_name_snapshot,
        quantity_delta: -l.quantity,
        stock_after: after,
        reason: `penjualan ${number}`,
      });
    }

    return { ok: true, order_number: order.order_number, total: subtotal };
  } catch (err) {
    return { ok: false, error: friendlyDbError(err.message) };
  }
}

export async function trackOrder(number) {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  const code = (number || '').trim().toUpperCase();
  if (!code) return { ok: false, error: 'Masukkan nomor pesanan.' };
  const { data, error } = await supabase
    .from('orders')
    .select('order_number,order_type,order_status,payment_status,total_idr,created_at,order_items(product_name_snapshot,quantity,unit_price_idr),payments(method,status),order_status_history(to_status,created_at)')
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
    .select('order_number,order_type,order_status,payment_status,total_idr,created_at,order_items(product_name_snapshot,quantity,unit_price_idr),payments(method,status)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return { ok: false, error: error.message };
  return { ok: true, orders: data || [] };
}

export async function markPaid(id) {
  const { error: payError } = await supabase
    .from('payments')
    .update({ status: 'paid' })
    .eq('order_id', id);
  if (payError) return { ok: false, error: payError.message };
  const { error: orderError } = await supabase
    .from('orders')
    .update({ payment_status: 'paid' })
    .eq('id', id);
  if (orderError) return { ok: false, error: orderError.message };
  return { ok: true };
}

// Langganan perubahan status order. Kembalikan fungsi berhenti.
// Gagal diam-diam bila realtime tak aktif (tombol muat ulang tetap ada).
export function subscribeOrders(onChange) {
  try {
    if (!supabase) return () => {};
    const channel = supabase
      .channel('orders-status')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onChange)
      .subscribe();
    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // Abaikan.
      }
    };
  } catch {
    return () => {};
  }
}

// Arsipkan order selesai/dibatalkan: hilang dari operasional,
// tetap di database + laporan. Kembalikan dengan unarchiveOrder.
export async function archiveFinished(oid) {
  const { data: rows, error: listError } = await supabase
    .from('orders')
    .select('id')
    .eq('outlet_id', oid)
    .eq('is_archived', false)
    .in('order_status', ['completed', 'cancelled'])
    .limit(1000);
  if (listError) return { ok: false, error: listError.message };
  if (!rows || rows.length === 0) return { ok: true, count: 0 };
  const { error } = await supabase
    .from('orders')
    .update({ is_archived: true })
    .in('id', rows.map((r) => r.id));
  if (error) return { ok: false, error: error.message };
  return { ok: true, count: rows.length };
}

export async function unarchiveOrder(id) {
  const { error } = await supabase
    .from('orders')
    .update({ is_archived: false })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function kitchenQueue() {
  if (!supabase) return { ok: false, error: 'Backend belum terhubung.' };
  const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', OUTLET_SLUG).maybeSingle();
  if (!outlet) return { ok: false, error: 'Outlet belum siap.' };
  const { data, error } = await supabase
    .from('orders')
    .select('id,order_number,order_type,order_status,payment_status,created_at,customers(name),order_items(product_name_snapshot,quantity)')
    .eq('outlet_id', outlet.id)
    .eq('is_archived', false)
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
  // Kembalikan stok + catat.
  const { data: orderRow } = await supabase
    .from('orders')
    .select('outlet_id,order_number')
    .eq('id', id)
    .maybeSingle();
  for (const item of items || []) {
    if (!item.product_id) continue;
    const { data: prod } = await supabase
      .from('products')
      .select('stock_qty')
      .eq('id', item.product_id)
      .maybeSingle();
    if (prod) {
      const after = (Number(prod.stock_qty) || 0) + Number(item.quantity);
      await supabase
        .from('products')
        .update({ stock_qty: after })
        .eq('id', item.product_id);
      if (orderRow) {
        await supabase.from('stock_movements').insert({
          outlet_id: orderRow.outlet_id,
          product_id: item.product_id,
          product_name_snapshot: '',
          quantity_delta: Number(item.quantity),
          stock_after: after,
          reason: `pembatalan ${orderRow.order_number}`,
        });
      }
    }
  }
  await supabase.from('order_status_history').insert({ order_id: id, from_status: null, to_status: 'cancelled' });
  return { ok: true };
}

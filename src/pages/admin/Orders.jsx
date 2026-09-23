import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import FilterMenu, { FilterOption } from '../../components/admin/FilterMenu.jsx';
import { supabase } from '../../lib/supabase.js';
import { advanceOrder, cancelOrder, markPaid, archiveFinished, unarchiveOrder, NEXT_STATUS, NEXT_LABEL, STATUS_LABEL, ORDER_TYPES } from '../../lib/orders.js';
import { formatIDR } from '../../lib/cart.jsx';
import { IconPlus, IconSearch, IconFilter, IconCalendar, IconPayments, IconOrders } from '../../components/admin/icons.jsx';

const FILTERS = [
  ['Semua', null],
  ['Baru', ['pending']],
  ['Diproses', ['confirmed', 'preparing']],
  ['Siap', ['ready']],
  ['Selesai', ['completed']],
  ['Dibatalkan', ['cancelled']],
];

const DATE_FILTERS = [
  ['Semua waktu', null],
  ['Hari ini', 1],
  ['7 hari', 7],
  ['30 hari', 30],
];

const PAY_FILTERS = [
  ['Semua bayar', null],
  ['Tunai', 'cash'],
  ['QRIS', 'manual_qris'],
];

const TYPE_LABEL = Object.fromEntries(ORDER_TYPES);
const PAY_LABEL = { cash: 'Tunai', manual_qris: 'QRIS' };

// Bukti di bucket privat → tanda tangan URL 1 jam agar bisa dibuka.
function ProofLink({ url }) {
  const [href, setHref] = useState('');
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!url) return;
      if (/^https?:\/\//.test(url)) {
        if (alive) setHref(url);
        return;
      }
      if (!supabase) return;
      const { data } = await supabase.storage.from('payment-proofs').createSignedUrl(url, 3600);
      if (alive && data) setHref(data.signedUrl);
    })();
    return () => { alive = false; };
  }, [url]);
  if (!href) return <span>Bukti dimuat...</span>;
  return <a href={href} target="_blank" rel="noreferrer">Lihat bukti</a>;
}

function timeOf(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [outletId, setOutletId] = useState('');
  const [active, setActive] = useState('Semua');
  const [showArchived, setShowArchived] = useState(false);
  const [archiveMsg, setArchiveMsg] = useState('');
  const [dateRange, setDateRange] = useState('Semua waktu');
  const [payFilter, setPayFilter] = useState('Semua bayar');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError('Backend belum terhubung.');
      return;
    }
    setLoading(true);
    const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').maybeSingle();
    if (!outlet) {
      setLoading(false);
      setError('Outlet belum siap — jalankan migrasi.');
      return;
    }
    setOutletId(outlet.id);
    const { data, error: listError } = await supabase
      .from('orders')
      .select('id,order_number,order_type,order_status,payment_status,is_archived,total_idr,created_at,customers(name,phone),order_items(product_name_snapshot,quantity),payments(method,status,proof_url)')
      .eq('outlet_id', outlet.id)
      .order('created_at', { ascending: false })
      .limit(100);
    setLoading(false);
    if (listError) {
      setError(listError.message);
      setOrders([]);
      return;
    }
    setError('');
    setOrders(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onAdvance = async (order) => {
    const to = NEXT_STATUS[order.order_status];
    if (!to) return;
    setBusy(order.id);
    const res = await advanceOrder(order.id, order.order_status, to);
    setBusy('');
    if (!res.ok) setError(res.error);
    else load();
  };

  const onCancel = async (order) => {
    if (!window.confirm(`Batalkan ${order.order_number}? Stok dikembalikan.`)) return;
    setBusy(order.id);
    const res = await cancelOrder(order.id);
    setBusy('');
    if (!res.ok) setError(res.error);
    else load();
  };

  const onArchive = async () => {
    setArchiveMsg('');
    if (!window.confirm('Anda yakin untuk reset? Order Selesai + Dibatalkan disembunyikan (data tetap tersimpan untuk laporan).')) return;
    const res = await archiveFinished(outletId);
    if (!res.ok) {
      setArchiveMsg(res.error);
      return;
    }
    setArchiveMsg(res.count === 0 ? 'Tidak ada order selesai untuk diarsipkan.' : `${res.count} order diarsipkan. Data tetap tersimpan.`);
    load();
  };

  const onUnarchive = async (order) => {
    const res = await unarchiveOrder(order.id);
    if (!res.ok) setArchiveMsg(res.error);
    else load();
  };

  const onPaid = async (order) => {
    if (!window.confirm(`Tandai ${order.order_number} lunas?`)) return;
    setBusy(order.id);
    const res = await markPaid(order.id);
    setBusy('');
    if (!res.ok) setError(res.error);
    else load();
  };

  const statuses = (FILTERS.find((f) => f[0] === active) || [])[1];
  const days = (DATE_FILTERS.find((f) => f[0] === dateRange) || [])[1];
  const payMethod = (PAY_FILTERS.find((f) => f[0] === payFilter) || [])[1];
  const cutoff = days ? Date.now() - days * 24 * 60 * 60 * 1000 : 0;
  const filtered = orders.filter((o) => {
    if (!showArchived && o.is_archived) return false;
    if (showArchived && !o.is_archived) return false;
    const matchStatus = !statuses || statuses.includes(o.order_status);
    const matchDate = !days || new Date(o.created_at).getTime() >= cutoff;
    const method = (o.payments && o.payments[0] && o.payments[0].method) || 'cash';
    const matchPay = !payMethod || method === payMethod;
    const q = search.trim().toLowerCase();
    const matchSearch = !q
      || o.order_number.toLowerCase().includes(q)
      || ((o.customers && o.customers.name) || '').toLowerCase().includes(q);
    return matchStatus && matchDate && matchPay && matchSearch;
  });
  const filteredTotal = filtered
    .filter((o) => o.order_status !== 'cancelled')
    .reduce((s, o) => s + (Number(o.total_idr) || 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="Operasional outlet"
        title="Pesanan"
        actions={
          <>
            <button type="button" className="btn-outline" onClick={onArchive}>Arsipkan selesai</button>
            <button
              type="button"
              className="btn-outline"
              aria-pressed={showArchived}
              onClick={() => setShowArchived((v) => !v)}
            >
              {showArchived ? 'Sembunyikan arsip' : 'Lihat arsip'}
            </button>
            <Link to="/admin/pos" className="btn-primary"><IconPlus size={17} /> Tambah</Link>
            <Link to="/" className="btn-outline">Lihat toko</Link>
          </>
        }
      />

      <div className="admin-body">
        {archiveMsg && <p className="panel-desc" role="status">{archiveMsg}</p>}
        <section className="panel">
          <div className="filter-bar">
            <label className="search-field">
              <IconSearch size={17} />
              <input
                type="search"
                placeholder="Cari nomor atau nama pelanggan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="visually-hidden">Cari pesanan</span>
            </label>
            <button type="button" className="btn-outline" onClick={load} disabled={loading}>
              <IconFilter size={16} /> Muat ulang
            </button>
          </div>

          <div className="filter-bar">
            <FilterMenu
              icon={IconFilter}
              label="Filter status pesanan"
              active={active !== 'Semua'}
              activeLabel={active !== 'Semua' ? active : ''}
            >
              {FILTERS.map(([filter]) => (
                <FilterOption key={filter} selected={active === filter} onSelect={() => setActive(filter)}>
                  {filter}
                </FilterOption>
              ))}
            </FilterMenu>
            <FilterMenu
              icon={IconCalendar}
              label="Filter tanggal"
              active={dateRange !== 'Semua waktu'}
              activeLabel={dateRange !== 'Semua waktu' ? dateRange : ''}
            >
              {DATE_FILTERS.map(([label]) => (
                <FilterOption key={label} selected={dateRange === label} onSelect={() => setDateRange(label)}>
                  {label}
                </FilterOption>
              ))}
            </FilterMenu>
            <FilterMenu
              icon={IconPayments}
              label="Filter pembayaran"
              active={payFilter !== 'Semua bayar'}
              activeLabel={payFilter !== 'Semua bayar' ? payFilter : ''}
            >
              {PAY_FILTERS.map(([label]) => (
                <FilterOption key={label} selected={payFilter === label} onSelect={() => setPayFilter(label)}>
                  {label}
                </FilterOption>
              ))}
            </FilterMenu>
          </div>

          {!loading && !error && (
            <p className="panel-desc">
              <strong>{filtered.length}</strong> pesanan • Transaksi {formatIDR(filteredTotal)}
            </p>
          )}

          {loading ? (
            <EmptyState
              icon={<IconOrders size={26} />}
              title="Memuat pesanan..."
              desc="Mengambil data terbaru dari database."
            />
          ) : error ? (
            <EmptyState
              icon={<IconOrders size={26} />}
              title="Pesanan tidak dapat dimuat"
              desc={error}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<IconOrders size={26} />}
              title="Belum ada pesanan"
              desc="Pesanan online dan kasir akan terkumpul di sini untuk diproses."
            />
          ) : (
            <div className="stack">
              {filtered.map((o) => {
                const pay = (o.payments && o.payments[0]) || {};
                return (
                <article className="kitchen-card" key={o.id}>
                  <div className="kitchen-card-head">
                    <strong>{o.order_number}</strong>
                    <span className={`status-badge ${o.order_status === 'cancelled' ? 'badge-danger' : o.order_status === 'completed' ? 'badge-muted' : 'badge-success'}`}>
                      {STATUS_LABEL[o.order_status] || o.order_status}
                    </span>
                  </div>
                  <p className="kitchen-customer">
                    {(o.customers && o.customers.name) || 'Tamu'}
                    {(o.customers && o.customers.phone) ? ` • ${o.customers.phone}` : ''}
                    {' • '}{TYPE_LABEL[o.order_type] || o.order_type}
                    {' • '}{timeOf(o.created_at)}
                  </p>
                  <ul className="kitchen-items">
                    {(o.order_items || []).map((item, i) => (
                      <li key={i}>{item.quantity}× {item.product_name_snapshot}</li>
                    ))}
                  </ul>
                  <p className="kitchen-customer">
                    {PAY_LABEL[pay.method] || 'Tunai'} • {o.payment_status === 'paid' ? 'Lunas' : 'Belum bayar'}
                    {pay.proof_url ? (<> • <ProofLink url={pay.proof_url} /></>) : null}
                  </p>
                  <div className="kitchen-card-head">
                    <span className="cart-note">Total {formatIDR(o.total_idr)}</span>
                    {o.is_archived ? (
                      <div className="kitchen-actions" style={{ marginTop: 0 }}>
                        <button
                          type="button"
                          className="btn-outline btn-sm"
                          onClick={() => onUnarchive(o)}
                        >
                          Kembalikan
                        </button>
                      </div>
                    ) : (
                    <div className="kitchen-actions" style={{ marginTop: 0 }}>
                      {NEXT_STATUS[o.order_status] && (
                        <button
                          type="button"
                          className="btn-primary btn-sm"
                          disabled={busy === o.id}
                          onClick={() => onAdvance(o)}
                        >
                          {NEXT_LABEL[o.order_status]}
                        </button>
                      )}
                      {o.payment_status !== 'paid' && o.order_status !== 'cancelled' && (
                        <button
                          type="button"
                          className="btn-outline btn-sm"
                          disabled={busy === o.id}
                          onClick={() => onPaid(o)}
                        >
                          Tandai lunas
                        </button>
                      )}
                      {!['completed', 'cancelled'].includes(o.order_status) && (
                        <button
                          type="button"
                          className="btn-outline btn-sm btn-danger"
                          disabled={busy === o.id}
                          onClick={() => onCancel(o)}
                        >
                          Batal
                        </button>
                      )}
                    </div>
                    )}
                  </div>
                </article>
                );
              })}
            </div>
          )}
        </section>

      </div>
    </>
  );
}

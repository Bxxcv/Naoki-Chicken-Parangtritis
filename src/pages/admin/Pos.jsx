import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { useProducts, isEmpty } from '../../lib/products.jsx';
import { useSettings } from '../../lib/settings.jsx';
import { formatIDR } from '../../lib/cart.jsx';
import { formatRibuan, parseRupiah } from '../../lib/money.js';
import { ORDER_TYPES, validateCustomer, createOrder, advanceOrder, markPaid } from '../../lib/orders.js';
import { currentSession, openSession, adjustCash, sessionSummary, closeSession } from '../../lib/cash.js';
import { IconPlus, IconSearch, IconBox } from '../../components/admin/icons.jsx';

const TYPE_LABEL = Object.fromEntries(ORDER_TYPES);

// Kasir: order konter + sesi kas + rekonsiliasi. Diskon menyusul
// (butuh aturan promosi resmi). Lihat docs/POS-CASHIER.md.
export default function Pos() {
  const { products } = useProducts();
  const { settings } = useSettings();
  const [session, setSession] = useState(null);
  const [summary, setSummary] = useState(null);
  const [sessionError, setSessionError] = useState('');
  const [opening, setOpening] = useState('');
  const [declared, setDeclared] = useState('');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjKind, setAdjKind] = useState('out');
  const [adjReason, setAdjReason] = useState('');
  const [adjError, setAdjError] = useState('');
  const [closed, setClosed] = useState(null);

  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Semua');
  const [cart, setCart] = useState({});
  const [type, setType] = useState('takeaway');
  const [payment, setPayment] = useState('cash');
  const [customer, setCustomer] = useState('Pelanggan');
  const [cashReceived, setCashReceived] = useState('');
  const [orderError, setOrderError] = useState('');
  const [sending, setSending] = useState(false);
  const [receipt, setReceipt] = useState('');

  const loadSession = useCallback(async () => {
    const res = await currentSession();
    if (!res.ok) {
      setSessionError(res.error);
      setSession(null);
      return;
    }
    setSessionError('');
    setSession(res.session);
    if (res.session) {
      const sum = await sessionSummary(res.session);
      if (sum.ok) setSummary(sum);
    } else {
      setSummary(null);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const cats = useMemo(() => {
    const set = new Set(products.map((p) => p.category || 'Lainnya'));
    return ['Semua', ...[...set].sort()];
  }, [products]);

  const list = products.filter((p) => {
    const matchCat = cat === 'Semua' || (p.category || 'Lainnya') === cat;
    return matchCat && `${p.name}`.toLowerCase().includes(search.trim().toLowerCase());
  });

  const lines = useMemo(
    () => Object.entries(cart)
      .map(([id, qty]) => ({ product: products.find((p) => p.id === id), qty }))
      .filter((l) => l.product && l.qty > 0),
    [cart, products],
  );
  const total = lines.reduce((s, l) => s + Number(l.product.price) * l.qty, 0);

  const addLine = (id) => setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const setLine = (id, qty) => setCart((prev) => {
    if (qty <= 0) {
      const next = { ...prev };
      delete next[id];
      return next;
    }
    return { ...prev, [id]: qty };
  });

  const onRupiah = (setter) => (e) => setter(e.target.value.replace(/\D/g, '').slice(0, 13));

  const onOpen = async () => {
    const res = await openSession(opening);
    if (!res.ok) {
      setSessionError(res.error);
      return;
    }
    setOpening('');
    setClosed(null);
    loadSession();
  };

  const onAdjust = async () => {
    if (!session) return;
    const res = await adjustCash(session.id, adjKind, adjAmount, adjReason);
    if (!res.ok) {
      setAdjError(res.error);
      return;
    }
    setAdjError('');
    setAdjAmount('');
    setAdjReason('');
    loadSession();
  };

  const onClose = async () => {
    if (!session) return;
    if (!window.confirm('Tutup sesi kas ini?')) return;
    const res = await closeSession(session, declared);
    if (!res.ok) {
      setSessionError(res.error);
      return;
    }
    setClosed(res);
    setDeclared('');
    loadSession();
  };

  const onComplete = async () => {
    if (lines.length === 0) {
      setOrderError('Keranjang masih kosong.');
      return;
    }
    const invalid = validateCustomer(
      { name: customer, phone: '', address: '', type },
      { phoneOptional: true },
    );
    if (invalid) {
      setOrderError(invalid);
      return;
    }
    if (payment === 'cash') {
      const received = parseRupiah(cashReceived);
      if (received < total) {
        setOrderError(`Tunai kurang ${formatIDR(total - received)}.`);
        return;
      }
    }
    setSending(true);
    const res = await createOrder({
      customer: { name: customer.trim() || 'Pelanggan', phone: '', address: '' },
      type,
      items: lines.map((l) => ({ id: l.product.id, name: l.product.name, qty: l.qty })),
      paymentMethod: payment,
      notes: 'POS konter',
    });
    if (!res.ok) {
      setSending(false);
      setOrderError(res.error);
      return;
    }
    // Jalur kasir: order langsung selesai + lunas (docs/ORDER-PAYMENT-STATES.md).
    try {
      const { supabase } = await import('../../lib/supabase.js');
      const { data: order } = await supabase
        .from('orders')
        .select('id,order_status')
        .eq('order_number', res.order_number)
        .single();
      if (order) {
        for (const to of ['confirmed', 'preparing', 'ready', 'completed']) {
          await advanceOrder(order.id, order.order_status, to);
          order.order_status = to;
        }
        await markPaid(order.id);
      }
    } catch {
      // Order tercatat; penyelesaian manual via Pesanan/Dapur.
    }
    setSending(false);
    setReceipt({ number: res.order_number, change: payment === 'cash' ? parseRupiah(cashReceived) - total : 0 });
    setCart({});
    setCashReceived('');
    loadSession();
  };

  const channels = ORDER_TYPES.filter(([key]) => settings[key] !== 'false');

  return (
    <>
      <PageHeader
        eyebrow="Kasir outlet"
        title="POS / Kasir"
        actions={<button type="button" className="btn-outline" onClick={loadSession}>Muat ulang</button>}
      />

      <div className="admin-body">
        {sessionError && <p className="form-error" role="alert">{sessionError}</p>}
        {closed && (
          <div className="alert-bar alert-bar--ok" role="status">
            Sesi ditutup. Ekspektasi {formatIDR(closed.expected)} • Selisih {formatIDR(closed.variance)}.
          </div>
        )}

        <section className="panel">
          <div className="panel-head">
            <h3>Sesi kas</h3>
            <span className="panel-meta">{session ? 'Terbuka' : 'Tidak ada sesi terbuka'}</span>
          </div>
          {!session ? (
            <div className="filter-bar">
              <label className="search-field" style={{ maxWidth: 260 }}>
                <span style={{ color: 'var(--a-muted)', fontWeight: 600, fontSize: '.87rem' }}>Rp</span>
                <span className="visually-hidden">Modal awal</span>
                <input
                  type="text" inputMode="numeric" placeholder="Modal awal"
                  value={formatRibuan(opening)} onChange={onRupiah(setOpening)}
                />
              </label>
              <button type="button" className="btn-primary" onClick={onOpen}>Buka sesi</button>
            </div>
          ) : (
            <>
              <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
                <div className="stat-card"><span className="stat-label">Modal awal</span><span className="stat-value" style={{ fontSize: '1.2rem' }}>{formatIDR(session.opening_amount_idr)}</span></div>
                <div className="stat-card"><span className="stat-label">Tunai lunas</span><span className="stat-value" style={{ fontSize: '1.2rem' }}>{formatIDR((summary && summary.sales) || 0)}</span></div>
                <div className="stat-card"><span className="stat-label">Ekspektasi</span><span className="stat-value" style={{ fontSize: '1.2rem' }}>{formatIDR((summary && summary.expected) || 0)}</span></div>
              </div>
              <div className="filter-bar" style={{ marginTop: 14 }}>
                <select className="filter-select" value={adjKind} onChange={(e) => setAdjKind(e.target.value)} aria-label="Jenis penyesuaian">
                  <option value="out">Kas keluar</option>
                  <option value="in">Kas masuk</option>
                </select>
                <label className="search-field" style={{ maxWidth: 200 }}>
                  <span style={{ color: 'var(--a-muted)', fontWeight: 600, fontSize: '.87rem' }}>Rp</span>
                  <span className="visually-hidden">Nominal</span>
                  <input type="text" inputMode="numeric" placeholder="Nominal" value={formatRibuan(adjAmount)} onChange={onRupiah(setAdjAmount)} />
                </label>
                <label className="search-field">
                  <span className="visually-hidden">Alasan</span>
                  <input type="text" placeholder="Alasan (wajib)" value={adjReason} onChange={(e) => setAdjReason(e.target.value)} maxLength={160} />
                </label>
                <button type="button" className="btn-outline" onClick={onAdjust}>Catat</button>
              </div>
              {adjError && <p className="form-error" role="alert">{adjError}</p>}
              <div className="filter-bar">
                <label className="search-field" style={{ maxWidth: 260 }}>
                  <span style={{ color: 'var(--a-muted)', fontWeight: 600, fontSize: '.87rem' }}>Rp</span>
                  <span className="visually-hidden">Hitung kas fisik</span>
                  <input type="text" inputMode="numeric" placeholder="Hitung kas fisik" value={formatRibuan(declared)} onChange={onRupiah(setDeclared)} />
                </label>
                <button type="button" className="btn-primary" onClick={onClose}>Tutup &amp; rekonsiliasi</button>
              </div>
              {summary && summary.adjustments.length > 0 && (
                <ul className="legend-list">
                  {summary.adjustments.slice(0, 5).map((t) => (
                    <li key={t.id}>
                      <span>{t.kind === 'in' ? 'Masuk' : 'Keluar'} — {t.reason}</span>
                      <strong>{t.kind === 'in' ? '+' : '-'}{formatIDR(t.amount_idr)}</strong>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>

        <div className="grid-2">
          <section className="panel">
            <div className="panel-head"><h3>Produk</h3></div>
            <div className="filter-bar">
              <label className="search-field">
                <IconSearch size={17} />
                <input type="search" placeholder="Cari produk..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <span className="visually-hidden">Cari produk</span>
              </label>
            </div>
            <div className="chip-row" role="tablist" aria-label="Kategori produk">
              {cats.map((c) => (
                <button
                  key={c} type="button" role="tab" aria-selected={cat === c}
                  className={`chip${cat === c ? ' is-active' : ''}`}
                  onClick={() => setCat(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            {list.length === 0 ? (
              <EmptyState icon={<IconBox size={26} />} title="Tidak ada produk" desc="Tambah produk di halaman Produk." />
            ) : (
              <div className="pos-grid">
                {list.map((p) => {
                  const empty = isEmpty(p);
                  return (
                    <button
                      key={p.id} type="button" className="pos-item"
                      disabled={empty} onClick={() => addLine(p.id)}
                    >
                      <strong>{p.name}</strong>
                      <span>{formatIDR(p.price)}</span>
                      <small>{empty ? 'Habis' : `Stok ${p.stock}`}</small>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="panel">
            <div className="panel-head"><h3>Pesanan konter</h3><span className="panel-meta">{lines.length} item</span></div>
            {lines.length === 0 ? (
              <EmptyState icon={<IconPlus size={26} />} title="Keranjang kosong" desc="Ketuk produk untuk menambah." />
            ) : (
              <ul className="legend-list">
                {lines.map((l) => (
                  <li key={l.product.id}>
                    <span>{l.product.name} × {l.qty}</span>
                    <span>
                      <button type="button" className="icon-btn" aria-label={`Kurangi ${l.product.name}`} onClick={() => setLine(l.product.id, l.qty - 1)}>−</button>
                      {' '}
                      <button type="button" className="icon-btn" aria-label={`Tambah ${l.product.name}`} onClick={() => setLine(l.product.id, l.qty + 1)}>+</button>
                      {' '}<strong>{formatIDR(Number(l.product.price) * l.qty)}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="form-grid" style={{ marginTop: 14 }}>
              <label className="form-field">
                <span>Nama pelanggan</span>
                <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} maxLength={60} />
              </label>
              <label className="form-field">
                <span>Tipe</span>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  {channels.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                </select>
              </label>
            </div>
            <div className="chip-row" role="radiogroup" aria-label="Pembayaran" style={{ marginTop: 12 }}>
              {[['cash', 'Tunai'], ['manual_qris', 'QRIS']].map(([key, label]) => (
                <button
                  key={key} type="button" role="radio" aria-checked={payment === key}
                  className={`chip${payment === key ? ' is-active' : ''}`}
                  onClick={() => setPayment(key)}
                >
                  {label}
                </button>
              ))}
            </div>
            {payment === 'cash' && lines.length > 0 && (
              <>
                <label className="form-field" style={{ marginTop: 12 }}>
                  <span>Tunai diterima (Rp)</span>
                  <div className="input-rp">
                    <span aria-hidden="true">Rp</span>
                    <input
                      type="text" inputMode="numeric"
                      value={formatRibuan(cashReceived)}
                      onChange={onRupiah(setCashReceived)}
                      placeholder="50.000"
                    />
                  </div>
                </label>
                <p className="panel-desc" style={{ marginTop: 8 }}>
                  Kembalian: <strong>{formatIDR(Math.max(0, parseRupiah(cashReceived) - total))}</strong>
                </p>
              </>
            )}
            {orderError && <p className="form-error" role="alert">{orderError}</p>}
            {receipt && (
              <p className="panel-desc" role="status">
                <strong>Selesai:</strong> {receipt.number}
                {receipt.change > 0 ? (<> • Kembalian {formatIDR(receipt.change)}</>) : ' • Uang pas'}
              </p>
            )}
            <div className="form-actions">
              <button type="button" className="btn-primary" disabled={sending || lines.length === 0} onClick={onComplete}>
                {sending ? 'Memproses...' : `Selesaikan • ${formatIDR(total)}`}
              </button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

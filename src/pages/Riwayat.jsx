import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/customer/BrandLogo.jsx';
import { useAuth } from '../lib/auth.jsx';
import { myOrders, subscribeOrders, STATUS_LABEL } from '../lib/orders.js';
import { formatIDR } from '../lib/cart.jsx';
import { IconBox, IconArrowRight } from '../components/customer/icons.jsx';

const FILTERS = [
  ['Semua', null],
  ['Aktif', ['pending', 'confirmed', 'preparing', 'ready']],
  ['Selesai', ['completed']],
  ['Dibatalkan', ['cancelled']],
];

const PAY_LABEL = { cash: 'Tunai', manual_qris: 'QRIS' };
const PAY_STATUS = { unpaid: 'Belum bayar', pending: 'Diproses', paid: 'Lunas', failed: 'Gagal', expired: 'Kadaluarsa', refunded: 'Refund' };

function timeOf(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Riwayat pesanan milik akun yang login.
export default function Riwayat() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [state, setState] = useState('loading');
  const [error, setError] = useState('');

  const [filter, setFilter] = useState('Semua');
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    setState('loading');
    const res = await myOrders();
    if (!res.ok) {
      setState('error');
      setError(res.error);
      setOrders([]);
      return;
    }
    setOrders(res.orders);
    setState('ready');
  }, []);

  useEffect(() => {
    if (!loading && user) load();
    if (!loading && !user) setState('empty');
  }, [loading, user, load]);

  // Status real-time: muat ulang saat ada perubahan order.
  useEffect(() => {
    if (!user) return undefined;
    return subscribeOrders(() => load());
  }, [user, load]);

  const statuses = (FILTERS.find((f) => f[0] === filter) || [])[1];
  const visible = !statuses ? orders : orders.filter((o) => statuses.includes(o.order_status));

  return (
    <div className="customer-shell">
      <header className="site-nav">
        <div className="shell-container site-nav-inner">
          <BrandLogo />
          <Link to="/" className="nav-back">← Beranda</Link>
        </div>
      </header>

      <main className="shell-container menu-page-body">
        <span className="eyebrow eyebrow--red">Pesanan Anda</span>
        <h1>Riwayat</h1>
        <p className="menu-page-sub">Semua pesanan akun ini, terbaru di atas.</p>

        {state === 'loading' && <p className="section-note">Memuat riwayat...</p>}

        {state === 'empty' && (
          <div className="menu-empty">
            <span className="menu-empty-icon"><IconBox size={26} /></span>
            <h2>Belum masuk</h2>
            <p>Masuk dengan Google agar pesanan tersimpan di sini.</p>
            <Link to="/masuk" className="btn-gold" style={{ marginTop: 12 }}>Masuk <IconArrowRight size={16} /></Link>
          </div>
        )}

        {state === 'error' && (
          <div className="menu-empty">
            <span className="menu-empty-icon"><IconBox size={26} /></span>
            <h2>Riwayat tidak dapat dimuat</h2>
            <p>{error}</p>
            <button type="button" className="btn-outline btn-sm" style={{ marginTop: 12 }} onClick={load}>
              Coba lagi
            </button>
          </div>
        )}

        {state === 'ready' && orders.length === 0 && (
          <div className="menu-empty">
            <span className="menu-empty-icon"><IconBox size={26} /></span>
            <h2>Belum ada pesanan</h2>
            <p>Pesanan dengan akun ini akan tercatat di sini.</p>
            <Link to="/menu" className="btn-gold" style={{ marginTop: 12 }}>Pesan sekarang <IconArrowRight size={16} /></Link>
          </div>
        )}

        {state === 'ready' && orders.length > 0 && (
          <>
            <div className="cat-tabs" role="tablist" aria-label="Filter status riwayat">
              {FILTERS.map(([label]) => (
                <button
                  key={label}
                  type="button"
                  role="tab"
                  aria-selected={filter === label}
                  className={`cat-tab${filter === label ? ' is-active' : ''}`}
                  onClick={() => setFilter(label)}
                >
                  {label}
                </button>
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="section-note">Tidak ada pesanan pada filter ini.</p>
            ) : (
              <div className="menu-page-grid">
                {visible.map((o) => {
                  const pay = (o.payments && o.payments[0]) || {};
                  const steps = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
                  const currentIdx = steps.indexOf(o.order_status);
                  const open = expanded === o.order_number;
                  return (
                    <article className="menu-card" key={o.order_number}>
                      <div className="menu-body">
                        <div className="menu-head">
                          <h3>{o.order_number}</h3>
                          <span className={`status-badge ${o.order_status === 'cancelled' ? 'badge-danger' : o.order_status === 'completed' ? 'badge-muted' : 'badge-success'}`}>
                            {STATUS_LABEL[o.order_status] || o.order_status}
                          </span>
                        </div>
                        <p className="menu-desc">
                          {(o.order_items || []).map((i) => `${i.quantity}× ${i.product_name_snapshot}`).join(', ')}
                        </p>
                        <p className="cart-note">
                          {PAY_LABEL[pay.method] || 'Tunai'} • {PAY_STATUS[pay.status] || o.payment_status}
                        </p>
                        <div className="menu-head">
                          <span className="cart-note">{timeOf(o.created_at)}</span>
                          <span className="menu-price">{formatIDR(o.total_idr)}</span>
                        </div>
                        <button
                          type="button"
                          className="cart-clear"
                          style={{ textAlign: 'left', marginTop: 6 }}
                          aria-expanded={open}
                          onClick={() => setExpanded(open ? null : o.order_number)}
                        >
                          {open ? 'Tutup detail' : 'Lihat detail'}
                        </button>
                        {open && o.order_status !== 'cancelled' && (
                          <ol className="track-timeline">
                            {steps.map((s, i) => (
                              <li key={s} className={i < currentIdx ? 'is-done' : i === currentIdx ? 'is-now' : ''}>
                                {STATUS_LABEL[s]}
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

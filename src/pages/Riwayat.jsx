import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/customer/BrandLogo.jsx';
import { useAuth } from '../lib/auth.jsx';
import { myOrders, STATUS_LABEL } from '../lib/orders.js';
import { formatIDR } from '../lib/cart.jsx';
import { IconBox, IconArrowRight } from '../components/customer/icons.jsx';

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
          <div className="menu-page-grid">
            {orders.map((o) => (
              <article className="menu-card" key={o.order_number}>
                <div className="menu-body">
                  <div className="menu-head">
                    <h3>{o.order_number}</h3>
                    <span className="status-badge badge-success">{STATUS_LABEL[o.order_status] || o.order_status}</span>
                  </div>
                  <p className="menu-desc">
                    {(o.order_items || []).map((i) => `${i.quantity}× ${i.product_name_snapshot}`).join(', ')}
                  </p>
                  <div className="menu-head">
                    <span className="cart-note">{timeOf(o.created_at)}</span>
                    <span className="menu-price">{formatIDR(o.total_idr)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

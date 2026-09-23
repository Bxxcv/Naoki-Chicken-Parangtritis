import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { kitchenQueue, advanceOrder, cancelOrder, NEXT_STATUS, NEXT_LABEL, ORDER_TYPES } from '../../lib/orders.js';
import { IconBox } from '../../components/admin/icons.jsx';

// Antrean dibaca dari database. Dapur hanya boleh memajukan status /
// membatalkan — tanpa sentuh harga/pembayaran (docs/USER-FLOWS.md).
const COLUMNS = [
  { statuses: ['pending'], label: 'Baru', tone: 'new' },
  { statuses: ['confirmed', 'preparing'], label: 'Diproses', tone: 'progress' },
  { statuses: ['ready'], label: 'Siap', tone: 'ready' },
  { statuses: ['completed'], label: 'Selesai', tone: 'done' },
];

const TYPE_LABEL = Object.fromEntries(ORDER_TYPES);

function timeOf(iso) {
  try {
    return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export default function Kitchen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const res = await kitchenQueue();
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      setOrders([]);
      return;
    }
    setError('');
    setOrders(res.orders);
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
    if (!res.ok) {
      setError(res.error);
      return;
    }
    load();
  };

  const onCancel = async (order) => {
    if (!window.confirm(`Batalkan ${order.order_number}? Stok dikembalikan.`)) return;
    setBusy(order.id);
    const res = await cancelOrder(order.id);
    setBusy('');
    if (!res.ok) {
      setError(res.error);
      return;
    }
    load();
  };

  return (
    <>
      <PageHeader
        eyebrow="Tampilan produksi"
        title="Dapur"
        actions={
          <>
            <button type="button" className="btn-outline" onClick={load} disabled={loading}>
              {loading ? 'Memuat...' : 'Muat ulang'}
            </button>
            <Link to="/" className="btn-outline">Lihat toko</Link>
          </>
        }
      />

      <div className="admin-body">
        <div className="kitchen-head">
          <p>Pesanan diperbarui berdasarkan status operasional.</p>
          <span className="kitchen-ready"><i className="dot dot--ready" /> Siap menerima</span>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        {loading ? (
          <EmptyState
            icon={<IconBox size={26} />}
            title="Memuat antrean..."
            desc="Mengambil pesanan aktif dari database."
          />
        ) : (
          <div className="kitchen-board">
            {COLUMNS.map(({ statuses, label, tone }) => {
              const list = orders.filter((o) => statuses.includes(o.order_status));
              return (
                <section className="panel kitchen-col" key={label}>
                  <div className="panel-head">
                    <h3><i className={`dot dot--${tone}`} /> {label}</h3>
                    <span className="panel-meta">{list.length}</span>
                  </div>
                  {list.length === 0 ? (
                    <div className="empty-state empty-state--dashed kitchen-empty">
                      <p className="empty-state-desc">Belum ada pesanan</p>
                    </div>
                  ) : (
                    <div className="stack">
                      {list.map((o) => (
                        <article className="kitchen-card" key={o.id}>
                          <div className="kitchen-card-head">
                            <strong>{o.order_number}</strong>
                            <span>{timeOf(o.created_at)}</span>
                          </div>
                          <p className="kitchen-customer">
                            {(o.customers && o.customers.name) || 'Tamu'} • {TYPE_LABEL[o.order_type] || o.order_type}
                          </p>
                          <ul className="kitchen-items">
                            {(o.order_items || []).map((item, i) => (
                              <li key={i}>{item.quantity}× {item.product_name_snapshot}</li>
                            ))}
                          </ul>
                          <div className="kitchen-actions">
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
                            {o.order_status !== 'completed' && (
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
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

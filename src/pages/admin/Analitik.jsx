import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { supabase } from '../../lib/supabase.js';
import { IconAnalytics } from '../../components/admin/icons.jsx';

// Analitik dari transaksi nyata (tanpa library grafik):
// sebaran jam order + corong status. Detail angka ada di Laporan.
const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const FUNNEL = [
  ['pending', 'Masuk'],
  ['confirmed', 'Dikonfirmasi'],
  ['preparing', 'Diproses'],
  ['ready', 'Siap'],
  ['completed', 'Selesai'],
];

export default function Analitik() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError('Backend belum terhubung.');
      return;
    }
    setLoading(true);
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').maybeSingle();
    if (!outlet) {
      setLoading(false);
      setError('Outlet belum siap — jalankan migrasi.');
      return;
    }
    const { data, error: listError } = await supabase
      .from('orders')
      .select('order_status,created_at')
      .eq('outlet_id', outlet.id)
      .gte('created_at', since)
      .limit(2000);
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

  const perHour = HOURS.map((h) => ({
    h,
    count: orders.filter((o) => new Date(o.created_at).getHours() === h).length,
  }));
  const maxHour = Math.max(1, ...perHour.map((r) => r.count));

  const funnel = FUNNEL.map(([key, label]) => ({
    label,
    count: orders.filter((o) => o.order_status === key).length,
  }));
  const funnelMax = Math.max(1, ...funnel.map((f) => f.count));

  return (
    <>
      <PageHeader
        eyebrow="Wawasan outlet"
        title="Analitik"
        actions={<button type="button" className="btn-outline" onClick={load} disabled={loading}>Muat ulang</button>}
      />

      <div className="admin-body">
        {loading ? (
          <section className="panel">
            <EmptyState icon={<IconAnalytics size={26} />} title="Memuat..." desc="Menghitung dari transaksi 30 hari." />
          </section>
        ) : error ? (
          <section className="panel">
            <EmptyState icon={<IconAnalytics size={26} />} title="Tidak dapat dimuat" desc={error} />
          </section>
        ) : orders.length === 0 ? (
          <section className="panel">
            <EmptyState icon={<IconAnalytics size={26} />} title="Belum ada data" desc="Grafik terisi otomatis setelah ada transaksi." />
          </section>
        ) : (
          <div className="grid-2">
            <section className="panel">
              <div className="panel-head"><h3>Order per jam</h3><span className="panel-meta">30 hari</span></div>
              <div className="bar-chart" role="img" aria-label="Sebaran jam order">
                {perHour.map(({ h, count }) => (
                  <div className="bar-col" key={h}>
                    <span className="bar-value">{count > 0 ? count : ''}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: `${Math.max(count > 0 ? 6 : 0, Math.round((count / maxHour) * 100))}%` }} />
                    </div>
                    <span className="bar-label">{String(h).padStart(2, '0')}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-head"><h3>Corong status</h3><span className="panel-meta">30 hari</span></div>
              <ul className="rank-list">
                {funnel.map((f) => (
                  <li key={f.label}>
                    <div className="rank-body">
                      <div className="rank-row">
                        <span>{f.label}</span>
                        <strong>{f.count}</strong>
                      </div>
                      <div className="rank-track">
                        <div
                          className="rank-fill"
                          style={{ width: `${Math.max(f.count > 0 ? 4 : 0, Math.round((f.count / funnelMax) * 100))}%` }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </>
  );
}

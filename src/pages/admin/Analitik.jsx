import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { supabase } from '../../lib/supabase.js';
import { IconAnalytics } from '../../components/admin/icons.jsx';

// Analitik dari transaksi nyata (tanpa library grafik):
// sebaran jam order + corong status. Detail angka ada di Laporan.
const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const FUNNEL = [
  ['pending', 'Masuk', '#3b82f6'],
  ['confirmed', 'Dikonfirmasi', '#f0a500'],
  ['preparing', 'Diproses', '#f74900'],
  ['ready', 'Siap', '#16a34a'],
  ['completed', 'Selesai', '#57534e'],
];

// Kurva area SVG halus (tanpa library, tanpa bar).
function AreaChart({ points }) {
  const W = 600;
  const H = 190;
  const PAD = 8;
  const max = Math.max(1, ...points.map((p) => p.value));
  const x = (i) => PAD + (i * (W - PAD * 2)) / Math.max(1, points.length - 1);
  const y = (v) => H - 26 - (v / max) * (H - 60);
  const coords = points.map((p, i) => [x(i), y(p.value)]);
  let d = `M${coords[0][0]},${coords[0][1]}`;
  for (let i = 1; i < coords.length; i += 1) {
    const [x0, y0] = coords[i - 1];
    const [x1, y1] = coords[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  const area = `${d} L${x(points.length - 1)},${H} L${x(0)},${H} Z`;
  const last = coords[coords.length - 1];
  return (
    <svg className="area-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik garis order per jam">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f74900" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f74900" stopOpacity="0.03" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={PAD} x2={W - PAD} y1={H * f} y2={H * f} className="area-grid" />
      ))}
      <path d={area} fill="url(#areaFill)" />
      <path d={d} fill="none" stroke="#f74900" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="4.5" fill="#f74900" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

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

  const funnel = FUNNEL.map(([key, label, color]) => ({
    label,
    color,
    count: orders.filter((o) => o.order_status === key).length,
  }));
  const funnelTotal = funnel.reduce((s, f) => s + f.count, 0);
  let funnelGradient = '#f1efed';
  if (funnelTotal > 0) {
    let acc = 0;
    const stops = [];
    funnel.forEach(({ color, count }) => {
      const span = (count / funnelTotal) * 100;
      if (span <= 0) return;
      const from = (acc / funnelTotal) * 100;
      const to = ((acc + count) / funnelTotal) * 100;
      stops.push(`${color} ${from}% ${Math.max(from, to - 2)}%`);
      if (to < 100) stops.push(`#ffffff ${Math.max(from, to - 2)}% ${to}%`);
      acc += count;
    });
    funnelGradient = `conic-gradient(from -90deg, ${stops.join(', ')})`;
  }

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
              <AreaChart points={perHour.map(({ h, count }) => ({ label: h, value: count }))} />
              <div className="chart-axis">
                {perHour.filter((_, i) => i % 2 === 0).map(({ h }) => (
                  <span key={h}>{String(h).padStart(2, '0')}</span>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-head"><h3>Corong status</h3><span className="panel-meta">30 hari</span></div>
              <div className="donut-wrap">
                <div className="donut-fill" style={{ background: funnelGradient }}>
                  <div className="donut-center">
                    <span className="donut-value">{funnelTotal}</span>
                    <span className="donut-label">Total order</span>
                  </div>
                </div>
              </div>
              <ul className="legend-list">
                {funnel.map((f) => (
                  <li key={f.label}>
                    <span><i className="dot" style={{ background: f.color }} /> {f.label}</span>
                    <strong>{f.count}{funnelTotal > 0 ? ` • ${Math.round((f.count / funnelTotal) * 100)}%` : ''}</strong>
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

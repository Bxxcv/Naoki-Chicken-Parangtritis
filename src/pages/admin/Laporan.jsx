import { useCallback, useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { supabase } from '../../lib/supabase.js';
import { formatIDR } from '../../lib/cart.jsx';
import { IconReports } from '../../components/admin/icons.jsx';

// Laporan dari data transaksi nyata (bukan hiasan):
// pendapatan, pesanan, kanal, pembayaran, pengeluaran, bersih.
const RANGES = [
  ['7 hari', 7],
  ['30 hari', 30],
];

const CHANNEL_LABEL = { dine_in: 'Di tempat', takeaway: 'Bawa pulang', pickup: 'Ambil', delivery: 'Diantar' };
const PAY_LABEL = { cash: 'Tunai', manual_qris: 'QRIS' };

function dayKey(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dayLabel(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function Laporan() {
  const [range, setRange] = useState(7);
  const [orders, setOrders] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError('Backend belum terhubung.');
      return;
    }
    setLoading(true);
    const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString();
    const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').maybeSingle();
    if (!outlet) {
      setLoading(false);
      setError('Outlet belum siap — jalankan migrasi.');
      return;
    }
    const [{ data: orderRows, error: orderError }, { data: expRows, error: expError }] = await Promise.all([
      supabase
        .from('orders')
        .select('total_idr,order_status,order_type,created_at,payments(method)')
        .eq('outlet_id', outlet.id)
        .gte('created_at', since)
        .order('created_at', { ascending: true })
        .limit(1000),
      supabase
        .from('expenses')
        .select('amount_idr,spent_at')
        .eq('outlet_id', outlet.id)
        .gte('spent_at', since)
        .limit(1000),
    ]);
    setLoading(false);
    if (orderError || expError) {
      setError((orderError || expError).message);
      return;
    }
    setError('');
    setOrders(orderRows || []);
    setExpenses(expRows || []);

    // Produk terlaris dari item order valid (bukan klaim).
    const { data: itemRows } = await supabase
      .from('order_items')
      .select('product_name_snapshot,quantity,line_total_idr,orders!inner(outlet_id,order_status,created_at)')
      .eq('orders.outlet_id', outlet.id)
      .gte('orders.created_at', since)
      .neq('orders.order_status', 'cancelled')
      .limit(2000);
    const agg = {};
    (itemRows || []).forEach((row) => {
      const key = row.product_name_snapshot || 'Lainnya';
      const cur = agg[key] || { name: key, qty: 0, total: 0 };
      cur.qty += Number(row.quantity) || 0;
      cur.total += Number(row.line_total_idr) || 0;
      agg[key] = cur;
    });
    setTopProducts(Object.values(agg).sort((a, b) => b.qty - a.qty).slice(0, 10));
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  const report = useMemo(() => {
    const valid = orders.filter((o) => o.order_status !== 'cancelled');
    const revenue = valid.reduce((s, o) => s + (Number(o.total_idr) || 0), 0);
    const expenseTotal = expenses.reduce((s, e) => s + (Number(e.amount_idr) || 0), 0);
    const channels = {};
    const pays = {};
    valid.forEach((o) => {
      const ch = o.order_type || 'takeaway';
      channels[ch] = (channels[ch] || 0) + 1;
      const method = (o.payments && o.payments[0] && o.payments[0].method) || 'cash';
      pays[method] = (pays[method] || 0) + (Number(o.total_idr) || 0);
    });
    const buckets = {};
    for (let i = range - 1; i >= 0; i -= 1) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      buckets[dayKey(d.toISOString())] = { label: dayLabel(d.toISOString()), value: 0 };
    }
    valid.forEach((o) => {
      const key = dayKey(o.created_at);
      if (buckets[key]) buckets[key].value += Number(o.total_idr) || 0;
    });
    const days = Object.values(buckets);
    const max = Math.max(1, ...days.map((d) => d.value));
    return { revenue, expenseTotal, net: revenue - expenseTotal, count: valid.length, avg: valid.length ? Math.round(revenue / valid.length) : 0, channels, pays, days, max };
  }, [orders, expenses, range]);

  return (
    <>
      <PageHeader
        eyebrow="Keuangan outlet"
        title="Laporan"
        actions={
          <div className="chip-row" style={{ marginBottom: 0 }}>
            {RANGES.map(([label, days]) => (
              <button
                key={label}
                type="button"
                className={`chip${range === days ? ' is-active' : ''}`}
                onClick={() => setRange(days)}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />

      <div className="admin-body">
        {loading ? (
          <section className="panel">
            <EmptyState icon={<IconReports size={26} />} title="Memuat laporan..." desc="Menghitung dari transaksi nyata." />
          </section>
        ) : error ? (
          <section className="panel">
            <EmptyState icon={<IconReports size={26} />} title="Laporan tidak dapat dimuat" desc={error} />
          </section>
        ) : (
          <>
            <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
              <div className="stat-card">
                <span className="stat-label">Pendapatan</span>
                <span className="stat-value" style={{ fontSize: '1.3rem' }}>{formatIDR(report.revenue)}</span>
                <span className="stat-note">{report.count} pesanan</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Rata-rata order</span>
                <span className="stat-value" style={{ fontSize: '1.3rem' }}>{formatIDR(report.avg)}</span>
                <span className="stat-note">Per transaksi valid</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Pengeluaran</span>
                <span className="stat-value" style={{ fontSize: '1.3rem' }}>{formatIDR(report.expenseTotal)}</span>
                <span className="stat-note">{expenses.length} transaksi</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Bersih</span>
                <span className="stat-value" style={{ fontSize: '1.3rem' }}>{formatIDR(report.net)}</span>
                <span className="stat-note">Pendapatan − pengeluaran</span>
              </div>
            </div>

            <section className="panel">
              <div className="panel-head"><h3>Pendapatan harian</h3><span className="panel-meta">Dari order valid</span></div>
              {report.revenue === 0 ? (
                <EmptyState icon={<IconReports size={26} />} title="Belum ada transaksi" desc="Grafik terisi otomatis setelah ada penjualan." dashed={false} />
              ) : (
                <div className="bar-chart" role="img" aria-label={`Grafik pendapatan ${range} hari terakhir`}>
                  {report.days.map((d) => (
                    <div className="bar-col" key={d.label}>
                      <span className="bar-value">{d.value > 0 ? `${Math.round(d.value / 1000)}rb` : ''}</span>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ height: `${Math.max(d.value > 0 ? 6 : 0, Math.round((d.value / report.max) * 100))}%` }} />
                      </div>
                      <span className="bar-label">{d.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="grid-2">
              <section className="panel">
                <div className="panel-head"><h3>Produk terlaris</h3><span className="panel-meta">Per porsi terjual</span></div>
                {topProducts.length === 0 ? (
                  <p className="panel-desc">Belum ada data.</p>
                ) : (
                  <ul className="rank-list">
                    {topProducts.map((p, i) => (
                      <li key={p.name}>
                        <span className="rank-no">{i + 1}</span>
                        <div className="rank-body">
                          <div className="rank-row">
                            <span>{p.name}</span>
                            <strong>{p.qty} × • {formatIDR(p.total)}</strong>
                          </div>
                          <div className="rank-track">
                            <div
                              className="rank-fill"
                              style={{ width: `${Math.max(4, Math.round((p.qty / topProducts[0].qty) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="panel">
                <div className="panel-head"><h3>Pesanan per kanal</h3></div>
                {Object.keys(report.channels).length === 0 ? (
                  <p className="panel-desc">Belum ada data.</p>
                ) : (
                  <ul className="legend-list">
                    {Object.entries(report.channels).map(([key, count]) => (
                      <li key={key}>
                        <span>{CHANNEL_LABEL[key] || key}</span>
                        <strong>{count} order</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
              <section className="panel">
                <div className="panel-head"><h3>Pendapatan per bayar</h3></div>
                {Object.keys(report.pays).length === 0 ? (
                  <p className="panel-desc">Belum ada data.</p>
                ) : (
                  <ul className="legend-list">
                    {Object.entries(report.pays).map(([key, value]) => (
                      <li key={key}>
                        <span>{PAY_LABEL[key] || key}</span>
                        <strong>{formatIDR(value)}</strong>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
}

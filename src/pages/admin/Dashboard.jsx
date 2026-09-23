import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { supabase } from '../../lib/supabase.js';
import { formatIDR } from '../../lib/cart.jsx';
import {
  IconPlus,
  IconStore,
  IconCalendar,
  IconDownload,
  IconPayments,
  IconOrders,
  IconCustomers,
  IconTrend,
  IconBox,
  IconBulb,
  IconChevronRight,
} from '../../components/admin/icons.jsx';

const CHANNELS = [
  ['dine_in', 'Makan di tempat', '#f74900'],
  ['takeaway', 'Bawa pulang', '#e5ad00'],
  ['pickup', 'Ambil sendiri', '#16a34a'],
  ['delivery', 'Diantar', '#3b82f6'],
];

const STATUS_ROWS = [
  ['pending', 'Baru', 'new'],
  ['confirmed', 'Dikonfirmasi', 'progress'],
  ['preparing', 'Diproses', 'progress'],
  ['ready', 'Siap', 'ready'],
  ['completed', 'Selesai', 'done'],
];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function hourOf(iso) {
  return new Date(iso).getHours();
}

// Semua angka dari transaksi nyata; kosong = jujur kosong.
export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState(0);
  const [top, setTop] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').maybeSingle();
    if (!outlet) {
      setLoading(false);
      return;
    }
    const since = startOfToday();
    const [{ data: orderRows }, { count: custCount }, { data: itemRows }] = await Promise.all([
      supabase
        .from('orders')
        .select('total_idr,order_status,order_type,created_at')
        .eq('outlet_id', outlet.id)
        .gte('created_at', since)
        .limit(1000),
      supabase.from('customers').select('id', { count: 'exact', head: true }),
      supabase
        .from('order_items')
        .select('product_name_snapshot,quantity,orders!inner(outlet_id,order_status,created_at)')
        .eq('orders.outlet_id', outlet.id)
        .gte('orders.created_at', since)
        .neq('orders.order_status', 'cancelled')
        .limit(2000),
    ]);
    setOrders(orderRows || []);
    setCustomers(custCount || 0);
    const agg = {};
    (itemRows || []).forEach((row) => {
      const key = row.product_name_snapshot || 'Lainnya';
      agg[key] = (agg[key] || 0) + (Number(row.quantity) || 0);
    });
    setTop(Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 5));
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const valid = orders.filter((o) => o.order_status !== 'cancelled');
  const revenue = valid.reduce((s, o) => s + (Number(o.total_idr) || 0), 0);
  const avg = valid.length ? Math.round(revenue / valid.length) : 0;

  const channelCounts = {};
  valid.forEach((o) => { channelCounts[o.order_type] = (channelCounts[o.order_type] || 0) + 1; });
  const channelTotal = valid.length;
  const channelRows = CHANNELS.map(([key, label, color]) => ({
    key, label, color,
    count: channelCounts[key] || 0,
    pct: channelTotal > 0 ? Math.round(((channelCounts[key] || 0) / channelTotal) * 100) : 0,
  }));
  // Donat segmen bercelah putih agar tiap kanal terbaca jelas.
  let gradient = '#f1efed';
  if (channelTotal > 0) {
    let acc = 0;
    const GAP = 2;
    const stops = [];
    channelRows.forEach(({ color, count }) => {
      const span = (count / channelTotal) * 100;
      if (span <= 0) return;
      const from = (acc / channelTotal) * 100;
      const to = ((acc + count) / channelTotal) * 100;
      stops.push(`${color} ${from}% ${Math.max(from, to - GAP)}%`);
      if (to < 100) stops.push(`#ffffff ${Math.max(from, to - GAP)}% ${to}%`);
      acc += count;
    });
    gradient = `conic-gradient(from -90deg, ${stops.join(', ')})`;
  }

  const statusCounts = {};
  orders.forEach((o) => { statusCounts[o.order_status] = (statusCounts[o.order_status] || 0) + 1; });

  const hours = {};
  valid.forEach((o) => {
    const h = hourOf(o.created_at);
    hours[h] = (hours[h] || 0) + 1;
  });
  const busyHour = Object.entries(hours).sort((a, b) => b[1] - a[1])[0];
  const topChannel = CHANNELS.map(([key, label]) => [label, channelCounts[key] || 0]).sort((a, b) => b[1] - a[1])[0];

  const insights = [
    ['Menu paling diminati', top.length > 0 ? `${top[0][0]} (${top[0][1]} porsi)` : 'Belum dapat dihitung'],
    ['Jam tersibuk', busyHour ? `Pukul ${String(busyHour[0]).padStart(2, '0')}.00 (${busyHour[1]} order)` : 'Belum dapat dihitung'],
    ['Kanal unggulan', topChannel && topChannel[1] > 0 ? `${topChannel[0]} (${topChannel[1]} order)` : 'Belum dapat dihitung'],
  ];

  const stats = [
    { icon: IconPayments, label: 'Pendapatan hari ini', value: formatIDR(revenue), note: `${valid.length} transaksi valid` },
    { icon: IconOrders, label: 'Pesanan hari ini', value: String(orders.length), note: 'Semua status' },
    { icon: IconCustomers, label: 'Pelanggan', value: String(customers), note: 'Terdaftar total' },
    { icon: IconTrend, label: 'Rata-rata pesanan', value: formatIDR(avg), note: 'Per transaksi valid' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Operasional outlet"
        title="Dasbor"
        actions={
          <>
            <Link to="/admin/produk" className="btn-primary"><IconPlus size={17} /> Tambah produk</Link>
            <Link to="/" className="btn-outline"><IconStore size={17} /> Lihat toko</Link>
          </>
        }
      />

      <div className="admin-body">
        <div className="admin-welcome">
          <div>
            <h2>Selamat datang, Tim Naoki!</h2>
            <p>Ringkasan aktivitas outlet Anda.</p>
            <p className="admin-status-line">
              <span className="dot dot--ready" />
              Terhubung database outlet · Hari ini
            </p>
          </div>
          <div className="admin-welcome-actions">
            <span className="btn-outline"><IconCalendar size={16} /> Hari ini</span>
            <Link to="/admin/laporan" className="btn-outline"><IconDownload size={16} /> Laporan</Link>
          </div>
        </div>

        <div className="stat-grid">
          {stats.map(({ icon: Icon, label, value, note }) => (
            <article className="stat-card" key={label}>
              <span className="stat-label"><Icon size={17} /> {label}</span>
              <span className="stat-value">{loading ? '…' : value}</span>
              <span className="stat-note">{note}</span>
            </article>
          ))}
        </div>

        <div className="grid-2">
          <section className="panel">
            <div className="panel-head">
              <h3>Pesanan per kanal</h3>
              <span className="panel-meta">Hari ini</span>
            </div>
            <div className="donut-wrap">
              {channelTotal === 0 ? (
                <div className="donut-empty">
                  <span className="donut-value">—</span>
                  <span className="donut-label">Total pesanan</span>
                </div>
              ) : (
                <div className="donut-fill" style={{ background: gradient }}>
                  <div className="donut-center">
                    <span className="donut-value">{channelTotal}</span>
                    <span className="donut-label">Total pesanan</span>
                  </div>
                </div>
              )}
            </div>
            <ul className="legend-list">
              {channelRows.map(({ key, label, color, count, pct }) => (
                <li key={key}>
                  <span><i className="dot" style={{ background: color }} /> {label}</span>
                  <strong>{count} • {pct}%</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-head"><h3>Status pesanan</h3><span className="panel-meta">Hari ini</span></div>
            <ul className="legend-list">
              {STATUS_ROWS.map(([key, label, tone]) => (
                <li key={key}>
                  <span><i className={`dot dot--${tone}`} /> {label}</span>
                  <strong>{statusCounts[key] || 0}</strong>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid-2">
          <section className="panel">
            <div className="panel-head">
              <h3>Produk teratas</h3>
              <Link to="/admin/produk" className="icon-link" aria-label="Lihat semua produk"><IconChevronRight size={17} /></Link>
            </div>
            {top.length === 0 ? (
              <EmptyState
                dashed={false}
                icon={<IconBox size={26} />}
                title="Belum ada produk terjual"
                desc="Urutan mengikuti pesanan hari ini."
              />
            ) : (
              <ul className="legend-list">
                {top.map(([name, qty]) => (
                  <li key={name}>
                    <span>{name}</span>
                    <strong>{qty} porsi</strong>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="panel">
            <div className="panel-head"><h3><IconBulb size={17} /> Wawasan bisnis</h3></div>
            <ul className="insight-list">
              {insights.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}

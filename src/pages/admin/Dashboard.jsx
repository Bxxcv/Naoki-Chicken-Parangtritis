import { Link } from 'react-router-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
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
  IconChevronDown,
} from '../../components/admin/icons.jsx';

// Semua nilai sengaja "—". Sistem belum terhubung data outlet, dan menampilkan
// angka contoh di dasbor operasional bisa dibaca sebagai transaksi nyata.
const STATS = [
  { icon: IconPayments, label: 'Total pendapatan' },
  { icon: IconOrders, label: 'Total pesanan' },
  { icon: IconCustomers, label: 'Pelanggan' },
  { icon: IconTrend, label: 'Rata-rata pesanan' },
];

const CHANNELS = [
  { label: 'Makan di tempat', tone: 'dine' },
  { label: 'Bawa pulang', tone: 'takeaway' },
  { label: 'Ambil sendiri', tone: 'pickup' },
  { label: 'Diantar', tone: 'delivery' },
];

const ORDER_STATUS = [
  { label: 'Baru', tone: 'new' },
  { label: 'Diproses', tone: 'progress' },
  { label: 'Siap', tone: 'ready' },
  { label: 'Selesai', tone: 'done' },
];

const INSIGHTS = [
  ['Menu paling diminati', 'Belum dapat dihitung'],
  ['Jam tersibuk', 'Belum dapat dihitung'],
  ['Kanal unggulan', 'Belum dapat dihitung'],
];

const HOURS = ['08.00', '11.00', '14.00', '17.00', '20.00'];

export default function Dashboard() {
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
              <span className="dot dot--warn" />
              Data outlet belum terhubung · Hari ini
            </p>
          </div>
          <div className="admin-welcome-actions">
            <button type="button" className="btn-outline">
              <IconCalendar size={16} /> Hari ini <IconChevronDown size={15} />
            </button>
            <button type="button" className="btn-outline"><IconDownload size={16} /> Laporan</button>
          </div>
        </div>

        <div className="stat-grid">
          {STATS.map(({ icon: Icon, label }) => (
            <article className="stat-card" key={label}>
              <span className="stat-label"><Icon size={17} /> {label}</span>
              <span className="stat-value">—</span>
              <span className="stat-note">Belum ada transaksi tercatat</span>
            </article>
          ))}
        </div>

        <div className="grid-2">
          <section className="panel">
            <div className="panel-head">
              <h3>Tren pendapatan &amp; pesanan</h3>
              <span className="panel-meta">Hari ini</span>
            </div>
            <div className="chart-legend">
              <span><i className="dot dot--revenue" /> Pendapatan</span>
              <span><i className="dot dot--orders" /> Pesanan</span>
            </div>
            <div className="chart-empty">
              <EmptyState
                dashed={false}
                icon={<IconTrend size={26} />}
                title="Grafik menunggu transaksi"
                desc="Tidak ada data pada periode ini."
              />
            </div>
            <div className="chart-axis">
              {HOURS.map((hour) => <span key={hour}>{hour}</span>)}
            </div>
            <div className="chart-foot">
              <div><span>Pendapatan</span><strong>—</strong></div>
              <div><span>Pesanan</span><strong>—</strong></div>
              <div><span>Jam teramai</span><strong>—</strong></div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-head">
              <h3>Pesanan per kanal</h3>
            </div>
            <div className="donut-wrap">
              <div className="donut-empty">
                <span className="donut-value">—</span>
                <span className="donut-label">Total pesanan</span>
              </div>
            </div>
            <ul className="legend-list">
              {CHANNELS.map(({ label, tone }) => (
                <li key={label}>
                  <span><i className={`dot dot--${tone}`} /> {label}</span>
                  <strong>—</strong>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="grid-3">
          <section className="panel">
            <div className="panel-head">
              <h3>Produk teratas</h3>
              <Link to="/admin/produk" className="icon-link" aria-label="Lihat semua produk"><IconChevronRight size={17} /></Link>
            </div>
            <EmptyState
              dashed={false}
              icon={<IconBox size={26} />}
              title="Belum ada produk terjual"
              desc="Urutan mengikuti pesanan selesai."
            />
          </section>

          <section className="panel">
            <div className="panel-head"><h3>Status pesanan</h3></div>
            <ul className="legend-list">
              {ORDER_STATUS.map(({ label, tone }) => (
                <li key={label}>
                  <span><i className={`dot dot--${tone}`} /> {label}</span>
                  <strong>—</strong>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel-head"><h3><IconBulb size={17} /> Wawasan bisnis</h3></div>
            <ul className="insight-list">
              {INSIGHTS.map(([label, value]) => (
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

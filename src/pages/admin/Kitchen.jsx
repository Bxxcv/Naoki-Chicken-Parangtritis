import PageHeader from '../../components/admin/PageHeader.jsx';

// Kolom mengikuti status pesanan di docs/ORDER-PAYMENT-STATES.md.
const COLUMNS = [
  { label: 'Baru', tone: 'new' },
  { label: 'Diproses', tone: 'progress' },
  { label: 'Siap', tone: 'ready' },
  { label: 'Selesai', tone: 'done' },
];

export default function Kitchen() {
  return (
    <>
      <PageHeader
        eyebrow="Tampilan produksi"
        title="Dapur"
        actions={<button type="button" className="btn-outline">Lihat toko</button>}
      />

      <div className="admin-body">
        <div className="kitchen-head">
          <p>Pesanan diperbarui berdasarkan status operasional.</p>
          <span className="kitchen-ready"><i className="dot dot--ready" /> Siap menerima</span>
        </div>

        <div className="kitchen-board">
          {COLUMNS.map(({ label, tone }) => (
            <section className="panel kitchen-col" key={label}>
              <div className="panel-head">
                <h3><i className={`dot dot--${tone}`} /> {label}</h3>
                <span className="panel-meta">0</span>
              </div>
              <div className="empty-state empty-state--dashed kitchen-empty">
                <p className="empty-state-desc">Belum ada pesanan</p>
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

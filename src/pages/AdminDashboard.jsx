const stats = [
  ['Revenue Hari Ini', 'Rp0', 'Siapkan integrasi transaksi.'],
  ['Order Hari Ini', '0', 'Belum ada data produksi.'],
  ['Average Order', 'Rp0', 'Dihitung dari order sukses.'],
  ['Low Stock', '0', 'Terhubung ke modul stock.'],
];

export default function AdminDashboard() {
  return (
    <div className="container-fluid py-4 px-3 px-lg-4">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap">
        <div>
          <div className="small text-uppercase fw-semibold text-danger">Naoki Chicken Parangtritis</div>
          <h1 className="h3 fw-bold mb-1">Dashboard</h1>
          <p className="text-secondary mb-0">Starter shell — data produksi belum dihubungkan.</p>
        </div>
        <button className="btn btn-danger">Tambah Order</button>
      </div>

      <div className="row g-3">
        {stats.map(([label, value, note]) => (
          <div className="col-12 col-sm-6 col-xl-3" key={label}>
            <div className="card metric-card h-100">
              <div className="card-body">
                <div className="small text-secondary">{label}</div>
                <div className="metric-value">{value}</div>
                <div className="small text-secondary">{note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-xl-8">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h6 fw-bold mb-0">Sales Trend</h2>
                <span className="badge text-bg-light">Design placeholder</span>
              </div>
              <div className="chart-placeholder">Chart area</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-xl-4">
          <div className="card h-100">
            <div className="card-body">
              <h2 className="h6 fw-bold">Order Channels</h2>
              <div className="channel-row"><span>Dine-in</span><strong>0%</strong></div>
              <div className="channel-row"><span>Takeaway</span><strong>0%</strong></div>
              <div className="channel-row"><span>Pickup</span><strong>0%</strong></div>
              <div className="channel-row"><span>Delivery</span><strong>0%</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

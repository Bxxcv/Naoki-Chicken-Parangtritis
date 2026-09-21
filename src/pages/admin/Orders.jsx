import { useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { IconPlus, IconSearch, IconFilter, IconOrders } from '../../components/admin/icons.jsx';

const FILTERS = ['Semua', 'Baru', 'Diproses', 'Siap', 'Selesai', 'Dibatalkan'];

export default function Orders() {
  const [active, setActive] = useState('Semua');

  return (
    <>
      <PageHeader
        eyebrow="Operasional outlet"
        title="Pesanan"
        actions={
          <>
            <button type="button" className="btn-primary"><IconPlus size={17} /> Tambah</button>
            <button type="button" className="btn-outline">Lihat toko</button>
          </>
        }
      />

      <div className="admin-body">
        <section className="panel">
          <div className="filter-bar">
            <label className="search-field">
              <IconSearch size={17} />
              <input type="search" placeholder="Cari nomor atau nama pelanggan..." />
              <span className="visually-hidden">Cari pesanan</span>
            </label>
            <button type="button" className="btn-outline"><IconFilter size={16} /> Filter</button>
          </div>

          <div className="chip-row" role="tablist" aria-label="Filter status pesanan">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={active === filter}
                className={`chip${active === filter ? ' is-active' : ''}`}
                onClick={() => setActive(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <EmptyState
            icon={<IconOrders size={26} />}
            title="Belum ada pesanan"
            desc="Pesanan online dan kasir akan terkumpul di sini untuk diproses."
          />
        </section>
      </div>
    </>
  );
}

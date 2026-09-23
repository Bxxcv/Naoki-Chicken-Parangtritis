import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { supabase } from '../../lib/supabase.js';
import { formatIDR } from '../../lib/cart.jsx';
import { IconSearch, IconCustomers } from '../../components/admin/icons.jsx';

function timeOf(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '-';
  }
}

// Pelanggan = identitas pemesan (tamu/member). Baca saja di MVP;
// tulis terjadi otomatis saat checkout. Lihat docs/REQUIREMENTS.md.
export default function Pelanggan() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError('Backend belum terhubung.');
      return;
    }
    setLoading(true);
    const { data: customers, error: custError } = await supabase
      .from('customers')
      .select('id,name,phone,address,created_at')
      .order('created_at', { ascending: false })
      .limit(200);
    if (custError) {
      setLoading(false);
      setError(custError.message);
      return;
    }
    const ids = (customers || []).map((c) => c.id);
    let stats = {};
    if (ids.length > 0) {
      const { data: orders } = await supabase
        .from('orders')
        .select('customer_id,total_idr,order_status,created_at')
        .in('customer_id', ids);
      stats = {};
      (orders || []).forEach((o) => {
        if (!o.customer_id) return;
        const s = stats[o.customer_id] || { count: 0, total: 0, last: '' };
        s.count += 1;
        if (o.order_status !== 'cancelled') s.total += Number(o.total_idr) || 0;
        if (!s.last || o.created_at > s.last) s.last = o.created_at;
        stats[o.customer_id] = s;
      });
    }
    setRows((customers || []).map((c) => ({ ...c, ...(stats[c.id] || { count: 0, total: 0, last: '' }) })));
    setError('');
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const q = search.trim().toLowerCase();
  const filtered = rows.filter((c) =>
    !q
    || c.name.toLowerCase().includes(q)
    || (c.phone || '').includes(q),
  );

  return (
    <>
      <PageHeader
        eyebrow="Data pelanggan"
        title="Pelanggan"
        actions={<button type="button" className="btn-outline" onClick={load} disabled={loading}>Muat ulang</button>}
      />

      <div className="admin-body">
        <section className="panel">
          <div className="filter-bar">
            <label className="search-field">
              <IconSearch size={17} />
              <input
                type="search"
                placeholder="Cari nama atau nomor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="visually-hidden">Cari pelanggan</span>
            </label>
          </div>

          {loading ? (
            <EmptyState
              icon={<IconCustomers size={26} />}
              title="Memuat pelanggan..."
              desc="Mengambil data terbaru dari database."
            />
          ) : error ? (
            <EmptyState
              icon={<IconCustomers size={26} />}
              title="Pelanggan tidak dapat dimuat"
              desc={error}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<IconCustomers size={26} />}
              title="Belum ada pelanggan"
              desc="Identitas tercatat otomatis setiap ada pesanan masuk."
            />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Kontak</th>
                    <th>Pesanan</th>
                    <th>Total belanja</th>
                    <th>Terakhir</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.phone || '-'}<br /><small>{c.address || ''}</small></td>
                      <td className="num">{c.count}</td>
                      <td className="num">{formatIDR(c.total)}</td>
                      <td>{c.last ? timeOf(c.last) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

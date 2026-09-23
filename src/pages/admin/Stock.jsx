import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { useProducts, isEmpty, isLow } from '../../lib/products.jsx';
import { supabase } from '../../lib/supabase.js';
import { IconPlus, IconStock, IconAlert } from '../../components/admin/icons.jsx';

// Stok saleable dibaca dari tabel products (satu sumber dengan katalog).
// Riwayat pergerakan menyusul bersama modul stok bahan (docs/ROADMAP.md).
export default function Stock() {
  const { products, status, reload } = useProducts();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('stok');
  const [moves, setMoves] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    await reload();
    if (supabase) {
      const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').maybeSingle();
      if (outlet) {
        const { data } = await supabase
          .from('stock_movements')
          .select('product_name_snapshot,quantity_delta,stock_after,reason,created_at')
          .eq('outlet_id', outlet.id)
          .order('created_at', { ascending: false })
          .limit(100);
        setMoves(data || []);
      }
    }
    setLoading(false);
  }, [reload]);

  useEffect(() => {
    load();
  }, [load]);

  const lowItems = products.filter((p) => !isEmpty(p) && isLow(p));
  const emptyItems = products.filter((p) => isEmpty(p));

  return (
    <>
      <PageHeader
        eyebrow="Manajemen stok"
        title="Stok"
        actions={
          <Link to="/admin/produk" className="btn-primary"><IconPlus size={17} /> Atur stok</Link>
        }
      />

      <div className="admin-body">
        {(lowItems.length > 0 || emptyItems.length > 0) && (
          <div className="alert-bar" role="status">
            <IconAlert size={18} />
            <span>
              {emptyItems.length > 0 ? `${emptyItems.length} habis` : ''}
              {emptyItems.length > 0 && lowItems.length > 0 ? ' • ' : ''}
              {lowItems.length > 0 ? `${lowItems.length} menipis` : ''}.
              Atur ulang di halaman Produk.
            </span>
          </div>
        )}

        <div className="chip-row" role="tablist" aria-label="Tampilan stok">
          <button
            type="button" role="tab" aria-selected={tab === 'stok'}
            className={`chip${tab === 'stok' ? ' is-active' : ''}`}
            onClick={() => setTab('stok')}
          >
            Stok saat ini
          </button>
          <button
            type="button" role="tab" aria-selected={tab === 'riwayat'}
            className={`chip${tab === 'riwayat' ? ' is-active' : ''}`}
            onClick={() => setTab('riwayat')}
          >
            Riwayat
          </button>
        </div>

        {tab === 'riwayat' ? (
          <section className="panel">
            <div className="panel-head"><h3>Pergerakan stok</h3><span className="panel-meta">100 terakhir</span></div>
            {moves.length === 0 ? (
              <EmptyState
                icon={<IconStock size={26} />}
                title="Belum ada pergerakan"
                desc="Tercatat otomatis setiap stok berubah."
              />
            ) : (
              <div className="data-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Waktu</th>
                      <th>Produk</th>
                      <th>Perubahan</th>
                      <th>Sisa</th>
                      <th>Alasan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moves.map((m, i) => (
                      <tr key={i}>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {new Date(m.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td>{m.product_name_snapshot || '-'}</td>
                        <td className="num"><strong style={{ color: Number(m.quantity_delta) < 0 ? '#b42318' : '#15803d' }}>
                          {Number(m.quantity_delta) > 0 ? '+' : ''}{m.quantity_delta}
                        </strong></td>
                        <td className="num">{m.stock_after}</td>
                        <td>{m.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : (
        <section className="panel">
          <div className="panel-head">
            <h3>Stok produk saleable</h3>
            <span className="panel-meta">Per outlet Parangtritis</span>
          </div>
          {loading || status === 'loading' ? (
            <EmptyState
              icon={<IconStock size={26} />}
              title="Memuat stok..."
              desc="Mengambil data terbaru dari database."
            />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<IconStock size={26} />}
              title="Belum ada data stok"
              desc="Tambah produk dulu di halaman Produk."
            />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                    <th>Batas</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => {
                    const empty = isEmpty(p);
                    const low = isLow(p);
                    return (
                      <tr key={p.id} className={empty ? 'row-danger' : low ? 'row-warning' : ''}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.category}</td>
                        <td className="num"><strong>{p.stock}</strong> porsi</td>
                        <td className="num">{p.lowAt}</td>
                        <td>
                          {empty
                            ? <span className="status-badge badge-danger">Habis</span>
                            : low
                              ? <span className="status-badge badge-warning">Menipis</span>
                              : <span className="status-badge badge-success">Aman</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        )}
      </div>
    </>
  );
}

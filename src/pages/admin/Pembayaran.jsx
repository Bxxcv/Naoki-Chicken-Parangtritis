import { useCallback, useEffect, useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { supabase } from '../../lib/supabase.js';
import { formatIDR } from '../../lib/cart.jsx';
import { markPaid } from '../../lib/orders.js';
import { IconPayments } from '../../components/admin/icons.jsx';

const METHOD_LABEL = { cash: 'Tunai', manual_qris: 'QRIS' };

function timeOf(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Daftar pembayaran dari database. Konfirmasi lunas di sini atau di
// Pesanan. Gateway menyusul (docs/DECISIONS.md ADR-004).
export default function Pembayaran() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    if (!supabase) {
      setLoading(false);
      setError('Backend belum terhubung.');
      return;
    }
    setLoading(true);
    const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').maybeSingle();
    if (!outlet) {
      setLoading(false);
      setError('Outlet belum siap — jalankan migrasi.');
      return;
    }
    const { data, error: listError } = await supabase
      .from('payments')
      .select('id,method,status,amount_idr,created_at,orders!inner(id,order_number,outlet_id)')
      .eq('orders.outlet_id', outlet.id)
      .order('created_at', { ascending: false })
      .limit(200);
    setLoading(false);
    if (listError) {
      setError(listError.message);
      setRows([]);
      return;
    }
    setError('');
    setRows(data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onPaid = async (row) => {
    if (!window.confirm(`Tandai ${row.orders.order_number} lunas?`)) return;
    setBusy(row.id);
    const res = await markPaid(row.orders.id);
    setBusy('');
    if (!res.ok) setError(res.error);
    else load();
  };

  const paidTotal = rows.filter((r) => r.status === 'paid').reduce((s, r) => s + (Number(r.amount_idr) || 0), 0);
  const unpaidTotal = rows.filter((r) => r.status !== 'paid').reduce((s, r) => s + (Number(r.amount_idr) || 0), 0);

  return (
    <>
      <PageHeader
        eyebrow="Keuangan outlet"
        title="Pembayaran"
        actions={<button type="button" className="btn-outline" onClick={load} disabled={loading}>Muat ulang</button>}
      />

      <div className="admin-body">
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
          <div className="stat-card">
            <span className="stat-label">Sudah lunas</span>
            <span className="stat-value" style={{ fontSize: '1.3rem' }}>{formatIDR(paidTotal)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Belum lunas</span>
            <span className="stat-value" style={{ fontSize: '1.3rem' }}>{formatIDR(unpaidTotal)}</span>
          </div>
        </div>

        <section className="panel">
          {loading ? (
            <EmptyState icon={<IconPayments size={26} />} title="Memuat..." desc="Mengambil data terbaru." />
          ) : error ? (
            <EmptyState icon={<IconPayments size={26} />} title="Tidak dapat dimuat" desc={error} />
          ) : rows.length === 0 ? (
            <EmptyState icon={<IconPayments size={26} />} title="Belum ada pembayaran" desc="Tercatat otomatis setiap ada pesanan." />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Metode</th>
                    <th>Nominal</th>
                    <th>Status</th>
                    <th>Waktu</th>
                    <th style={{ width: 130 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.orders.order_number}</strong></td>
                      <td>{METHOD_LABEL[r.method] || r.method}</td>
                      <td className="num">{formatIDR(r.amount_idr)}</td>
                      <td>
                        {r.status === 'paid'
                          ? <span className="status-badge badge-success">Lunas</span>
                          : <span className="status-badge badge-warning">Belum bayar</span>}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{timeOf(r.created_at)}</td>
                      <td>
                        {r.status !== 'paid' && (
                          <button type="button" className="btn-outline btn-sm" disabled={busy === r.id} onClick={() => onPaid(r)}>
                            Tandai lunas
                          </button>
                        )}
                      </td>
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

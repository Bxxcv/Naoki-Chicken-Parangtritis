import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { supabase } from '../../lib/supabase.js';
import { formatIDR } from '../../lib/cart.jsx';
import { formatRibuan, parseRupiah } from '../../lib/money.js';
import { IconPlus, IconExpenses } from '../../components/admin/icons.jsx';

const CATEGORIES = ['Bahan baku', 'Operasional', 'Gaji', 'Sewa', 'Utilitas', 'Lainnya'];
const SOURCES = ['kas', 'transfer', 'dompet digital'];

function todayInput() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function timeOf(iso) {
  try {
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// Pengeluaran outlet. Ubah = hapus + catat ulang (jejak audit sederhana).
export default function Pengeluaran() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayInput());
  const [source, setSource] = useState(SOURCES[0]);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

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
      .from('expenses')
      .select('*')
      .eq('outlet_id', outlet.id)
      .order('spent_at', { ascending: false })
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

  useEffect(() => {
    if (!formOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setFormOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [formOpen]);

  const total = rows.reduce((s, r) => s + (Number(r.amount_idr) || 0), 0);

  const onSubmit = async (e) => {
    e.preventDefault();
    const value = parseRupiah(amount);
    if (value <= 0) {
      setFormError('Nominal harus lebih dari 0.');
      return;
    }
    setSaving(true);
    try {
      const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').single();
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData && sessionData.session && sessionData.session.user;
      const { error: insertError } = await supabase.from('expenses').insert({
        outlet_id: outlet.id,
        amount_idr: value,
        category,
        note: note.trim().slice(0, 160),
        spent_at: new Date(`${date}T12:00:00`).toISOString(),
        source,
        created_by: user ? user.id : null,
      });
      if (insertError) throw new Error(insertError.message);
      setFormOpen(false);
      setAmount('');
      setNote('');
      load();
    } catch (err) {
      setFormError(err.message);
    }
    setSaving(false);
  };

  const onDelete = async (row) => {
    if (!window.confirm(`Hapus pengeluaran ${formatIDR(row.amount_idr)} (${row.category})?`)) return;
    const { error: deleteError } = await supabase.from('expenses').delete().eq('id', row.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  };

  return (
    <>
      <PageHeader
        eyebrow="Keuangan outlet"
        title="Pengeluaran"
        actions={
          <button type="button" className="btn-primary" onClick={() => { setFormError(''); setFormOpen(true); }}>
            <IconPlus size={17} /> Tambah
          </button>
        }
      />

      <div className="admin-body">
        <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))' }}>
          <div className="stat-card">
            <span className="stat-label">Total tercatat</span>
            <span className="stat-value" style={{ fontSize: '1.3rem' }}>{formatIDR(total)}</span>
            <span className="stat-note">{rows.length} transaksi</span>
          </div>
        </div>

        {formOpen && createPortal(
          <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) setFormOpen(false); }}>
            <section className="admin-modal" role="dialog" aria-modal="true" aria-label="Pengeluaran baru">
              <div className="panel-head">
                <div>
                  <h3>Pengeluaran baru</h3>
                  <span className="panel-meta">Tercatat + masuk rekap</span>
                </div>
                <button type="button" className="cart-close" onClick={() => setFormOpen(false)} aria-label="Tutup formulir">×</button>
              </div>
              <form onSubmit={onSubmit}>
                <div className="form-grid">
                  <label className="form-field">
                    <span>Nominal (Rp) *</span>
                    <div className="input-rp">
                      <span aria-hidden="true">Rp</span>
                      <input
                        type="text" inputMode="numeric" placeholder="50.000"
                        value={formatRibuan(amount)}
                        onChange={(e) => setAmount(e.target.value.replace(/\D/g, '').slice(0, 13))}
                      />
                    </div>
                  </label>
                  <label className="form-field">
                    <span>Kategori</span>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="form-field">
                    <span>Tanggal</span>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </label>
                  <label className="form-field">
                    <span>Sumber</span>
                    <select value={source} onChange={(e) => setSource(e.target.value)}>
                      {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </label>
                  <label className="form-field form-field--full">
                    <span>Catatan</span>
                    <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="cth: Belanja ayam 5kg" maxLength={160} />
                  </label>
                </div>
                {formError && <p className="form-error" role="alert">{formError}</p>}
                <div className="form-actions">
                  <button type="button" className="btn-outline" onClick={() => setFormOpen(false)} disabled={saving}>Batal</button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </section>
          </div>,
          document.body,
        )}

        <section className="panel">
          {loading ? (
            <EmptyState icon={<IconExpenses size={26} />} title="Memuat..." desc="Mengambil data terbaru." />
          ) : error ? (
            <EmptyState icon={<IconExpenses size={26} />} title="Tidak dapat dimuat" desc={error} />
          ) : rows.length === 0 ? (
            <EmptyState icon={<IconExpenses size={26} />} title="Belum ada pengeluaran" desc="Catat setiap keluar kas di sini." />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tanggal</th>
                    <th>Kategori</th>
                    <th>Catatan</th>
                    <th>Sumber</th>
                    <th>Nominal</th>
                    <th style={{ width: 80 }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{timeOf(r.spent_at)}</td>
                      <td>{r.category}</td>
                      <td>{r.note || '-'}</td>
                      <td>{r.source}</td>
                      <td className="num">{formatIDR(r.amount_idr)}</td>
                      <td>
                        <button type="button" className="btn-outline btn-sm btn-danger" onClick={() => onDelete(r)}>
                          Hapus
                        </button>
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

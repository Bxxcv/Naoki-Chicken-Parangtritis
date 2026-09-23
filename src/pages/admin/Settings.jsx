import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { useSettings, DEFAULTS } from '../../lib/settings.jsx';
import { supabase } from '../../lib/supabase.js';
import { IconBox } from '../../components/admin/icons.jsx';

// Hari tampil Sen–Min, simpan format JS getDay (Min=0).
const DAYS = [
  [1, 'Sen'], [2, 'Sel'], [3, 'Rab'], [4, 'Kam'],
  [5, 'Jum'], [6, 'Sab'], [0, 'Min'],
];

const CHANNELS = [
  ['dine_in', 'Makan di tempat'],
  ['takeaway', 'Bawa pulang'],
  ['pickup', 'Ambil sendiri'],
  ['delivery', 'Diantar'],
];

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle${checked ? ' is-on' : ''}`}
      onClick={() => onChange(!checked)}
    >
      <span className="toggle-knob" />
    </button>
  );
}

function parseDays(raw) {
  try {
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr.filter((d) => Number.isInteger(d)) : [];
  } catch {
    return [];
  }
}

export default function Settings() {
  const { settings, status, error, reload, save, configured } = useSettings();
  const [draft, setDraft] = useState(DEFAULTS);
  const [formError, setFormError] = useState('');
  const [savedAt, setSavedAt] = useState('');
  const [saving, setSaving] = useState(false);
  const [qrisFile, setQrisFile] = useState(null);
  const [qrisPreview, setQrisPreview] = useState('');
  const [wipeText, setWipeText] = useState('');
  const [wiping, setWiping] = useState(false);
  const [wipeResult, setWipeResult] = useState('');

  useEffect(() => {
    if (status === 'ready') {
      setDraft({ ...DEFAULTS, ...settings });
      setSavedAt('');
    }
  }, [status, settings]);

  const set = (key) => (e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }));
  const setBool = (key) => (value) => setDraft((prev) => ({ ...prev, [key]: value ? 'true' : 'false' }));

  const toggleDay = (day) => {
    const days = parseDays(draft.open_days);
    const next = days.includes(day) ? days.filter((d) => d !== day) : [...days, day];
    setDraft((prev) => ({ ...prev, open_days: JSON.stringify(next) }));
  };

  // DANGER ZONE: hapus SEMUA data transaksi demo (order + bayar +
  // riwayat + pelanggan tes). Produk, kategori, pengaturan AMAN.
  // Untuk demo/jualan: bersihkan jejak tes sebelum serah terima.
  const onWipe = async () => {
    setWipeResult('');
    if (wipeText.trim().toUpperCase() !== 'HAPUS') {
      setWipeResult('Ketik HAPUS (huruf besar) untuk konfirmasi.');
      return;
    }
    if (!window.confirm('Yakin hapus SEMUA pesanan, pembayaran, dan pelanggan tes? Produk dan pengaturan tidak ikut terhapus.')) return;
    setWiping(true);
    try {
      const { data: outlet } = await supabase.from('outlets').select('id').eq('slug', 'parangtritis').single();
      if (!outlet) throw new Error('Outlet tidak ditemukan.');
      const { data: orders } = await supabase.from('orders').select('id,customer_id').eq('outlet_id', outlet.id);
      const ids = (orders || []).map((o) => o.id);
      const custIds = [...new Set((orders || []).map((o) => o.customer_id).filter(Boolean))];
      if (ids.length > 0) {
        for (const table of ['order_status_history', 'payments', 'order_items']) {
          const { error } = await supabase.from(table).delete().in('order_id', ids);
          if (error) throw new Error(error.message);
        }
        const { error: orderError } = await supabase.from('orders').delete().in('id', ids);
        if (orderError) throw new Error(orderError.message);
      }
      if (custIds.length > 0) {
        await supabase.from('customers').delete().in('id', custIds);
      }
      setWipeResult(`Beresih: ${ids.length} pesanan + ${custIds.length} pelanggan tes dihapus.`);
      setWipeText('');
    } catch (err) {
      setWipeResult(err.message || 'Gagal mereset.');
    }
    setWiping(false);
  };
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFormError('QRIS harus gambar (JPG/PNG).');
      return;
    }
    if (file.size > 1500000) {
      setFormError('Foto QRIS maksimal 1,5 MB.');
      return;
    }
    setFormError('');
    setQrisFile(file);
    setQrisPreview(URL.createObjectURL(file));
  };

  const onSave = async () => {
    setFormError('');
    setSaving(true);
    let qrisUrl = draft.qris_image_url || '';
    if (qrisFile) {
      const ext = (qrisFile.name.split('.').pop() || 'jpg').toLowerCase().slice(0, 4);
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(`qris/qris.${ext}`, qrisFile, { contentType: qrisFile.type, upsert: true });
      if (uploadError) {
        setSaving(false);
        setFormError(`Upload QRIS gagal: ${uploadError.message}`);
        return;
      }
      const { data } = supabase.storage.from('product-images').getPublicUrl(`qris/qris.${ext}`);
      qrisUrl = data.publicUrl;
      setQrisFile(null);
      setQrisPreview('');
    }
    const result = await save({
      outlet_name: draft.outlet_name.trim() || DEFAULTS.outlet_name,
      address: draft.address.trim(),
      phone: draft.phone.trim(),
      open_time: draft.open_time,
      close_time: draft.close_time,
      open_days: draft.open_days,
      dine_in: draft.dine_in,
      takeaway: draft.takeaway,
      pickup: draft.pickup,
      delivery: draft.delivery,
      force_closed: draft.force_closed,
      qris_image_url: qrisUrl,
    });
    setSaving(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setSavedAt(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
  };

  return (
    <>
      <PageHeader
        eyebrow="Operasional outlet"
        title="Pengaturan"
        actions={
          <>
            <Link to="/" className="btn-outline">Lihat toko</Link>
            <button type="button" className="btn-primary" onClick={onSave} disabled={!configured || saving || status !== 'ready'}>
              {saving ? 'Menyimpan...' : 'Simpan perubahan'}
            </button>
          </>
        }
      />

      <div className="admin-body">
        {!configured && (
          <section className="panel">
            <EmptyState
              icon={<IconBox size={26} />}
              title="Backend belum terhubung"
              desc="Isi env Supabase di Vercel dan jalankan migrasi 0004."
            />
          </section>
        )}

        {configured && status === 'error' && (
          <section className="panel">
            <EmptyState
              icon={<IconBox size={26} />}
              title="Pengaturan tidak dapat dimuat"
              desc={error || 'Periksa koneksi dan migrasi database.'}
            />
            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={reload}>Coba lagi</button>
            </div>
          </section>
        )}

        {configured && status !== 'error' && (
          <>
            {savedAt && (
              <div className="alert-bar alert-bar--ok" role="status">
                Tersimpan {savedAt} — landing ikut diperbarui.
              </div>
            )}
            {formError && <p className="form-error" role="alert">{formError}</p>}

            <div className="grid-2">
              <div className="stack">
                <section className="panel">
                  <div className="panel-head"><h3>Status outlet</h3></div>
                  <ul className="setting-list">
                    <li>
                      <span>Tutup sementara<br /><small className="field-hint">Menimpa jadwal — landing tampil “Tutup”.</small></span>
                      <Toggle
                        checked={draft.force_closed === 'true'}
                        onChange={setBool('force_closed')}
                        label="Tutup sementara outlet"
                      />
                    </li>
                  </ul>
                </section>

                <section className="panel">
                  <div className="panel-head"><h3>Jam &amp; hari buka</h3></div>
                  <div className="form-grid">
                    <label className="form-field">
                      <span>Buka pukul</span>
                      <input type="time" value={draft.open_time} onChange={set('open_time')} />
                    </label>
                    <label className="form-field">
                      <span>Tutup pukul</span>
                      <input type="time" value={draft.close_time} onChange={set('close_time')} />
                    </label>
                  </div>
                  <div className="chip-row" role="group" aria-label="Hari buka" style={{ marginTop: 14, marginBottom: 0 }}>
                    {DAYS.map(([day, label]) => {
                      const on = parseDays(draft.open_days).includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          role="switch"
                          aria-checked={on}
                          aria-label={`Buka hari ${label}`}
                          className={`chip${on ? ' is-active' : ''}`}
                          onClick={() => toggleDay(day)}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-head"><h3>Kanal pesanan</h3></div>
                  <ul className="setting-list">
                    {CHANNELS.map(([key, label]) => (
                      <li key={key}>
                        <span>{label}</span>
                        <Toggle
                          checked={draft[key] === 'true'}
                          onChange={setBool(key)}
                          label={label}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="stack">
                <section className="panel">
                  <div className="panel-head"><h3>Informasi outlet</h3></div>
                  <div className="field-stack">
                    <label className="form-field">
                      <span>Nama outlet</span>
                      <input type="text" value={draft.outlet_name} onChange={set('outlet_name')} maxLength={60} />
                    </label>
                    <label className="form-field">
                      <span>Alamat outlet</span>
                      <input type="text" value={draft.address} onChange={set('address')} placeholder="Jl. Parangtritis ..." maxLength={160} />
                    </label>
                    <label className="form-field">
                      <span>Nomor kontak</span>
                      <input type="tel" value={draft.phone} onChange={set('phone')} placeholder="08..." maxLength={20} />
                    </label>
                  </div>
                  <p className="panel-desc mt-2">Tampil di footer landing setelah disimpan.</p>
                </section>

                <section className="panel">
                  <div className="panel-head"><h3>QRIS outlet</h3></div>
                  <div className="photo-row">
                    <div className="photo-preview" aria-hidden="true">
                      {(qrisPreview || draft.qris_image_url)
                        ? <img src={qrisPreview || draft.qris_image_url} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        : <IconBox size={22} />}
                    </div>
                    <label className="btn-outline btn-sm photo-pick">
                      Pilih foto QRIS
                      <input type="file" accept="image/*" onChange={onQris} hidden />
                    </label>
                  </div>
                  <p className="panel-desc mt-2">Tampil di checkout saat pelanggan pilih QRIS.</p>
                </section>

                <section className="panel">
                  <div className="panel-head"><h3>Status sistem</h3></div>
                  <p className="admin-status-line">
                    <span className="dot dot--ready" />
                    {status === 'ready' ? 'Terhubung database outlet' : 'Memuat...'}
                  </p>
                </section>

                <section className="panel panel-danger">
                  <div className="panel-head"><h3>Zona berbahaya</h3></div>
                  <p className="panel-desc">
                    Reset data demo: hapus semua pesanan, pembayaran, riwayat,
                    dan pelanggan tes. Produk, kategori, dan pengaturan
                    <strong> tidak ikut terhapus</strong>. Untuk demo/jualan.
                  </p>
                  <div className="filter-bar">
                    <label className="search-field" style={{ maxWidth: 220 }}>
                      <span className="visually-hidden">Ketik HAPUS</span>
                      <input
                        type="text" placeholder="Ketik HAPUS"
                        value={wipeText} onChange={(e) => setWipeText(e.target.value)}
                      />
                    </label>
                    <button type="button" className="btn-primary" disabled={wiping} onClick={onWipe} style={{ background: '#b42318', borderColor: '#b42318' }}>
                      {wiping ? 'Menghapus...' : 'Reset data demo'}
                    </button>
                  </div>
                  {wipeResult && <p className="panel-desc" role="status">{wipeResult}</p>}
                </section>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

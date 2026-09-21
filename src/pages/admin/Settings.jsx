import { useState } from 'react';
import PageHeader from '../../components/admin/PageHeader.jsx';

const CHANNEL_KEYS = [
  ['dine', 'Makan di tempat'],
  ['takeaway', 'Bawa pulang'],
  ['pickup', 'Ambil sendiri'],
  ['delivery', 'Diantar'],
];

function Toggle({ id, checked, onChange, label }) {
  return (
    <button
      type="button"
      id={id}
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

export default function Settings() {
  // State lokal saja: belum ada Supabase, jadi perubahan di sini belum tersimpan.
  const [channels, setChannels] = useState({ dine: true, takeaway: true, pickup: false, delivery: false });
  const [sound, setSound] = useState(true);

  return (
    <>
      <PageHeader
        eyebrow="Operasional outlet"
        title="Pengaturan"
        actions={<button type="button" className="btn-outline">Lihat toko</button>}
      />

      <div className="admin-body">
        <div className="grid-2">
          <div className="stack">
            <section className="panel">
              <div className="panel-head"><h3>Kanal pesanan</h3></div>
              <ul className="setting-list">
                {CHANNEL_KEYS.map(([key, label]) => (
                  <li key={key}>
                    <span>{label}</span>
                    <Toggle
                      id={`kanal-${key}`}
                      label={label}
                      checked={channels[key]}
                      onChange={(value) => setChannels((prev) => ({ ...prev, [key]: value }))}
                    />
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel">
              <div className="panel-head"><h3>Notifikasi</h3></div>
              <p className="panel-desc">Atur pemberitahuan pesanan baru, stok menipis, dan penutupan sesi kas.</p>
              <ul className="setting-list">
                <li>
                  <span>Suara pesanan baru</span>
                  <Toggle id="suara" label="Suara pesanan baru" checked={sound} onChange={setSound} />
                </li>
              </ul>
            </section>
          </div>

          <div className="stack">
            <section className="panel">
              <div className="panel-head"><h3>Informasi outlet</h3></div>
              <div className="field-stack">
                <label className="field">
                  <span className="visually-hidden">Nama outlet</span>
                  <input type="text" defaultValue="Naoki Chicken Parangtritis" />
                </label>
                <label className="field">
                  <span className="visually-hidden">Alamat outlet</span>
                  <input type="text" placeholder="Alamat outlet" />
                </label>
                <label className="field">
                  <span className="visually-hidden">Nomor kontak</span>
                  <input type="tel" placeholder="Nomor kontak" />
                </label>
              </div>
              <button type="button" className="btn-primary" disabled>Simpan perubahan</button>
              <p className="panel-desc mt-2">Penyimpanan aktif setelah outlet terhubung ke basis data.</p>
            </section>

            <section className="panel">
              <div className="panel-head"><h3>Status sistem</h3></div>
              <p className="admin-status-line">
                <span className="dot dot--warn" />
                Mode prototipe — belum terhubung data outlet
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

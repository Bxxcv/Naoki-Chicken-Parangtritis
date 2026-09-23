import PageHeader from '../../components/admin/PageHeader.jsx';
import { useAuth } from '../../lib/auth.jsx';
import { IconStaff } from '../../components/admin/icons.jsx';

// Manajemen akun staf dilakukan di dashboard Supabase (Invite user)
// karena daftar/menonaktifkan user butuh service-role yang TIDAK BOLEH
// ada di aplikasi klien (docs/SECURITY.md). Halaman ini jujur soal itu.
const MATRIX = [
  ['Pemilik', 'Semua modul + keamanan'],
  ['Admin', 'Operasional harian (kecuali keamanan)'],
  ['Kasir', 'Order, POS, bayar, sesi kas'],
  ['Dapur', 'Antrean + status produksi'],
];

export default function Karyawan() {
  const { user, signOut } = useAuth();

  return (
    <>
      <PageHeader
        eyebrow="Akses tim"
        title="Karyawan"
      />

      <div className="admin-body">
        <div className="grid-2">
          <section className="panel">
            <div className="panel-head"><h3>Sesi aktif</h3></div>
            <p className="panel-desc">
              Masuk sebagai: <strong>{user ? user.email : '-'}</strong>
            </p>
            <button type="button" className="btn-outline" onClick={signOut}>Keluar</button>
          </section>

          <section className="panel">
            <div className="panel-head"><h3><IconStaff size={17} /> Tambah staf</h3></div>
            <ol className="panel-desc" style={{ paddingLeft: 18, margin: 0, lineHeight: 2 }}>
              <li>Buka dashboard Supabase → Authentication → Users.</li>
              <li>Invite user dengan email staf (auto-confirm).</li>
              <li>Staf masuk di <strong>/admin</strong> dengan email itu.</li>
            </ol>
            <p className="panel-desc mt-2">Batasan peran per modul menyusul bersama matriks hak akses server.</p>
          </section>
        </div>

        <section className="panel">
          <div className="panel-head"><h3>Peran</h3></div>
          <ul className="legend-list">
            {MATRIX.map(([role, scope]) => (
              <li key={role}>
                <span>{role}</span>
                <strong>{scope}</strong>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

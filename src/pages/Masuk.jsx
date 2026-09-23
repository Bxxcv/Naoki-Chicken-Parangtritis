import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/customer/BrandLogo.jsx';
import { useAuth } from '../lib/auth.jsx';

// Masuk pelanggan via Google. Tanpa akun tetap bisa pesan sebagai tamu.
export default function Masuk() {
  const { user, loading, signInWithGoogle, signOut, configured } = useAuth();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onGoogle = async () => {
    setError('');
    setBusy(true);
    const result = await signInWithGoogle();
    setBusy(false);
    if (!result.ok) setError(`${result.error} Minta admin mengaktifkan Google di dashboard Supabase.`);
  };

  return (
    <div className="customer-shell">
      <div className="auth-wrap">
        <div className="auth-card">
          <BrandLogo />
          <h1>{user ? 'Akun Anda' : 'Masuk'}</h1>
          <p className="auth-sub">
            {user
              ? 'Pesanan Anda tertaut ke akun ini dan tampil di Riwayat.'
              : 'Masuk agar pesanan tersimpan di Riwayat. Tanpa akun pun tetap bisa pesan sebagai tamu.'}
          </p>
          {!configured && (
            <p className="form-error" role="alert">Backend belum terhubung.</p>
          )}
          {loading ? (
            <p className="auth-sub">Memuat sesi...</p>
          ) : user ? (
            <>
              <p className="auth-user">{user.email}</p>
              <Link to="/riwayat" className="btn-gold auth-submit">Lihat riwayat</Link>
              <button type="button" className="btn-outline auth-submit" onClick={signOut}>
                Keluar
              </button>
            </>
          ) : (
            <>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button
                type="button"
                className="btn-gold auth-submit"
                disabled={busy || !configured}
                onClick={onGoogle}
              >
                {busy ? 'Membuka Google...' : 'Masuk dengan Google'}
              </button>
              <Link to="/" className="btn-outline auth-submit">Kembali belanja</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

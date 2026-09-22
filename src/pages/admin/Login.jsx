import { useState } from 'react';
import { useAuth } from '../../lib/auth.jsx';
import BrandLogo from '../../components/customer/BrandLogo.jsx';

export default function Login() {
  const { signIn, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Isi email dan kata sandi.');
      return;
    }
    setBusy(true);
    const result = await signIn(email.trim(), password);
    setBusy(false);
    if (!result.ok) setError(result.error);
  };

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <BrandLogo />
        <h1>Masuk operasional</h1>
        <p className="auth-sub">Khusus tim outlet Naoki Chicken Parangtritis.</p>
        {!configured && (
          <p className="form-error" role="alert">Backend belum terhubung — isi env Supabase dulu.</p>
        )}
        <label className="form-field">
          <span>Email</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@outlet.id"
          />
        </label>
        <label className="form-field">
          <span>Kata sandi</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="btn-primary auth-submit" disabled={busy || !configured}>
          {busy ? 'Memeriksa...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}

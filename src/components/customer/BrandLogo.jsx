import { Link } from 'react-router-dom';

// Logo resmi Naoki Chicken. Maskot dipakai sebagai lambang di dalam kotak merah,
// wordmark ditulis sebagai teks supaya tetap tajam di semua ukuran layar.
// (Wordmark di file logo asli berwarna krem, jadi tidak bisa dipakai di latar terang.)
export default function BrandLogo({ to = '/', size = 'md' }) {
  return (
    <Link to={to} className={`brand-lockup brand-lockup--${size}`} aria-label="Naoki Chicken Parangtritis">
      <span className="brand-badge">
        <img src="/brand/naoki-mark.png" alt="" width="364" height="420" />
      </span>
      <span className="brand-words">
        <span className="brand-name">
          Naoki <em>Chicken</em>
        </span>
        <span className="brand-outlet">Parangtritis</span>
      </span>
    </Link>
  );
}

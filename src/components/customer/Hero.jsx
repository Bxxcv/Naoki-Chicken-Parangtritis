import { useState } from 'react';
import FallingChicken from './FallingChicken.jsx';
import { IconPin } from './icons.jsx';

export default function Hero() {
  const [dropKey, setDropKey] = useState(0);

  return (
    <section className="hero" id="beranda">
      <div className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="status-pill">
              <IconPin width="14" height="14" />
              Outlet Parangtritis
            </span>
            <h1 className="mt-3">Ayam Goreng Renyah, Panas Sampai ke Mejamu.</h1>
            <p className="lead text-secondary mt-3">
              Naoki Chicken Parangtritis siap melayani dine-in, takeaway, pickup, dan delivery langsung dari outlet.
            </p>
            <div className="d-flex gap-3 mt-4 flex-wrap hero-cta">
              <a href="#menu" className="btn btn-danger btn-lg">Pesan Sekarang</a>
              <button type="button" className="btn btn-outline-dark btn-lg">Lacak Pesanan</button>
            </div>
          </div>
          <div className="col-lg-6">
            <button
              type="button"
              className="hero-visual"
              onClick={() => setDropKey((k) => k + 1)}
              aria-label="Putar ulang animasi ayam goreng jatuh ke piring"
            >
              <FallingChicken key={dropKey} />
            </button>
            <p className="hero-visual-hint">Ketuk ilustrasi untuk memutar ulang</p>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import FallingDrumsticks from '../components/FallingDrumsticks.jsx';
import ProductCard from '../components/ProductCard.jsx';
import {
  FoodIcon,
  Search,
  Cart,
  Menu,
  MapPin,
  Clock,
  Scooter,
  Phone,
  Instagram,
  Whatsapp,
  Drumstick,
} from '../components/FoodIcons.jsx';
import { categories, products } from '../data/menu.js';

export default function Home() {
  const [activeCat, setActiveCat] = useState('all');
  const [cartCount] = useState(0);

  const filtered =
    activeCat === 'all' ? products : products.filter((p) => p.category === activeCat);

  return (
    <div className="customer-shell">
      {/* ===== Top Bar ===== */}
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand-block">
            <Drumstick size={30} className="brand-logo" />
            <span className="brand-text">
              <span className="brand">Naoki<span className="brand-red">Chicken</span></span>
              <span className="brand-sub">
                <MapPin size={12} /> Parangtritis
              </span>
            </span>
          </Link>

          <nav className="topbar-nav">
            <a href="#menu" className="topbar-link">Menu</a>
            <a href="#promo" className="topbar-link">Promo</a>
            <a href="#kontak" className="topbar-link">Kontak</a>
            <Link to="/track" className="topbar-link">Lacak Pesanan</Link>
          </nav>

          <div className="topbar-actions">
            <button className="icon-btn" aria-label="Cari menu">
              <Search size={20} />
            </button>
            <button className="icon-btn cart-btn" aria-label="Keranjang">
              <Cart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <a href="#menu" className="btn-order">Pesan Sekarang</a>
            <button className="icon-btn menu-toggle" aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <FallingDrumsticks />
        <div className="container hero-inner">
          <div className="hero-text reveal-up">
            <span className="eyebrow">
              <MapPin size={13} /> Parangtritis · Yogyakarta
            </span>
            <h1 className="hero-title">
              Ayam Goreng <span className="hl">Renyah</span>,<br />
              Langsung dari Dapur Kami.
            </h1>
            <p className="hero-sub">
              Pesan makanan favoritmu tanpa ribet. Pilih menu, bayar mudah,
              lacak pesananmu langsung dari ponsel.
            </p>
            <div className="hero-cta">
              <a href="#menu" className="btn-primary">
                Lihat Menu <span className="arrow">→</span>
              </a>
              <Link to="/track" className="btn-ghost">
                Lacak Pesanan
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>4.9</strong>
                <span>Rating Pelanggan</span>
              </div>
              <div className="hero-divider" />
              <div className="hero-stat">
                <strong>15menit</strong>
                <span>Rata-rata Siap</span>
              </div>
              <div className="hero-divider" />
              <div className="hero-stat">
                <strong>Halal</strong>
                <span>100% Tersertifikasi</span>
              </div>
            </div>
          </div>

          <div className="hero-visual reveal-up" style={{ '--reveal-delay': '120ms' }}>
            <div className="hero-plate">
              <div className="hero-glow" />
              <Drumstick size={300} className="hero-drumstick" />
            </div>
            <div className="hero-chip chip-1">
              <Clock size={14} /> Siap cepat
            </div>
            <div className="hero-chip chip-2">
              <span className="dot-live" /> Buka sekarang
            </div>
          </div>
        </div>
        <div className="hero-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none">
            <path d="M0 40 C 240 0 480 0 720 30 C 960 60 1200 60 1440 30 L1440 70 L0 70 Z" fill="#fff8ed" />
          </svg>
        </div>
      </section>

      {/* ===== Category scroller ===== */}
      <section className="cats" id="menu">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="section-eyebrow">Menu Kami</span>
              <h2 className="section-title">Pilih Kategori Favoritmu</h2>
            </div>
            <a href="#all" className="section-link">Lihat semua →</a>
          </div>
          <div className="cats-row">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`cat-pill ${activeCat === c.id ? 'active' : ''}`}
                onClick={() => setActiveCat(c.id)}
              >
                <FoodIcon name={c.icon} size={22} className="cat-icon" />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Products ===== */}
      <section className="products">
        <div className="container">
          <div className="products-grid">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Promo ===== */}
      <section className="promo" id="promo">
        <div className="container">
          <div className="section-head center">
            <span className="section-eyebrow">Penawaran</span>
            <h2 className="section-title">Hemat Lebih, Makan Lebih</h2>
          </div>
          <div className="promo-grid">
            <div className="promo-card promo-delivery reveal-up">
              <div className="promo-visual">
                <Scooter size={56} />
              </div>
              <div className="promo-body">
                <span className="promo-tag">Gratis Antar</span>
                <h3 className="promo-title">Antar Gratis area Parangtritis</h3>
                <p className="promo-text">
                  Pesanan di atas Rp40.000, antar langsung ke lokasimu tanpa biaya tambahan.
                </p>
              </div>
            </div>
            <div className="promo-card promo-combo reveal-up" style={{ '--reveal-delay': '100ms' }}>
              <div className="promo-visual promo-combo-visual">
                <Drumstick size={52} />
                <Drumstick size={40} className="combo-2" />
              </div>
              <div className="promo-body">
                <span className="promo-tag promo-tag-gold">Paket Hemat</span>
                <h3 className="promo-title">Beli 5 Ayam, Gratis 1</h3>
                <p className="promo-text">
                  Berlaku setiap hari pukul 14.00–17.00. Stok terbatas setiap hari.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trust strip ===== */}
      <section className="trust">
        <div className="container trust-row">
          <div className="trust-item">
            <div className="trust-ic"><Clock size={22} /></div>
            <div>
              <strong>Cepat</strong>
              <span>Pesanan siap rata-rata 15 menit</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-ic"><Drumstick size={26} /></div>
            <div>
              <strong>Fresh</strong>
              <span>Dimasak saat dipesan, bukan dipanaskan</span>
            </div>
          </div>
          <div className="trust-item">
            <div className="trust-ic"><MapPin size={22} /></div>
            <div>
              <strong>Halal</strong>
              <span>Bahan tersertifikasi & terjamin</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer" id="kontak">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand-block">
              <Drumstick size={28} className="brand-logo" />
              <span className="brand-text">
                <span className="brand">Naoki<span className="brand-red">Chicken</span></span>
                <span className="brand-sub">Parangtritis</span>
              </span>
            </Link>
            <p className="footer-tagline">
              Ayam goreng renyah khas Parangtritis. Dibuat segar setiap hari untuk pelanggan setia.
            </p>
            <div className="footer-social">
              <a href="#" className="social-btn" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="social-btn" aria-label="WhatsApp"><Whatsapp size={18} /></a>
              <a href="tel:" className="social-btn" aria-label="Telepon"><Phone size={16} /></a>
            </div>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">Menu</h4>
            <a href="#menu" className="footer-link">Ayam Goreng</a>
            <a href="#menu" className="footer-link">Paket Nasi</a>
            <a href="#menu" className="footer-link">Sides</a>
            <a href="#menu" className="footer-link">Minuman</a>
          </div>
          <div className="footer-col">
            <h4 className="footer-h">Bantuan</h4>
            <Link to="/track" className="footer-link">Lacak Pesanan</Link>
            <a href="#" className="footer-link">Cara Pemesanan</a>
            <a href="#" className="footer-link">Kebijakan</a>
          </div>
          <div className="footer-col footer-contact">
            <h4 className="footer-h">Kunjungi Kami</h4>
            <p className="footer-info"><MapPin size={14} /> Jl. Parangtritis, Yogyakarta</p>
            <p className="footer-info"><Clock size={14} /> 10.00 – 22.00 WIB</p>
            <p className="footer-info"><Phone size={14} /> 0812-0000-0000</p>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2025 Naoki Chicken Parangtritis. All rights reserved.</span>
            <span className="footer-admin">
              <Link to="/admin">Panel Admin →</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/customer/Hero.jsx';
import CategoryScroller from '../components/customer/CategoryScroller.jsx';
import ProductCard from '../components/customer/ProductCard.jsx';
import {
  IconCart,
  IconDrumstick,
  IconBowl,
  IconDrink,
  IconDineIn,
  IconTakeaway,
  IconPickup,
  IconDelivery,
  IconPin,
  IconToggle,
} from '../components/customer/icons.jsx';
import useReveal from '../lib/useReveal.js';

// Data menu di bawah ini masih mock untuk tahap desain UI/UX — belum terhubung
// ke Supabase. Lihat prompts/01-DESIGNARENA-LOVABLE-UI.md: "Keep data mocked."
const ICONS_BY_KEY = { drumstick: IconDrumstick, bowl: IconBowl, drink: IconDrink };

const CATEGORIES = ['Semua', 'Ayam Goreng', 'Ayam Geprek', 'Paket Hemat', 'Nasi & Lauk', 'Minuman'];

const PRODUCTS = [
  { id: 'p1', name: 'Ayam Goreng Original', category: 'Ayam Goreng', price: 18000, note: '1 potong ayam + sambal bawang', icon: 'drumstick' },
  { id: 'p2', name: 'Ayam Goreng Madu', category: 'Ayam Goreng', price: 20000, note: 'Manis gurih berbalut madu', icon: 'drumstick' },
  { id: 'p3', name: 'Ayam Geprek Sambal Bawang', category: 'Ayam Geprek', price: 22000, note: 'Level pedas sesuai selera', icon: 'drumstick' },
  { id: 'p4', name: 'Paket Hemat Ayam + Nasi', category: 'Paket Hemat', price: 20000, note: 'Ayam + nasi + es teh', icon: 'bowl' },
  { id: 'p5', name: 'Nasi + Tempe Orek', category: 'Nasi & Lauk', price: 12000, note: 'Cocok jadi teman ayam', icon: 'bowl' },
  { id: 'p6', name: 'Es Teh Manis', category: 'Minuman', price: 5000, note: 'Segar dan pas manisnya', icon: 'drink' },
];

const STEPS = [
  { title: 'Pilih Menu', desc: 'Cari ayam goreng, paket, dan minuman favoritmu.' },
  { title: 'Pilih Cara Pesan', desc: 'Dine-in, takeaway, pickup, atau delivery.' },
  { title: 'Bayar', desc: 'Cash atau QRIS langsung di outlet.' },
  { title: 'Santap', desc: 'Ambil, ditemani, atau diantar ke lokasimu.' },
];

const MODES = [
  { icon: IconDineIn, title: 'Dine-in', desc: 'Santap langsung di outlet Parangtritis.' },
  { icon: IconTakeaway, title: 'Takeaway', desc: 'Bawa pulang setelah selesai digoreng.' },
  { icon: IconPickup, title: 'Pickup', desc: 'Pesan dulu, ambil saat sudah siap.' },
  { icon: IconDelivery, title: 'Delivery', desc: 'Diantar ke lokasimu di sekitar Parangtritis.' },
];

const WHY_US = [
  { icon: IconPin, title: 'Dekat Pantai Parangtritis', desc: 'Lokasi strategis di kawasan wisata Parangtritis.' },
  { icon: IconToggle, title: 'Fleksibel Cara Pesan', desc: 'Dine-in, takeaway, pickup, atau delivery sesuai kebutuhanmu.' },
  { icon: IconPickup, title: 'Dikelola Langsung Outlet', desc: 'Dijalankan langsung oleh tim outlet, bukan waralaba jarak jauh.' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [cart, setCart] = useState({});
  const [bump, setBump] = useState(false);
  const bumpTimer = useRef(null);

  const [stepsRef, stepsVisible] = useReveal();
  const [modesRef, modesVisible] = useReveal();
  const [whyRef, whyVisible] = useReveal();
  const [ctaRef, ctaVisible] = useReveal();

  const cartCount = Object.values(cart).reduce((sum, n) => sum + n, 0);

  const handleAdd = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setBump(true);
    if (bumpTimer.current) window.clearTimeout(bumpTimer.current);
    bumpTimer.current = window.setTimeout(() => setBump(false), 380);
  };

  const visibleProducts = activeCategory === 'Semua'
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.category === activeCategory);

  return (
    <main className="customer-shell">
      <nav className="navbar border-bottom bg-white sticky-top">
        <div className="container py-2 d-flex align-items-center justify-content-between gap-3">
          <div>
            <div className="brand">Naoki<span>Chicken</span></div>
            <div className="small text-muted">Parangtritis</div>
          </div>
          <div className="d-none d-md-flex align-items-center gap-4">
            <a href="#menu" className="text-decoration-none text-dark fw-semibold small">Menu</a>
            <a href="#cara-pesan" className="text-decoration-none text-dark fw-semibold small">Cara Pesan</a>
            <a href="#kenapa-kami" className="text-decoration-none text-dark fw-semibold small">Kenapa Kami</a>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Link to="/admin" className="admin-ghost-link d-none d-sm-inline-block">Admin Preview</Link>
            <a href="#menu" className="cart-pill" aria-label={`Lihat menu, keranjang berisi ${cartCount} item`}>
              <IconCart />
              {cartCount > 0 && <span className={`cart-badge${bump ? ' bump' : ''}`}>{cartCount}</span>}
            </a>
          </div>
        </div>
      </nav>

      <Hero />

      <section className="py-5" id="cara-pesan" ref={stepsRef}>
        <div className={`container reveal ${stepsVisible ? 'is-visible' : ''}`}>
          <h2 className="h3 fw-bold mb-1">Cara Pesan</h2>
          <p className="text-secondary mb-4">Empat langkah singkat, dari pilih menu sampai santap.</p>
          <div className="row g-3 steps-row">
            {STEPS.map((step, index) => (
              <div className="col-6 col-lg-3" key={step.title}>
                <div className="step-card">
                  <div className="step-number">{index + 1}</div>
                  <h3 className="h6 fw-bold mb-1">{step.title}</h3>
                  <p className="small text-secondary mb-0">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" id="menu">
        <div className="container">
          <h2 className="h3 fw-bold mb-1">Menu Favorit</h2>
          <p className="menu-caption mb-3">Pratinjau menu untuk tahap desain — harga & ketersediaan final menyusul.</p>

          <CategoryScroller categories={CATEGORIES} active={activeCategory} onSelect={setActiveCategory} />

          <div className="row g-3 mt-1">
            {visibleProducts.map((product) => {
              const ProductIcon = ICONS_BY_KEY[product.icon];
              return (
                <div className="col-6 col-lg-4" key={product.id}>
                  <ProductCard
                    product={{ ...product, icon: <ProductIcon /> }}
                    qty={cart[product.id] || 0}
                    onAdd={() => handleAdd(product.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-5" ref={modesRef}>
        <div className={`container reveal ${modesVisible ? 'is-visible' : ''}`}>
          <div className="order-modes p-4 p-lg-5">
            <h2 className="h4 fw-bold mb-1">Pesan Sesuai Caramu</h2>
            <p className="mode-subtitle mb-4">Outlet Parangtritis melayani empat cara pesan.</p>
            <div className="row g-3">
              {MODES.map(({ icon: Icon, title, desc }) => (
                <div className="col-6 col-lg-3" key={title}>
                  <div className="mode-card">
                    <div className="mode-icon"><Icon /></div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" id="kenapa-kami" ref={whyRef}>
        <div className={`container reveal ${whyVisible ? 'is-visible' : ''}`}>
          <h2 className="h3 fw-bold mb-4">Kenapa Naoki Chicken Parangtritis</h2>
          <div className="row g-4">
            {WHY_US.map(({ icon: Icon, title, desc }) => (
              <div className="col-md-4" key={title}>
                <div className="why-card">
                  <div className="why-icon"><Icon /></div>
                  <h3 className="h6 fw-bold mb-1">{title}</h3>
                  <p className="small text-secondary mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5" ref={ctaRef}>
        <div className={`container reveal ${ctaVisible ? 'is-visible' : ''}`}>
          <div className="landing-footer-cta">
            <h2 className="h3 fw-bold mb-2">Siap Coba Ayam Goreng Renyah Kami?</h2>
            <p className="mb-4">Pilih menu, tentukan cara pesan, selesai.</p>
            <a href="#menu" className="btn btn-light btn-lg">Lihat Menu</a>
          </div>
        </div>
      </section>

      <footer className="py-4 border-top">
        <div className="container small text-muted d-flex flex-wrap justify-content-between gap-2">
          <span>© {new Date().getFullYear()} Naoki Chicken Parangtritis</span>
          <span>Outlet dikelola independen di Parangtritis</span>
        </div>
      </footer>
    </main>
  );
}

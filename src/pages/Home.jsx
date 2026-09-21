import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/customer/Hero.jsx';
import BrandLogo from '../components/customer/BrandLogo.jsx';
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
} from '../components/customer/icons.jsx';
import useReveal from '../lib/useReveal.js';

// Menu di bawah masih mock untuk tahap desain UI/UX — belum terhubung Supabase.
// Lihat prompts/01-DESIGNARENA-LOVABLE-UI.md: "Keep data mocked."
const ICONS_BY_KEY = { drumstick: IconDrumstick, bowl: IconBowl, drink: IconDrink };

const CATEGORIES = ['Semua', 'Ayam Goreng', 'Ayam Geprek', 'Paket Hemat', 'Nasi & Lauk', 'Minuman'];

const PRODUCTS = [
  { id: 'p1', name: 'Ayam Goreng Original', category: 'Ayam Goreng', price: 18000, note: '1 potong ayam + sambal bawang', icon: 'drumstick', tag: 'Favorit' },
  { id: 'p2', name: 'Ayam Goreng Madu', category: 'Ayam Goreng', price: 20000, note: 'Manis gurih berbalut madu', icon: 'drumstick' },
  { id: 'p3', name: 'Ayam Geprek Sambal Bawang', category: 'Ayam Geprek', price: 22000, note: 'Level pedas sesuai selera', icon: 'drumstick', tag: 'Pedas' },
  { id: 'p4', name: 'Paket Hemat Ayam + Nasi', category: 'Paket Hemat', price: 20000, note: 'Ayam + nasi + es teh', icon: 'bowl', tag: 'Hemat' },
  { id: 'p5', name: 'Nasi + Tempe Orek', category: 'Nasi & Lauk', price: 12000, note: 'Cocok jadi teman ayam', icon: 'bowl' },
  { id: 'p6', name: 'Es Teh Manis', category: 'Minuman', price: 5000, note: 'Segar dan pas manisnya', icon: 'drink' },
];

const MODES = [
  { icon: IconDineIn, title: 'Dine-in', desc: 'Santap di outlet', tone: 'red' },
  { icon: IconTakeaway, title: 'Takeaway', desc: 'Bawa pulang', tone: 'gold' },
  { icon: IconPickup, title: 'Pickup', desc: 'Pesan dulu, ambil nanti', tone: 'red' },
  { icon: IconDelivery, title: 'Delivery', desc: 'Diantar ke lokasimu', tone: 'gold' },
];

const STEPS = [
  { title: 'Pilih menu', desc: 'Ayam goreng, paket hemat, sampai minuman.' },
  { title: 'Tentukan cara pesan', desc: 'Dine-in, takeaway, pickup, atau delivery.' },
  { title: 'Bayar', desc: 'Cash atau QRIS langsung di outlet.' },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [cart, setCart] = useState({});
  const [bump, setBump] = useState(false);
  const bumpTimer = useRef(null);

  const [modesRef, modesVisible] = useReveal();
  const [menuRef, menuVisible] = useReveal(0.1);
  const [promoRef, promoVisible] = useReveal(0.15);

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
      <header className="topbar">
        <div className="container topbar-inner">
          <a href="#beranda" className="topbar-brand" aria-label="Naoki Chicken Parangtritis, ke beranda">
            <BrandLogo />
          </a>

          <nav className="topbar-nav" aria-label="Navigasi utama">
            <a href="#menu">Menu</a>
            <a href="#cara-pesan">Cara Pesan</a>
            <a href="#outlet">Outlet</a>
          </nav>

          <div className="topbar-actions">
            <a href="#menu" className="btn-red d-none d-sm-inline-flex">Pesan Sekarang</a>
            <a href="#menu" className="cart-pill" aria-label={`Lihat menu, keranjang berisi ${cartCount} item`}>
              <IconCart />
              {cartCount > 0 && <span className={`cart-badge${bump ? ' bump' : ''}`}>{cartCount}</span>}
            </a>
          </div>
        </div>
      </header>

      <Hero />

      <section className="mode-strip" ref={modesRef}>
        <div className={`container reveal ${modesVisible ? 'is-visible' : ''}`}>
          <div className="row g-3">
            {MODES.map(({ icon: Icon, title, desc, tone }) => (
              <div className="col-6 col-lg-3" key={title}>
                <div className={`mode-tile mode-tile--${tone}`}>
                  <span className="mode-tile-icon"><Icon width="26" height="26" /></span>
                  <span className="mode-tile-title">{title}</span>
                  <span className="mode-tile-desc">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="menu-section" id="menu" ref={menuRef}>
        <div className={`container reveal ${menuVisible ? 'is-visible' : ''}`}>
          <div className="section-head">
            <h2>Menu Favorit</h2>
            <p>Pratinjau menu untuk tahap desain — harga dan ketersediaan final menyusul.</p>
          </div>

          <CategoryScroller categories={CATEGORIES} active={activeCategory} onSelect={setActiveCategory} />

          <div className="row g-3 g-lg-4 mt-1">
            {visibleProducts.map((product) => {
              const ProductIcon = ICONS_BY_KEY[product.icon];
              return (
                <div className="col-6 col-lg-4" key={product.id}>
                  <ProductCard
                    product={{ ...product, icon: <ProductIcon width="34" height="34" /> }}
                    qty={cart[product.id] || 0}
                    onAdd={() => handleAdd(product.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="promo-section" id="cara-pesan" ref={promoRef}>
        <div className={`container reveal ${promoVisible ? 'is-visible' : ''}`}>
          <div className="row g-3 g-lg-4">
            <div className="col-lg-7">
              <div className="promo-card promo-card--cream">
                <h2>Pesan dalam tiga langkah.</h2>
                <ol className="promo-steps">
                  {STEPS.map((step) => (
                    <li key={step.title}>
                      <strong>{step.title}</strong>
                      <span>{step.desc}</span>
                    </li>
                  ))}
                </ol>
                <a href="#menu" className="btn-red">Mulai Pesan</a>
              </div>
            </div>

            <div className="col-lg-5" id="outlet">
              <div className="promo-card promo-card--red">
                <img src="/brand/naoki-mark.png" alt="" className="promo-mascot" width="364" height="420" loading="lazy" />
                <h2>Naoki Chicken &amp; Playground</h2>
                <p>Outlet Parangtritis dikelola langsung oleh tim lokal — pesanan disiapkan di tempat, bukan dikirim dari pusat.</p>
                <a href="#menu" className="btn-gold">Lihat Menu</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-top">
            <BrandLogo variant="full" />
            <p className="footer-slogan">Pasti Kenyang, Pasti Senang.</p>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Naoki Chicken Parangtritis</span>
            <Link to="/admin" className="footer-admin-link">Admin Preview</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

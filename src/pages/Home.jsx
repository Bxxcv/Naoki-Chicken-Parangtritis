import { useMemo, useState } from 'react';
import Navbar from '../components/customer/Navbar.jsx';
import BrandLogo from '../components/customer/BrandLogo.jsx';
import HeroVideo from '../components/customer/HeroVideo.jsx';
import CartDrawer from '../components/customer/CartDrawer.jsx';
import CartFab from '../components/customer/CartFab.jsx';
import Toast from '../components/customer/Toast.jsx';
import Faq from '../components/customer/Faq.jsx';
import useReveal from '../lib/useReveal.js';
import { CartProvider, useCart, formatIDR } from '../lib/cart.jsx';
import { useProducts, isEmpty, isLow } from '../lib/products.jsx';
import { flyToCart } from '../lib/flyToCart.js';
import {
  IconDineIn,
  IconTakeaway,
  IconPickup,
  IconDelivery,
  IconDrumstick,
  IconBag,
  IconCup,
  IconSearch,
  IconClock,
  IconArrowRight,
  IconPlus,
  IconInstagram,
  IconTiktok,
  IconWhatsapp,
} from '../components/customer/icons.jsx';

const CHANNELS = [
  { icon: IconDineIn, label: 'Makan di tempat' },
  { icon: IconTakeaway, label: 'Bawa pulang' },
  { icon: IconPickup, label: 'Ambil sendiri' },
  { icon: IconDelivery, label: 'Diantar' },
];

const CATEGORY_TONES = ['cream', 'gold', 'plain'];
const CATEGORY_ICONS = [IconDrumstick, IconBag, IconCup];

function categoryIcon(name, index) {
  const lower = (name || '').toLowerCase();
  if (lower.includes('ayam')) return IconDrumstick;
  if (lower.includes('paket')) return IconBag;
  if (lower.includes('minum')) return IconCup;
  return CATEGORY_ICONS[index % CATEGORY_ICONS.length];
}

const MENU_ICONS = { Ayam: IconDrumstick, Paket: IconBag, Minuman: IconCup };

function MenuCard({ item }) {
  const { add, notify } = useCart();
  const FallbackIcon = MENU_ICONS[item.category] || IconDrumstick;
  const empty = isEmpty(item);
  const low = isLow(item);

  const onAdd = (e) => {
    if (empty) return;
    const flightMs = flyToCart(e.currentTarget, item.category);
    add(item);
    const message = `${item.name} dimasukkan ke keranjang.`;
    // Toast menyusul saat lencana hampir mendarat.
    if (flightMs > 0) {
      setTimeout(() => notify(message), flightMs - 450);
    } else {
      notify(message);
    }
  };

  return (
    <article className={`menu-card${empty ? ' is-empty' : ''}`}>
      <div className="menu-image">
        <span className="menu-fallback" aria-hidden="true"><FallbackIcon size={44} /></span>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {empty
          ? <span className="menu-flag">Habis</span>
          : low
            ? <span className="menu-flag menu-flag--warn">Stok menipis</span>
            : null}
      </div>
      <div className="menu-body">
        <div className="menu-head">
          <h3>{item.name}</h3>
          <span className="menu-price">{formatIDR(item.price)}</span>
        </div>
        <p>{item.desc}</p>
        <button
          type="button"
          className="menu-add"
          disabled={empty}
          aria-label={empty ? `${item.name} habis` : `Tambahkan ${item.name} ke keranjang`}
          onClick={onAdd}
        >
          <IconPlus size={17} /> {empty ? 'Habis' : 'Tambah'}
        </button>
      </div>
    </article>
  );
}

const STEPS = [
  { no: '01', icon: IconSearch, title: 'Pilih yang Anda suka', desc: 'Jelajahi menu dan cek ketersediaannya.' },
  { no: '02', icon: IconBag, title: 'Sesuaikan pesanan', desc: 'Tentukan jumlah, catatan, dan cara menikmati.' },
  { no: '03', icon: IconClock, title: 'Pantau prosesnya', desc: 'Simpan nomor pesanan untuk melihat status terbaru.' },
];

const FAQ = [
  {
    q: 'Bagaimana melihat status pesanan?',
    a: 'Simpan nomor pesanan yang muncul setelah pemesanan, lalu buka halaman Lacak pesanan untuk melihat status terbarunya.',
  },
  {
    q: 'Apakah semua menu sudah tersedia?',
    a: 'Daftar menu, harga, dan ketersediaan masih disiapkan oleh outlet. Halaman ini akan mengikuti data resmi outlet begitu dikunci.',
  },
  {
    q: 'Di mana informasi alamat dan jam buka?',
    a: 'Alamat, jam buka, dan kontak resmi menunggu konfirmasi outlet dan akan ditampilkan di sini setelah tersedia.',
  },
];

const FOOTER_LINKS = [
  { title: 'Jelajahi', links: ['Beranda', 'Menu', 'Keranjang'] },
  { title: 'Pesanan Anda', links: ['Lacak pesanan', 'Riwayat pesanan', 'Pembayaran', 'Profil'] },
];

// Akun resmi outlet belum dikunci — tombol memberi info jujur via toast.
const SOCIALS = [
  { label: 'Instagram', Icon: IconInstagram },
  { label: 'TikTok', Icon: IconTiktok },
  { label: 'WhatsApp', Icon: IconWhatsapp },
];

function SocialButtons() {
  const { notify } = useCart();
  return (
    <div className="footer-social">
      {SOCIALS.map(({ label, Icon }) => (
        <button
          key={label}
          type="button"
          className="social-btn"
          aria-label={`${label} Naoki Chicken Parangtritis`}
          onClick={() => notify(`Akun ${label} outlet menyusul.`)}
        >
          <Icon size={19} />
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [catRef, catVisible] = useReveal(0.12);
  const [bandRef, bandVisible] = useReveal(0.2);
  const [stepRef, stepVisible] = useReveal(0.15);
  const { products, status } = useProducts();
  const [catFilter, setCatFilter] = useState('Semua');

  const catTabs = useMemo(() => {
    const counts = {};
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return [{ name: 'Semua', count: products.length },
      ...Object.keys(counts).sort().map((name) => ({ name, count: counts[name] }))];
  }, [products]);

  const visibleProducts = catFilter === 'Semua'
    ? products
    : products.filter((p) => p.category === catFilter);

  // Kartu kategori SELALU dari data asli (tidak statis) agar klik
  // tidak pernah menghasilkan daftar kosong.
  const categoryCards = useMemo(() => {
    const groups = {};
    products.forEach((p) => {
      const key = p.category || 'Lainnya';
      groups[key] = (groups[key] || 0) + 1;
    });
    return Object.keys(groups).sort().map((title, i) => ({
      no: String(i + 1).padStart(2, '0'),
      icon: categoryIcon(title, i),
      title,
      count: groups[title],
      desc: groups[title] === 1 ? '1 pilihan menu.' : `${groups[title]} pilihan menu.`,
      tone: CATEGORY_TONES[i % CATEGORY_TONES.length],
    }));
  }, [products]);

  const pickCategory = (title) => {
    setCatFilter(title);
    document.getElementById('menu-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <CartProvider>
    <div className="customer-shell">
      <Navbar />

      <section className="hero" id="beranda">
        <div className="hero-bg">
          <HeroVideo />
        </div>
        <div className="shell-container hero-content">
          
          <h1>
            Naoki Chicken
            <span>Pasti Senang, Pasti kenyang</span>
          </h1>
          <p className="hero-lead">
            Saatnya menikmati yang renyah.<br />
            Pasti kenyang, pasti senang.
          </p>
          <div className="hero-actions">
            <a href="#menu" className="btn-gold">
              Jelajahi menu <IconArrowRight size={17} />
            </a>
            <a href="#riwayat" className="btn-dark">Lacak pesanan</a>
          </div>
        </div>
      </section>

      <div className="channel-strip">
        <div className="shell-container channel-strip-inner">
          {CHANNELS.map(({ icon: Icon, label }) => (
            <span className="channel-item" key={label}>
              <Icon size={20} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <section className="section" id="menu" ref={catRef}>
        <div className={`shell-container reveal ${catVisible ? 'is-visible' : ''}`}>
          <div className="section-head">
            <div>
              <span className="eyebrow eyebrow--red">Ada yang renyah untuk setiap selera</span>
              <h2>Temukan favoritmu.</h2>
            </div>
            <a href="#menu" className="section-link">Semua menu <IconArrowRight size={16} /></a>
          </div>

          {categoryCards.length > 0 && (
            <div className="category-grid">
              {categoryCards.map(({ icon: Icon, title, count, desc, tone }) => {
                const active = catFilter === title;
                return (
                  <button
                    type="button"
                    className={`category-card category-card--${tone}${active ? ' is-active' : ''}`}
                    key={title}
                    aria-pressed={active}
                    onClick={() => pickCategory(active ? 'Semua' : title)}
                    aria-label={`${active ? 'Tampilkan semua menu' : `Lihat menu kategori ${title}`}`}
                  >
                    <div className="category-top">
                      <span className="category-icon"><Icon size={28} /></span>
                      <span className="category-count">{count} menu</span>
                    </div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                    <span className="category-cta">
                      {active ? 'Tampilkan semua' : 'Lihat menu'} <IconArrowRight size={16} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {status === 'loading' ? (
            <p className="section-note">Memuat menu terbaru dari outlet...</p>
          ) : products.length === 0 ? (
            <p className="section-note">Menu sedang disiapkan outlet dan akan tampil di sini setelah dikunci.</p>
          ) : (
            <>
              <div className="cat-tabs" role="tablist" aria-label="Filter kategori menu">
                {catTabs.map(({ name, count }) => (
                  <button
                    key={name}
                    type="button"
                    role="tab"
                    aria-selected={catFilter === name}
                    className={`cat-tab${catFilter === name ? ' is-active' : ''}`}
                    onClick={() => setCatFilter(name)}
                  >
                    {name} <span className="cat-count">{count}</span>
                  </button>
                ))}
              </div>
              {visibleProducts.length === 0 ? (
                <p className="section-note">Belum ada menu di kategori ini.</p>
              ) : (
                <div className="menu-grid" id="menu-grid">
                  {visibleProducts.map((item) => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              )}
              <p className="section-note">Harga mengikuti data resmi outlet.</p>
            </>
          )}
        </div>
      </section>

      <section className="red-band" ref={bandRef}>
        <div className={`shell-container red-band-inner reveal ${bandVisible ? 'is-visible' : ''}`}>
          <div className="red-band-copy">
            <span className="eyebrow eyebrow--gold">Waktunya makan enak</span>
            <h2>Renyahnya dinikmati.<br />Momennya dibagi.</h2>
            <p>Sendiri atau bersama, selalu ada alasan untuk menikmati Naoki Chicken.</p>
            <a href="#menu" className="btn-gold">
              Lihat pilihan menu <IconArrowRight size={17} />
            </a>
          </div>
          <img className="red-band-mascot" src="/brand/naoki-mark.png" alt="" width="364" height="420" loading="lazy" />
        </div>
      </section>

      <section className="section" id="riwayat" ref={stepRef}>
        <div className={`shell-container reveal ${stepVisible ? 'is-visible' : ''}`}>
          <span className="eyebrow eyebrow--red">Pesanan Anda</span>
          <h2 className="section-title">Dari pilihan ke suapan.</h2>

          <div className="step-grid">
            {STEPS.map(({ no, icon: Icon, title, desc }) => (
              <article className="step-item" key={no}>
                <div className="step-top">
                  <Icon size={21} />
                  <span className="step-no">{no}</span>
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="faq-section" id="profil">
        <div className="shell-container faq-grid">
          <div>
            <span className="eyebrow eyebrow--red">Sebelum memesan</span>
            <h2 className="section-title">Ada pertanyaan?</h2>
            <p className="faq-sub">Informasi penting untuk menikmati Naoki Chicken.</p>
          </div>
          <Faq items={FAQ} />
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <BrandLogo light />
              <p>Teman waktu makan Anda.<br />Pasti kenyang, pasti senang.</p>
              <SocialButtons />
            </div>

            {FOOTER_LINKS.map((column) => (
              <div className="footer-col" key={column.title}>
                <h4>{column.title}</h4>
                <ul>
                  {column.links.map((link) => (
                    <li key={link}><a href="#beranda">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="footer-col">
              <h4>Kunjungi &amp; hubungi</h4>
              <p className="footer-note">
                Naoki Chicken Parangtritis<br />
                Alamat, jam buka, dan kontak resmi menunggu konfirmasi outlet.
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Naoki Chicken Parangtritis.</span>
            <span>Pasti kenyang, pasti senang.</span>
          </div>
        </div>
      </footer>
      <CartDrawer />
      <CartFab />
      <Toast />
    </div>
    </CartProvider>
  );
}
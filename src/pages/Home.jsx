import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/customer/Navbar.jsx';
import BrandLogo from '../components/customer/BrandLogo.jsx';
import HeroVideo from '../components/customer/HeroVideo.jsx';
import CartDrawer from '../components/customer/CartDrawer.jsx';
import CartFab from '../components/customer/CartFab.jsx';
import Toast from '../components/customer/Toast.jsx';
import Faq from '../components/customer/Faq.jsx';
import useReveal from '../lib/useReveal.js';
import { useCart } from '../lib/cart.jsx';
import { useProducts } from '../lib/products.jsx';
import { useSettings, openInfo } from '../lib/settings.jsx';
import { categoryKey } from '../lib/categories.js';
import { CATEGORY_COMPONENTS } from '../components/customer/icons.jsx';
import {
  IconPin,
  IconSearch,
  IconBag,
  IconClock,
  IconArrowRight,
  IconInstagram,
  IconTiktok,
  IconWhatsapp,
} from '../components/customer/icons.jsx';

const CATEGORY_TONES = ['cream', 'gold', 'plain'];

function categoryIcon(name) {
  return CATEGORY_COMPONENTS[categoryKey(name)] || IconBag;
}

// Klaim terverifikasi dari perilaku nyata aplikasi:
// harga & stok dari database outlet.
const VALUES = [
  { icon: IconSearch, title: 'Pilihan yang jelas', desc: 'Kategori membantu Anda menemukan menu dengan lebih cepat.' },
  { icon: IconBag, title: 'Pesanan terarah', desc: 'Setiap langkah disusun agar mudah diperiksa sebelum dikirim.' },
  { icon: IconClock, title: 'Proses terpantau', desc: 'Nomor pesanan menjadi akses untuk melihat status terbaru.' },
];

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

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Naoki+Chicken+Parangtritis';

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

// Pelacakan aktif setelah pemesanan online dibuka — sampai saat itu
// tombol memberi info jujur, bukan berpura-pura melacak.
function TrackBox() {
  const { notify } = useCart();
  const [number, setNumber] = useState('');
  return (
    <form
      className="track-box"
      onSubmit={(e) => {
        e.preventDefault();
        if (!number.trim()) {
          notify('Masukkan nomor pesanan dulu.');
          return;
        }
        notify('Pelacakan aktif setelah pemesanan online dibuka.');
      }}
    >
      <label className="visually-hidden" htmlFor="track-number">Nomor pesanan</label>
      <input
        id="track-number"
        type="text"
        placeholder="cth: NK-000123"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        maxLength={20}
      />
      <button type="submit" className="btn-dark">
        Lacak sekarang <IconArrowRight size={16} />
      </button>
    </form>
  );
}

export default function Home() {
  const [catRef, catVisible] = useReveal(0.12);
  const [bandRef, bandVisible] = useReveal(0.2);
  const [stepRef, stepVisible] = useReveal(0.15);
  const { products } = useProducts();
  const { settings, status: settingsStatus } = useSettings();
  const info = settingsStatus === 'ready' ? openInfo(settings) : null;

  // Kartu kategori dari data asli agar selalu cocok dengan isi menu.
  const categoryCards = useMemo(() => {
    const groups = {};
    products.forEach((p) => {
      const key = p.category || 'Lainnya';
      groups[key] = (groups[key] || 0) + 1;
    });
    return Object.keys(groups).sort().map((title, i) => ({
      no: String(i + 1).padStart(2, '0'),
      icon: categoryIcon(title),
      title,
      count: groups[title],
      tone: CATEGORY_TONES[i % CATEGORY_TONES.length],
    }));
  }, [products]);

  return (
    <div className="customer-shell">
      <Navbar />

      <section className="hero" id="beranda">
        <div className="hero-bg">
          <HeroVideo />
        </div>
        <div className="shell-container hero-content">
          <span className="hero-eyebrow">
            {info ? (
              <>
                <span className={`open-dot${info.open ? '' : ' is-closed'}`} aria-hidden="true" />
                {info.text}
              </>
            ) : (
              <>
                <IconPin size={16} />
                Dari Parangtritis, untuk Anda
              </>
            )}
          </span>
          <h1>
            Naoki Chicken
            <span>Pasti Senang, Pasti kenyang</span>
          </h1>
          <p className="hero-lead">
            Saatnya menikmati yang renyah.<br />
            Pasti kenyang, pasti senang.
          </p>
          <div className="hero-actions">
            <Link to="/menu" className="btn-gold">
              Jelajahi menu <IconArrowRight size={17} />
            </Link>
            <a href="#riwayat" className="btn-dark">Cara pesan</a>
          </div>
        </div>
      </section>

      <section className="section cat-section" id="kategori" ref={catRef}>
        <span className="cat-ghost" aria-hidden="true">01</span>
        <div className={`shell-container reveal ${catVisible ? 'is-visible' : ''}`}>
          <div className="cat-section-inner">
            <div className="cat-section-intro">
              <span className="eyebrow eyebrow--red">Menu Naoki</span>
              <h2>Pilih sesuai suasana makanmu.</h2>
              <p>Jelajahi kategori, lalu lihat pilihan yang tersedia langsung di halaman menu.</p>
              <Link to="/menu" className="btn-red">
                Buka daftar menu <IconArrowRight size={16} />
              </Link>
              <p className="section-note">Harga dan ketersediaan mengikuti informasi terbaru dari outlet.</p>
            </div>
            {categoryCards.length > 0 && (
              <div className="cat-cards">
                {categoryCards.map(({ no, icon: Icon, title, count, tone }) => (
                  <Link
                    to={`/menu?cat=${encodeURIComponent(title)}`}
                    className={`cat-card cat-card--${tone}`}
                    key={title}
                    aria-label={`Lihat pilihan kategori ${title}`}
                  >
                    <span className="cat-card-no" aria-hidden="true">{no}</span>
                    <span className="cat-card-icon"><Icon size={30} /></span>
                    <h3>{title}</h3>
                    <p>{count === 1 ? '1 pilihan tersedia.' : `${count} pilihan tersedia.`}</p>
                    <span className="cat-card-link">Lihat pilihan <IconArrowRight size={15} /></span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="red-band" ref={bandRef}>
        <div className={`shell-container red-band-inner reveal ${bandVisible ? 'is-visible' : ''}`}>
          <div className="red-band-copy">
            <span className="eyebrow-pill">Naoki Moment</span>
            <h2>Renyahnya dinikmati.<br />Momennya dibagi.</h2>
            <p>Sendiri atau bersama, selalu ada alasan untuk menikmati Naoki Chicken.</p>
            <Link to="/menu" className="btn-gold">
              Lihat pilihan menu <IconArrowRight size={17} />
            </Link>
          </div>
          <span className="red-band-ring" aria-hidden="true">
            <img className="red-band-mascot" src="/brand/naoki-mark.png" alt="" width="364" height="420" loading="lazy" />
          </span>
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

      <section className="track-band" id="lacak">
        <div className="shell-container track-band-inner">
          <span className="track-badge"><IconSearch size={18} /></span>
          <div className="track-copy">
            <span className="eyebrow eyebrow--red">Status pesanan</span>
            <h2>Sudah memesan?</h2>
            <p>Masukkan nomor pesanan untuk melihat proses terbaru.</p>
          </div>
          <TrackBox />
        </div>
      </section>

      <section className="value-section">
        <div className="shell-container value-grid">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div className="value-point" key={title}>
              <Icon size={22} />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
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

      <section className="cta-band">
        <div className="shell-container cta-band-inner">
          <div>
            <span className="eyebrow eyebrow--dark">Siap memilih?</span>
            <h2>Temukan menu untuk momen makan Anda.</h2>
          </div>
          <Link to="/menu" className="btn-red">
            Jelajahi menu <IconArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <span className="footer-ghost" aria-hidden="true">NAOKI</span>
        <div className="shell-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <BrandLogo light />
              <p>Teman waktu makan Anda.<br />Pasti kenyang, pasti senang.</p>
              <SocialButtons />
            </div>

            <div className="footer-col">
              <h4>Jelajahi</h4>
              <ul>
                <li><a href="#beranda">Beranda</a></li>
                <li><Link to="/menu">Menu</Link></li>
                <li><FooterCartButton /></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Pesanan Anda</h4>
              <ul>
                <li><a href="#lacak">Lacak pesanan</a></li>
                <li><a href="#riwayat">Riwayat pesanan</a></li>
                <li><FooterPaymentButton /></li>
                <li><a href="#profil">Profil</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Kunjungi &amp; hubungi</h4>
              <p className="footer-note">
                {settings.outlet_name || 'Naoki Chicken Parangtritis'}<br />
                {settings.address || 'Alamat, jam buka, dan kontak resmi menunggu konfirmasi outlet.'}
                {settings.phone ? (<><br />{settings.phone}</>) : null}
              </p>
              <a
                className="footer-maps"
                href={MAPS_URL}
                target="_blank"
                rel="noreferrer"
              >
                Cari di Google Maps <IconArrowRight size={14} />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Naoki Chicken Parangtritis.</span>
          </div>
        </div>
      </footer>
      <CartDrawer />
      <CartFab />
      <Toast />
    </div>
  );
}

function FooterCartButton() {
  const { count, setOpen } = useCart();
  return (
    <button type="button" className="footer-link-btn" onClick={() => setOpen(true)}>
      Keranjang{count > 0 ? ` (${count})` : ''}
    </button>
  );
}

function FooterPaymentButton() {
  const { notify } = useCart();
  return (
    <button type="button" className="footer-link-btn" onClick={() => notify('Info pembayaran menyusul dari outlet.')}>
      Pembayaran
    </button>
  );
}

import { Link } from 'react-router-dom';
import BrandLogo from '../components/customer/BrandLogo.jsx';
import HeroVideo from '../components/customer/HeroVideo.jsx';
import Faq from '../components/customer/Faq.jsx';
import useReveal from '../lib/useReveal.js';
import {
  IconPin,
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
} from '../components/customer/icons.jsx';

const NAV = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Menu', href: '#menu' },
  { label: 'Keranjang', href: '#keranjang' },
  { label: 'Riwayat', href: '#riwayat' },
  { label: 'Profil', href: '#profil' },
];

const CHANNELS = [
  { icon: IconDineIn, label: 'Makan di tempat' },
  { icon: IconTakeaway, label: 'Bawa pulang' },
  { icon: IconPickup, label: 'Ambil sendiri' },
  { icon: IconDelivery, label: 'Diantar' },
];

// Kategori sengaja tanpa jumlah item atau harga: menu outlet belum dikunci.
const CATEGORIES = [
  { no: '01', icon: IconDrumstick, title: 'Ayam', desc: 'Pilihan untuk pencinta renyah.', tone: 'cream' },
  { no: '02', icon: IconBag, title: 'Paket', desc: 'Nikmati dalam satu pilihan.', tone: 'gold' },
  { no: '03', icon: IconCup, title: 'Minuman', desc: 'Lengkapi waktu makan Anda.', tone: 'plain' },
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

const FOOTER_LINKS = [
  { title: 'Jelajahi', links: ['Beranda', 'Menu', 'Keranjang'] },
  { title: 'Pesanan Anda', links: ['Lacak pesanan', 'Riwayat pesanan', 'Pembayaran', 'Profil'] },
];

export default function Home() {
  const [catRef, catVisible] = useReveal(0.12);
  const [bandRef, bandVisible] = useReveal(0.2);
  const [stepRef, stepVisible] = useReveal(0.15);

  return (
    <div className="customer-shell">
      <header className="site-nav">
        <div className="shell-container site-nav-inner">
          <BrandLogo />
          <nav className="site-nav-links" aria-label="Navigasi utama">
            {NAV.map((item, index) => (
              <a key={item.label} href={item.href} className={index === 0 ? 'is-active' : undefined}>
                {item.label}
              </a>
            ))}
          </nav>
          <a href="#lacak" className="nav-track-link">Lacak pesanan</a>
        </div>
      </header>

      <section className="hero" id="beranda">
        <div className="hero-bg">
          <HeroVideo />
        </div>
        <div className="shell-container hero-content">
          <span className="hero-eyebrow">
            <IconPin size={16} />
            Dari Parangtritis, untuk Anda
          </span>
          <h1>
            Naoki Chicken
            <span>Parangtritis</span>
          </h1>
          <p className="hero-lead">
            Saatnya menikmati yang renyah.<br />
            Pasti kenyang, pasti senang.
          </p>
          <div className="hero-actions">
            <a href="#menu" className="btn-gold">
              Jelajahi menu <IconArrowRight size={17} />
            </a>
            <a href="#lacak" className="btn-dark">Lacak pesanan</a>
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

          <div className="category-grid">
            {CATEGORIES.map(({ no, icon: Icon, title, desc, tone }) => (
              <article className={`category-card category-card--${tone}`} key={title}>
                <span className="category-icon"><Icon size={30} /></span>
                <span className="category-no">{no}</span>
                <div className="category-row">
                  <h3>{title}</h3>
                  <IconArrowRight size={19} />
                </div>
                <p>{desc}</p>
              </article>
            ))}
          </div>

          <p className="section-note">Menu, harga, dan ketersediaan sedang disiapkan oleh outlet.</p>
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

      <footer className="site-footer" id="keranjang">
        <div className="shell-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Naoki Chicken<span>Parangtritis</span></h3>
              <p>Teman waktu makan Anda.<br />Pasti kenyang, pasti senang.</p>
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
            <Link to="/admin">Ruang operasional <IconArrowRight size={14} /></Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

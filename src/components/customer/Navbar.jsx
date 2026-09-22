import { useState } from 'react';
import BrandLogo from './BrandLogo.jsx';
import { IconMenuBars, IconClose } from './icons.jsx';

const NAV = [
  { label: 'Beranda', href: '#beranda' },
  { label: 'Menu', href: '#menu' },
  { label: 'Riwayat', href: '#riwayat' },
  { label: 'Profil', href: '#profil' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-nav">
      <div className="shell-container site-nav-inner">
        <BrandLogo />

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <IconClose size={22} /> : <IconMenuBars size={22} />}
          <span className="visually-hidden">{open ? 'Tutup menu' : 'Buka menu'}</span>
        </button>

        <nav id="nav-menu" className={`site-nav-links${open ? ' is-open' : ''}`} aria-label="Navigasi utama">
          {NAV.map((item, index) => (
            <a key={item.label} href={item.href} className={index === 0 ? 'is-active' : undefined} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
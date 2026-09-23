import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BrandLogo from '../components/customer/BrandLogo.jsx';
import MenuCard from '../components/customer/MenuCard.jsx';
import CartDrawer from '../components/customer/CartDrawer.jsx';
import CartFab from '../components/customer/CartFab.jsx';
import RiwayatFab from '../components/customer/RiwayatFab.jsx';
import Toast from '../components/customer/Toast.jsx';
import { useProducts } from '../lib/products.jsx';
import { IconSearch, IconBox, IconArrowRight } from '../components/customer/icons.jsx';

export default function Menu() {
  const { products, status } = useProducts();
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [catFilter, setCatFilter] = useState(params.get('cat') || 'Semua');

  const cats = useMemo(() => {
    const counts = {};
    products.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    return [{ name: 'Semua', count: products.length },
      ...Object.keys(counts).sort().map((name) => ({ name, count: counts[name] }))];
  }, [products]);

  const visible = products.filter((p) => {
    const matchCat = catFilter === 'Semua' || p.category === catFilter;
    const keyword = query.trim().toLowerCase().replace(/\s+/g, ' ');
    const haystack = `${p.name} ${p.desc} ${p.category}`.toLowerCase().replace(/\s+/g, ' ');
    return matchCat && haystack.includes(keyword);
  });

  const resetFilter = () => {
    setQuery('');
    setCatFilter('Semua');
  };

  return (
    <div className="customer-shell menu-page">
      <header className="site-nav">
        <div className="shell-container site-nav-inner">
          <BrandLogo />
          <Link to="/" className="nav-back">← Beranda</Link>
        </div>
      </header>

      <main className="shell-container menu-page-body">
        <span className="eyebrow eyebrow--red">Pesan sesuai selera</span>
        <h1>Menu</h1>
        <p className="menu-page-sub">Pilih kategori atau cari menu yang Anda inginkan.</p>

        <div className="menu-toolbar">
          <label className="menu-search">
            <IconSearch size={18} />
            <input
              type="search"
              placeholder="Cari menu..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Cari menu"
            />
          </label>
          <div className="cat-tabs menu-chips" role="tablist" aria-label="Filter kategori menu">
            {cats.map(({ name, count }) => (
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
        </div>

        {status === 'loading' ? (
          <div className="menu-page-grid" aria-label="Memuat menu" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div className="menu-card is-loading" key={i} aria-hidden="true">
                <div className="menu-image"><span className="shimmer" /></div>
                <div className="menu-body">
                  <div className="shimmer-line" style={{ width: '70%' }} />
                  <div className="shimmer-line" style={{ width: '45%' }} />
                  <div className="shimmer-line" style={{ width: '100%', height: 44 }} />
                </div>
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="menu-empty">
            <span className="menu-empty-icon"><IconBox size={26} /></span>
            <h2>{products.length === 0 ? 'Data menu belum tersedia' : 'Menu tidak ditemukan'}</h2>
            <p>
              {products.length === 0
                ? 'Nama produk, harga, foto, dan ketersediaan akan ditampilkan setelah data asli dari outlet diterima.'
                : 'Coba kata kunci atau kategori lain.'}
            </p>
            {products.length > 0 && (
              <button type="button" className="btn-outline btn-sm" onClick={resetFilter}>
                Atur ulang pencarian
              </button>
            )}
          </div>
        ) : (
          <div className="menu-page-grid">
            {visible.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        )}

        <p className="section-note">
          <Link to="/">Kembali ke beranda <IconArrowRight size={14} /></Link>
        </p>
      </main>

      <CartDrawer />
      <CartFab />
      <RiwayatFab />
      <Toast />
    </div>
  );
}

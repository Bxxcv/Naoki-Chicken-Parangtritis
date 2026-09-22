import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ADMIN_NAV } from './nav.js';
import { useAuth } from '../../lib/auth.jsx';
import { IconChevronRight, IconClose, IconMenuBars } from './icons.jsx';

export default function AdminLayout({ children }) {
  const [navOpen, setNavOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Tutup drawer setiap pindah halaman (perilaku wajib di layar kecil).
  useEffect(() => setNavOpen(false), [location.pathname]);

  return (
    <div className="admin-shell">
      <div
        className={`admin-scrim${navOpen ? ' is-visible' : ''}`}
        onClick={() => setNavOpen(false)}
        aria-hidden="true"
      />

      <aside className={`admin-sidebar${navOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar-head">
          <Link to="/admin" className="admin-brand">
            <span className="admin-brand-badge">
              <img src="/brand/naoki-mark.png" alt="" width="364" height="420" />
            </span>
            <span className="admin-brand-words">
              <span className="admin-brand-name">Naoki</span>
              <span className="admin-brand-accent">Chicken</span>
              <span className="admin-brand-outlet">Parangtritis</span>
            </span>
          </Link>
          <button type="button" className="admin-drawer-close" onClick={() => setNavOpen(false)}>
            <IconClose size={20} />
            <span className="visually-hidden">Tutup menu</span>
          </button>
        </div>

        <p className="admin-nav-label">Ruang kerja</p>
        <nav className="admin-nav">
          {ADMIN_NAV.map(({ label, path, icon: Icon, end }) => (
            <NavLink key={path} to={path} end={end} className="admin-nav-link">
              {({ isActive }) => (
                <>
                  <Icon size={18} />
                  <span>{label}</span>
                  {isActive && <IconChevronRight size={16} className="admin-nav-caret" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          {user && <span className="admin-user">{user.email}</span>}
          <button type="button" className="btn-outline btn-sm admin-logout" onClick={signOut}>
            Keluar
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <button type="button" className="admin-drawer-open" onClick={() => setNavOpen(true)}>
          <IconMenuBars size={20} />
          <span className="visually-hidden">Buka menu</span>
        </button>
        {children}
      </div>
    </div>
  );
}

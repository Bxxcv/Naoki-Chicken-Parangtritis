import { Link, useLocation } from 'react-router-dom';
import PageHeader from '../../components/admin/PageHeader.jsx';
import EmptyState from '../../components/admin/EmptyState.jsx';
import { ADMIN_NAV } from '../../components/admin/nav.js';
import { IconBox } from '../../components/admin/icons.jsx';

export default function ModulePlaceholder() {
  const { pathname } = useLocation();
  const item = ADMIN_NAV.find((nav) => nav.path === pathname);
  const title = item ? item.label : pathname.split('/').pop().replaceAll('-', ' ');

  return (
    <>
      <PageHeader
        eyebrow="Operasional outlet"
        title={title}
        actions={<Link to="/" className="btn-outline">Lihat toko</Link>}
      />
      <div className="admin-body">
        <section className="panel">
          <EmptyState
            icon={<IconBox size={26} />}
            title={`Modul ${title} belum dibangun`}
            desc="Halaman ini sengaja kosong. Implementasinya mengikuti dokumen dan acceptance criteria di folder docs/."
          />
        </section>
      </div>
    </>
  );
}

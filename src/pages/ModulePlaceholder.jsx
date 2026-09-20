import { useLocation } from 'react-router-dom';

export default function ModulePlaceholder() {
  const { pathname } = useLocation();
  const title = pathname.split('/').pop().replaceAll('-', ' ');

  return (
    <div className="container-fluid py-5 px-3 px-lg-4">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <span className="badge text-bg-danger text-uppercase">MVP module</span>
          <h1 className="h3 fw-bold text-capitalize mt-3">{title}</h1>
          <p className="text-secondary mb-0">Halaman ini sengaja berupa shell. Implementasi detail wajib mengikuti dokumen dan acceptance criteria di <code>docs/</code>.</p>
        </div>
      </div>
    </div>
  );
}

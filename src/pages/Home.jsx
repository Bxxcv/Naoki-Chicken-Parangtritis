import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="customer-shell">
      <nav className="navbar border-bottom bg-white sticky-top">
        <div className="container py-2 d-flex align-items-center justify-content-between">
          <div>
            <div className="brand">Naoki<span>Chicken</span></div>
            <div className="small text-muted">Parangtritis</div>
          </div>
          <Link to="/admin" className="btn btn-dark btn-sm">Admin Preview</Link>
        </div>
      </nav>
      <section className="hero-section">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="eyebrow">PARANGTRITIS</span>
              <h1 className="display-4 fw-bold mt-2">Pesan makanan favoritmu, tanpa ribet.</h1>
              <p className="lead text-secondary mt-3">Starter UI untuk customer ordering. Desain final mengikuti referensi visual yang dikunci di docs/UI-UX.md.</p>
              <div className="d-flex gap-2 mt-4 flex-wrap">
                <button className="btn btn-danger btn-lg">Lihat Menu</button>
                <button className="btn btn-outline-dark btn-lg">Lacak Pesanan</button>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="food-placeholder">FOOD HERO AREA</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

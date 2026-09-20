import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ModulePlaceholder from './pages/ModulePlaceholder.jsx';

const modules = [
  ['Orders', '/admin/orders'],
  ['POS / Cashier', '/admin/pos'],
  ['Kitchen', '/admin/kitchen'],
  ['Products', '/admin/products'],
  ['Stock', '/admin/stock'],
  ['Customers', '/admin/customers'],
  ['Expenses', '/admin/expenses'],
  ['Payments', '/admin/payments'],
  ['Reports', '/admin/reports'],
  ['Analytics', '/admin/analytics'],
  ['Settings', '/admin/settings'],
];

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  if (!isAdmin) {
    return (
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Naoki<span>Chicken</span></div>
        <div className="brand-sub">Parangtritis</div>
        <nav className="nav flex-column mt-4 gap-1">
          <Link className="nav-link" to="/admin">Dashboard</Link>
          {modules.map(([label, path]) => (
            <Link key={path} className="nav-link" to={path}>{label}</Link>
          ))}
        </nav>
      </aside>
      <main className="admin-main">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<ModulePlaceholder />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

import { Navigate, Route, Routes } from 'react-router-dom';
import { ProductsProvider } from './lib/products.jsx';
import { AuthProvider, useAuth } from './lib/auth.jsx';
import { SettingsProvider } from './lib/settings.jsx';
import { CartProvider } from './lib/cart.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Masuk from './pages/Masuk.jsx';
import Riwayat from './pages/Riwayat.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Orders from './pages/admin/Orders.jsx';
import Pos from './pages/admin/Pos.jsx';
import Pelanggan from './pages/admin/Pelanggan.jsx';
import Kitchen from './pages/admin/Kitchen.jsx';
import Products from './pages/admin/Products.jsx';
import Stock from './pages/admin/Stock.jsx';
import Settings from './pages/admin/Settings.jsx';
import ModulePlaceholder from './pages/admin/ModulePlaceholder.jsx';
import Login from './pages/admin/Login.jsx';

// Tanpa sesi login: seluruh /admin/* terkunci di halaman masuk.
function RequireAuth({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="auth-wrap"><p className="auth-sub">Memuat sesi...</p></div>;
  if (!session) return <Login />;
  return children;
}

function App() {
  return (
    <ProductsProvider>
    <AuthProvider>
    <SettingsProvider>
    <CartProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/riwayat" element={<Riwayat />} />
      <Route
        path="/admin/*"
        element={
          <RequireAuth>
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="pesanan" element={<Orders />} />
              <Route path="pos" element={<Pos />} />
              <Route path="pelanggan" element={<Pelanggan />} />
              <Route path="dapur" element={<Kitchen />} />
              <Route path="produk" element={<Products />} />
              <Route path="stok" element={<Stock />} />
              <Route path="pengaturan" element={<Settings />} />
              <Route path="*" element={<ModulePlaceholder />} />
            </Routes>
          </AdminLayout>
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </CartProvider>
    </SettingsProvider>
    </AuthProvider>
    </ProductsProvider>
  );
}

export default App;

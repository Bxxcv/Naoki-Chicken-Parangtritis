import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Orders from './pages/admin/Orders.jsx';
import Kitchen from './pages/admin/Kitchen.jsx';
import Settings from './pages/admin/Settings.jsx';
import ModulePlaceholder from './pages/admin/ModulePlaceholder.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/admin/*"
        element={
          <AdminLayout>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="pesanan" element={<Orders />} />
              <Route path="dapur" element={<Kitchen />} />
              <Route path="pengaturan" element={<Settings />} />
              <Route path="*" element={<ModulePlaceholder />} />
            </Routes>
          </AdminLayout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

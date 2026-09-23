import { Link } from 'react-router-dom';
import { IconClock } from './icons.jsx';

// Tombol riwayat melayang di atas tombol keranjang.
export default function RiwayatFab() {
  return (
    <Link to="/riwayat" className="cart-fab riwayat-fab" aria-label="Lihat riwayat pesanan">
      <IconClock size={24} />
    </Link>
  );
}

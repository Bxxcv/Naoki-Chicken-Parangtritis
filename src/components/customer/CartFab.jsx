import { useCart } from '../../lib/cart.jsx';
import { IconBag } from './icons.jsx';

// Tombol keranjang melayang kanan-bawah ala Shopee/TikTok Shop.
// Target pendaratan animasi fly-to-cart (id dipertahankan).
export default function CartFab() {
  const { count, setOpen } = useCart();

  return (
    <button
      type="button"
      id="nav-cart-btn"
      className="cart-fab"
      aria-label={`Buka keranjang, ${count} item`}
      onClick={() => setOpen(true)}
    >
      <IconBag size={24} />
      <span className="nav-cart-badge" aria-hidden="true">{count}</span>
    </button>
  );
}

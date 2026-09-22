import { useCart, formatIDR } from '../../lib/cart.jsx';
import { IconClose, IconBag } from './icons.jsx';

export default function CartDrawer() {
  const { items, setQty, remove, clear, count, total, open, setOpen } = useCart();

  return (
    <>
      <div
        className={`cart-scrim${open ? ' is-visible' : ''}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer${open ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Keranjang belanja"
        aria-hidden={!open}
      >
        <div className="cart-head">
          <h2><IconBag size={20} /> Keranjang ({count})</h2>
          <button type="button" className="cart-close" onClick={() => setOpen(false)}>
            <IconClose size={20} />
            <span className="visually-hidden">Tutup keranjang</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p><strong>Keranjang masih kosong.</strong></p>
            <p>Jelajahi menu dan tekan Tambah pada pilihan favoritmu.</p>
            <a href="#menu" className="btn-gold" onClick={() => setOpen(false)}>Lihat menu</a>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>{formatIDR(item.price)}</span>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Kurangi ${item.name}`}
                      onClick={() => setQty(item.id, item.qty - 1)}
                    >
                      −
                    </button>
                    <span className="qty-value" aria-label={`Jumlah ${item.name}`}>{item.qty}</span>
                    <button
                      type="button"
                      className="qty-btn"
                      aria-label={`Tambah ${item.name}`}
                      onClick={() => setQty(item.id, item.qty + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="cart-remove"
                      aria-label={`Hapus ${item.name} dari keranjang`}
                      onClick={() => remove(item.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-foot">
              <div className="cart-total">
                <span>Estimasi total</span>
                <strong>{formatIDR(total)}</strong>
              </div>
              <p className="cart-note">Harga contoh — total resmi dihitung outlet saat pemesanan dibuka.</p>
              <button type="button" className="btn-gold cart-checkout" disabled>
                Checkout
              </button>
              <p className="cart-note">Pemesanan online belum dibuka outlet.</p>
              <button type="button" className="cart-clear" onClick={clear}>
                Kosongkan keranjang
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

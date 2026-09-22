import { useCart, formatIDR } from '../../lib/cart.jsx';
import { isEmpty, isLow } from '../../lib/products.jsx';
import { categoryKey } from '../../lib/categories.js';
import { CATEGORY_COMPONENTS, IconBag, IconPlus } from './icons.jsx';
import { flyToCart } from '../../lib/flyToCart.js';

// Kartu menu dipakai di landing dan halaman /menu. Data selalu dari
// database via useProducts (tidak ada harga/stok contoh di sini).
export default function MenuCard({ item }) {
  const { add, notify } = useCart();
  const FallbackIcon = CATEGORY_COMPONENTS[categoryKey(item.category)] || IconBag;
  const empty = isEmpty(item);
  const low = isLow(item);

  const onAdd = (e) => {
    if (empty) return;
    const flightMs = flyToCart(e.currentTarget, item.category);
    add(item);
    const message = `${item.name} dimasukkan ke keranjang.`;
    // Toast menyusul saat lencana hampir mendarat.
    if (flightMs > 0) {
      setTimeout(() => notify(message), flightMs - 450);
    } else {
      notify(message);
    }
  };

  return (
    <article className={`menu-card${empty ? ' is-empty' : ''}`}>
      <div className="menu-image">
        <span className="menu-fallback" aria-hidden="true"><FallbackIcon size={44} /></span>
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        <span className="menu-cat">{item.category}</span>
        {empty
          ? <span className="menu-flag">Habis</span>
          : low
            ? <span className="menu-flag menu-flag--warn">Stok menipis</span>
            : null}
      </div>
      <div className="menu-body">
        <div className="menu-head">
          <h3>{item.name}</h3>
          <span className="menu-price">{formatIDR(item.price)}</span>
        </div>
        <p className="menu-desc">{item.desc}</p>
        {!empty && low && (
          <span className="menu-stock">Sisa {item.stock} porsi — cepat habis!</span>
        )}
        <button
          type="button"
          className="menu-add"
          disabled={empty}
          aria-label={empty ? `${item.name} habis` : `Tambahkan ${item.name} ke keranjang`}
          onClick={onAdd}
        >
          {empty ? 'Habis' : (<><IconPlus size={17} /> Tambah</>)}
        </button>
      </div>
    </article>
  );
}

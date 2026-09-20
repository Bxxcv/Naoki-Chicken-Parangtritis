const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function ProductCard({ product, qty, onAdd }) {
  return (
    <div className="product-card">
      <div className="product-icon">{product.icon}</div>
      <div className="product-name">{product.name}</div>
      <p className="product-note">{product.note}</p>
      <div className="product-foot">
        <span className="product-price">{rupiah.format(product.price)}</span>
        <div className="d-flex align-items-center gap-2">
          {qty > 0 && <span className="qty-badge">{qty}</span>}
          <button
            type="button"
            className="qty-add-btn"
            aria-label={`Tambah ${product.name}`}
            onClick={onAdd}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

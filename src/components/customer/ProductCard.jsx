const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default function ProductCard({ product, qty, onAdd }) {
  return (
    <article className="product-card">
      <div className="product-thumb">
        {product.tag && <span className="product-tag">{product.tag}</span>}
        <span className="product-icon">{product.icon}</span>
      </div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-note">{product.note}</p>
      <div className="product-foot">
        <span className="product-price">{rupiah.format(product.price)}</span>
        <div className="product-actions">
          {qty > 0 && <span className="qty-badge">{qty}</span>}
          <button type="button" className="qty-add-btn" aria-label={`Tambah ${product.name}`} onClick={onAdd}>
            +
          </button>
        </div>
      </div>
    </article>
  );
}

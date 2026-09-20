import { useState } from 'react';
import { FoodIcon, Star } from './FoodIcons.jsx';
import { formatIDR } from '../data/menu.js';

export default function ProductCard({ product, index = 0 }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };

  return (
    <article
      className="product-card reveal"
      style={{ '--reveal-delay': `${index * 80}ms` }}
    >
      <div className="product-visual">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <div className="product-icon-wrap">
          <FoodIcon name={product.icon} size={88} className="product-icon" />
        </div>
      </div>
      <div className="product-body">
        <div className="product-rating">
          <Star size={13} className="star" />
          <span className="rating-num">{product.rating.toFixed(1)}</span>
          <span className="sold">· {product.sold} terjual</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-foot">
          <span className="product-price">{formatIDR(product.price)}</span>
          <button
            className={`btn-add ${added ? 'added' : ''}`}
            onClick={handleAdd}
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            {added ? 'Ditambah' : 'Tambah'}
            <span className="btn-add-icon" aria-hidden="true">
              {added ? '✓' : '+'}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

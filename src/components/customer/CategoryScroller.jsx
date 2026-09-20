export default function CategoryScroller({ categories, active, onSelect }) {
  return (
    <div className="category-scroller" role="tablist" aria-label="Kategori menu">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="tab"
          aria-selected={active === category}
          className={`category-chip${active === category ? ' is-active' : ''}`}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

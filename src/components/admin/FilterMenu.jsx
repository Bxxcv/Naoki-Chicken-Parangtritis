import { useEffect, useRef, useState } from 'react';

// Tombol ikon yang membuka menu pilihan (dropdown). Menutup saat klik
// di luar atau tombol Escape. active = tampil titik penanda.
export default function FilterMenu({ icon: Icon, label, activeLabel, active, children }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open ]);

  return (
    <div className="filter-menu" ref={ref}>
      <button
        type="button"
        className={`filter-menu-btn${active ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-label={label}
        title={activeLabel || label}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon size={18} />
        {activeLabel ? <span className="filter-menu-label">{activeLabel}</span> : null}
        {active ? <span className="filter-menu-dot" aria-hidden="true" /> : null}
      </button>
      {open && (
        <div className="filter-menu-panel" role="menu">
          {children}
        </div>
      )}
    </div>
  );
}

export function FilterOption({ selected, onSelect, children }) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={selected}
      className={`filter-menu-option${selected ? ' is-active' : ''}`}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}

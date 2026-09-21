// Empty state eksplisit dipakai di mana-mana karena sistem belum terhubung data
// outlet. Angka contoh dilarang — lihat skills/naoki-chicken-master-skill.
export default function EmptyState({ icon, title, desc, dashed = true }) {
  return (
    <div className={`empty-state${dashed ? ' empty-state--dashed' : ''}`}>
      {icon && <span className="empty-state-icon">{icon}</span>}
      {title && <p className="empty-state-title">{title}</p>}
      {desc && <p className="empty-state-desc">{desc}</p>}
    </div>
  );
}

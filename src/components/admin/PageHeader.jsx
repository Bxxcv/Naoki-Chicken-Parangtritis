export default function PageHeader({ eyebrow, title, actions }) {
  return (
    <header className="admin-topbar">
      <div>
        <span className="admin-topbar-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
      </div>
      {actions && <div className="admin-topbar-actions">{actions}</div>}
    </header>
  );
}

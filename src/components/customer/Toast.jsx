import { useEffect } from 'react';
import { useCart } from '../../lib/cart.jsx';
import { IconBag } from './icons.jsx';

// Notifikasi ringan di atas layar. Hilang otomatis; tidak memblokir aksi.
export default function Toast() {
  const { toast, clearToast } = useCart();

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(clearToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      <div className="naoki-toast" key={toast.id}>
        <IconBag size={18} />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

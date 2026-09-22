import { categoryKey } from './categories.js';
import { CATEGORY_PATHS } from '../components/customer/icons.jsx';

// Durasi santai + easing lembut agar lengkungan terlihat jelas.
const DURATION = 1400;
const EASING = 'cubic-bezier(.3,.7,.3,1)';

export function flyToCart(fromEl, category) {
  try {
    if (!fromEl || typeof document === 'undefined') return 0;
    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 0;
    }

    const target = document.getElementById('nav-cart-btn');
    if (!target || typeof target.animate !== 'function') return 0;

    const from = fromEl.getBoundingClientRect();
    // Bidik PUSAT BADGE (pojok tombol), bukan tengah tombol — di situlah
    // mata pengguna menunggu pendaratan + animasi pop terjadi.
    const badgeEl = target.querySelector('.nav-cart-badge');
    const to = (badgeEl || target).getBoundingClientRect();
    const startX = from.left + from.width / 2;
    const startY = from.top + from.height / 2;
    const endX = to.left + to.width / 2;
    const endY = to.top + to.height / 2;

    const dot = document.createElement('span');
    dot.className = 'fly-dot';
    dot.setAttribute('aria-hidden', 'true');
    dot.innerHTML =
      `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" ` +
      `stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">` +
      (CATEGORY_PATHS[categoryKey(category)] || CATEGORY_PATHS.paket) +
      `</svg>`;
    dot.style.left = `${startX}px`;
    dot.style.top = `${startY}px`;
    document.body.appendChild(dot);

    // Lengkungan ke atas: titik tengah diangkat agar terbang melengkung.
    const midX = (startX + endX) / 2;
    const midY = Math.min(startY, endY) - 110;

    const flight = dot.animate(
      [
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        {
          transform: `translate(${midX - startX - 23}px, ${midY - startY - 23}px) scale(.9)`,
          opacity: 1,
          offset: 0.55,
        },
        { transform: `translate(${endX - startX - 23}px, ${endY - startY - 23}px) scale(.35)`, opacity: 0.9 },
      ],
      { duration: DURATION, easing: EASING },
    );

    flight.onfinish = () => {
      dot.remove();
      if (badgeEl) {
        badgeEl.classList.remove('is-pop');
        // Paksa reflow agar animasi pop bisa diulang tiap klik.
        void badgeEl.offsetWidth;
        badgeEl.classList.add('is-pop');
      }
    };
    flight.oncancel = () => dot.remove();

    return DURATION;
  } catch {
    // Animasi gagal: abaikan, item tetap masuk keranjang.
    return 0;
  }
}

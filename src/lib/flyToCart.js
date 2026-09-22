// Animasi "terbang ke keranjang" ala TikTok Shop/Shopee.
// Murni visual (Web Animations API, tanpa dependensi). Dilewati total
// untuk prefers-reduced-motion.
//
// Yang terbang = lencana ikon kategori (Ayam/Paket/Minuman). Nanti
// setelah foto menu asli tersedia, tinggal ganti isi lencana dengan
// thumbnail foto.
//
// Mengembalikan durasi animasi (ms) agar pemanggil bisa menyelaraskan
// notifikasi; 0 bila animasi dilewati/gagal.
const CATEGORY_PATHS = {
  Ayam: '<path d="M14.2 3.2c1.3 0 2 1 1.8 2.2l-.5 2.4c2.3 1 3.7 3.3 3.3 5.7-.6 2.9-3.6 4.8-6.6 4.3-3.2-.5-5.2-3.3-4.6-6.2.5-2.4 2.5-4.1 4.9-4.3l.5-2.5c.1-.9.7-1.6 1.2-1.6Z" /><path d="m9.6 15.2-4 4M6.6 17.2 5 21l3.8-1.6" />',
  Paket: '<path d="M4.5 7h15l-1 12.3a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4.5 7Z" /><path d="M8.8 10V6.5a3.2 3.2 0 0 1 6.4 0V10" />',
  Minuman: '<path d="M7 8h10l-1 11a2 2 0 0 1-2 1.8h-4A2 2 0 0 1 8 19L7 8Z" /><path d="M8.6 8 8 4.5h8L15.4 8" /><path d="M17.3 11.5h1.4a2.3 2.3 0 0 1 0 4.6h-1.8" />',
};

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
      (CATEGORY_PATHS[category] || CATEGORY_PATHS.Ayam) +
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

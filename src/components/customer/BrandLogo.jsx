// Logo dipakai dua varian:
// - "mark": maskot saja, aman di atas latar terang (navbar emas, kartu krem).
// - "full": maskot + wordmark krem, HANYA untuk latar gelap/merah
//   (wordmark di file logo berwarna krem, hilang di latar terang).
export default function BrandLogo({ variant = 'mark', className = '' }) {
  if (variant === 'full') {
    return (
      <img
        src="/brand/naoki-logo-full.png"
        alt="Naoki Chicken & Playground"
        className={`brand-logo-full ${className}`.trim()}
        width="900"
        height="461"
        loading="lazy"
      />
    );
  }

  return (
    <span className={`brand-lockup ${className}`.trim()}>
      <img
        src="/brand/naoki-mark.png"
        alt=""
        className="brand-mark"
        width="364"
        height="420"
      />
      <span className="brand-text">
        <span className="brand-name">Naoki Chicken</span>
        <span className="brand-outlet">Parangtritis</span>
      </span>
    </span>
  );
}

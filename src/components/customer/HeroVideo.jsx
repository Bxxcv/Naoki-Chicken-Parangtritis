import { useEffect, useRef } from 'react';

// Video hero full-bleed: rekaman paha ayam goreng jatuh ke nasi (aset outlet).
// File sudah di-crossfade di ujungnya, jadi `loop` bawaan <video> sudah mulus.
// Video diputar otomatis tanpa kontrol jeda sesuai permintaan outlet.
// Pengguna prefers-reduced-motion tetap dihormati: video dijeda otomatis.
export default function HeroVideo() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    // muted juga diset via properti DOM: Safari/iOS memblokir autoplay kalau
    // hanya mengandalkan atribut dari React.
    video.muted = true;

    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (query.matches) {
        video.pause();
      }
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

    return (
      <>
        <video
          ref={videoRef}
          className="hero-video"
          src="/media/hero-chicken.mp4"
          poster="/media/hero-chicken-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="Paha ayam goreng jatuh ke atas nasi hangat"
        />
      </>
    );
}

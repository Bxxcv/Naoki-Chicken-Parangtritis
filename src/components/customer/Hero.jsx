import { useEffect, useRef } from 'react';
import { IconPin } from './icons.jsx';

// Hero video: rekaman paha ayam goreng jatuh ke nasi (aset outlet).
// File sudah di-loop mulus lewat crossfade, jadi `loop` bawaan <video> cukup.
// Zoom pelan dikerjakan CSS (.hero-video) agar tidak membebani JS.
export default function Hero() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof window.matchMedia !== 'function') return undefined;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      // muted diset lewat properti DOM juga: Safari/iOS memblokir autoplay
      // kalau hanya mengandalkan atribut dari React.
      video.muted = true;
      if (query.matches) video.pause();
      else video.play().catch(() => {});
    };

    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  return (
    <section className="hero" id="beranda">
      <div className="container hero-inner">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="hero-badge">
              <IconPin width="15" height="15" />
              Outlet Parangtritis
            </span>
            <h1>Pasti Kenyang,<br />Pasti Senang.</h1>
            <p className="hero-sub">
              Ayam goreng renyah dan nasi hangat, siap untuk dine-in, takeaway, pickup, atau delivery.
            </p>
            <div className="hero-cta">
              <a href="#menu" className="btn-gold">Pesan Sekarang</a>
              <button type="button" className="btn-ghost">Lacak Pesanan</button>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="hero-media">
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
                aria-label="Video paha ayam goreng jatuh ke atas nasi hangat"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="hero-notch" aria-hidden="true" />
    </section>
  );
}

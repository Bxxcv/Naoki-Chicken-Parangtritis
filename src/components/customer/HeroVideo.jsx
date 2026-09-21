import { useEffect, useRef, useState } from 'react';
import { IconPause, IconPlay } from './icons.jsx';

// Video hero full-bleed: rekaman paha ayam goreng jatuh ke nasi (aset outlet).
// File sudah di-crossfade di ujungnya, jadi `loop` bawaan <video> sudah mulus.
// Kontrol jeda disediakan karena video autoplay yang tidak bisa dihentikan
// menyulitkan sebagian pengguna (dan wajib untuk WCAG 2.2.2).
export default function HeroVideo() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);

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
        setPlaying(false);
      }
    };
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setPlaying(false);
    }
  };

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
      <button type="button" className="hero-video-toggle" onClick={toggle}>
        {playing ? <IconPause size={16} /> : <IconPlay size={16} />}
        <span className="visually-hidden">{playing ? 'Jeda video' : 'Putar video'}</span>
      </button>
    </>
  );
}

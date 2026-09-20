import { useMemo } from 'react';
import { Drumstick } from './FoodIcons.jsx';

// Decorative "raining drumsticks" effect for the hero.
// Continuous but subtle, low-opacity, behind content.
// Respects prefers-reduced-motion via CSS media query in styles.css.

const COUNT = 14;

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function FallingDrumsticks() {
  const pieces = useMemo(() => {
    const sizes = [22, 28, 34, 40, 26, 30, 36];
    const durations = [7, 9, 11, 13, 8, 10, 12];
    const delays = [0, 1.5, 3, 4.5, 2, 6, 0.8, 5, 3.5, 7, 2.5, 4, 1, 5.5];
    return Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      left: Math.random() * 96,
      size: pick(sizes),
      duration: pick(durations),
      delay: delays[i % delays.length],
      drift: (Math.random() * 60 - 30).toFixed(0),
      rotate: (Math.random() * 360).toFixed(0),
      opacity: (0.45 + Math.random() * 0.35).toFixed(2),
    }));
  }, []);

  return (
    <div className="falling-drumsticks" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="falling-piece"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
            '--rot': `${p.rotate}deg`,
            opacity: p.opacity,
          }}
        >
          <Drumstick size={p.size} />
        </span>
      ))}
    </div>
  );
}

// Custom on-brand SVG food illustrations.
// Guaranteed to render offline; no external image dependencies.
// Each accepts size + className for flexible reuse.

function base({ size = 64, className = '', children, viewBox }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      className={className}
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function Drumstick({ size = 64, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 120 140',
    children: (
      <>
        <defs>
          <radialGradient id="dm-meat" cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffd98a" />
            <stop offset="45%" stopColor="#f0a431" />
            <stop offset="100%" stopColor="#b9690a" />
          </radialGradient>
          <linearGradient id="dm-bone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff7ec" />
            <stop offset="100%" stopColor="#e9d3b0" />
          </linearGradient>
        </defs>
        {/* bone */}
        <path
          d="M64 86 C72 104 64 120 58 128 C54 133 60 138 64 134 C70 128 78 116 74 102 Z"
          fill="url(#dm-bone)"
          stroke="#caa86f"
          strokeWidth="1.5"
        />
        <circle cx="61" cy="130" r="4.5" fill="url(#dm-bone)" stroke="#caa86f" strokeWidth="1.4" />
        {/* meat body */}
        <path
          d="M30 26 C12 42 14 70 28 86 C42 100 70 98 84 80 C96 64 92 38 76 24 C60 12 44 14 30 26 Z"
          fill="url(#dm-meat)"
          stroke="#9b5406"
          strokeWidth="1.2"
        />
        {/* crispy texture */}
        <g fill="#7a3e04" opacity="0.55">
          <circle cx="40" cy="40" r="2.4" />
          <circle cx="58" cy="34" r="2.8" />
          <circle cx="70" cy="46" r="2.2" />
          <circle cx="34" cy="60" r="2.6" />
          <circle cx="50" cy="58" r="2.2" />
          <circle cx="66" cy="62" r="2.6" />
          <circle cx="44" cy="74" r="2.4" />
          <circle cx="62" cy="78" r="2.2" />
        </g>
        {/* sheen */}
        <path
          d="M36 30 C28 38 30 52 40 58"
          stroke="#fff3cf"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
      </>
    ),
  });
}

export function Bucket({ size = 64, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 120 140',
    children: (
      <>
        <defs>
          <linearGradient id="bk-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef3b42" />
            <stop offset="100%" stopColor="#b3141a" />
          </linearGradient>
        </defs>
        {/* drumsticks sticking out */}
        <g transform="translate(28 6) rotate(-12)">
          <DrumstickInner />
        </g>
        <g transform="translate(58 2) rotate(14)">
          <DrumstickInner />
        </g>
        {/* bucket */}
        <path d="M22 60 L98 60 L92 132 Q90 138 84 138 L36 138 Q30 138 28 132 Z" fill="url(#bk-body)" stroke="#8c0f14" strokeWidth="1.5" />
        <path d="M22 60 L98 60 L94 76 L26 76 Z" fill="#fff7ec" />
        <path d="M20 56 L100 56 L100 64 L20 64 Z" fill="#fff7ec" stroke="#caa86f" strokeWidth="1.2" />
      </>
    ),
  });
}

function DrumstickInner() {
  return (
    <g>
      <path d="M12 6 C4 14 6 28 14 34 C22 40 36 38 42 28 C47 19 45 9 36 4 C27 -1 19 0 12 6 Z" fill="#f0a431" stroke="#9b5406" strokeWidth="1" />
      <path d="M40 30 C46 40 40 50 36 56" stroke="#e9d3b0" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function RiceBowl({ size = 64, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 120 120',
    children: (
      <>
        <defs>
          <linearGradient id="rb-bowl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#d9d9d9" />
          </linearGradient>
        </defs>
        {/* rice mound */}
        <path d="M30 44 Q60 22 90 44 Q86 56 60 58 Q34 56 30 44 Z" fill="#fffdf5" stroke="#e6dcc0" strokeWidth="1.2" />
        <g fill="#f3ecd6" stroke="#e0d4b0" strokeWidth="0.6">
          <circle cx="44" cy="40" r="3" />
          <circle cx="58" cy="34" r="3" />
          <circle cx="72" cy="40" r="3" />
          <circle cx="50" cy="48" r="3" />
          <circle cx="68" cy="48" r="3" />
        </g>
        {/* chicken piece on top */}
        <path d="M48 30 Q60 16 74 30 Q76 40 64 42 Q52 42 48 30 Z" fill="#f0a431" stroke="#9b5406" strokeWidth="1" />
        <circle cx="56" cy="26" r="1.8" fill="#7a3e04" />
        <circle cx="66" cy="28" r="1.8" fill="#7a3e04" />
        {/* bowl */}
        <path d="M22 56 L98 56 Q94 92 60 96 Q26 92 22 56 Z" fill="url(#rb-bowl)" stroke="#bdbdbd" strokeWidth="1.4" />
        <path d="M20 52 L100 52 L100 60 L20 60 Z" fill="#ef3b42" />
      </>
    ),
  });
}

export function Fries({ size = 64, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 120 120',
    children: (
      <>
        <defs>
          <linearGradient id="fr-carton" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef3b42" />
            <stop offset="100%" stopColor="#b3141a" />
          </linearGradient>
        </defs>
        {/* fries */}
        <g fill="#ffd23f" stroke="#e0a406" strokeWidth="1">
          <rect x="42" y="14" width="7" height="48" rx="3" />
          <rect x="53" y="10" width="7" height="52" rx="3" />
          <rect x="64" y="16" width="7" height="46" rx="3" />
          <rect x="75" y="14" width="7" height="48" rx="3" />
        </g>
        {/* carton */}
        <path d="M34 44 L88 44 L80 104 Q79 110 73 110 L49 110 Q43 110 42 104 Z" fill="url(#fr-carton)" stroke="#8c0f14" strokeWidth="1.5" />
        <path d="M32 40 L90 40 L90 48 L32 48 Z" fill="#fff7ec" stroke="#caa86f" strokeWidth="1.2" />
      </>
    ),
  });
}

export function Drink({ size = 64, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 120 120',
    children: (
      <>
        <defs>
          <linearGradient id="dr-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9842f" />
            <stop offset="100%" stopColor="#6e4a12" />
          </linearGradient>
        </defs>
        {/* cup */}
        <path d="M34 24 L86 24 L80 104 Q79 110 73 110 L47 110 Q41 110 40 104 Z" fill="#fff7ec" stroke="#caa86f" strokeWidth="1.5" />
        <path d="M37 40 L83 40 L78 100 Q77 106 72 106 L48 106 Q43 106 42 100 Z" fill="url(#dr-liquid)" />
        {/* ice */}
        <g fill="#fff" opacity="0.5">
          <rect x="46" y="48" width="12" height="12" rx="2" transform="rotate(12 52 54)" />
          <rect x="64" y="58" width="11" height="11" rx="2" transform="rotate(-10 69 63)" />
        </g>
        {/* lid */}
        <path d="M32 22 L88 22 L88 30 L32 30 Z" fill="#ef3b42" />
        {/* straw */}
        <rect x="68" y="6" width="7" height="26" rx="2" fill="#ef3b42" transform="rotate(12 71 18)" />
      </>
    ),
  });
}

export function Spicy({ size = 64, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 120 120',
    children: (
      <>
        <defs>
          <radialGradient id="sp-meat" cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffb14d" />
            <stop offset="50%" stopColor="#e8531c" />
            <stop offset="100%" stopColor="#9c2a06" />
          </radialGradient>
        </defs>
        {/* bone */}
        <path d="M62 70 C70 86 62 100 56 108 C52 113 58 118 62 114 C68 108 76 96 72 84 Z" fill="#fff7ec" stroke="#caa86f" strokeWidth="1.4" />
        <circle cx="59" cy="110" r="4" fill="#fff7ec" stroke="#caa86f" strokeWidth="1.3" />
        {/* spicy meat */}
        <path d="M28 20 C12 34 14 60 28 74 C42 86 68 84 80 68 C90 54 86 32 70 20 C54 8 40 10 28 20 Z" fill="url(#sp-meat)" stroke="#7a1f04" strokeWidth="1.2" />
        <g fill="#5e1603" opacity="0.6">
          <circle cx="40" cy="34" r="2.2" />
          <circle cx="56" cy="28" r="2.6" />
          <circle cx="68" cy="40" r="2.2" />
          <circle cx="34" cy="52" r="2.4" />
          <circle cx="64" cy="56" r="2.2" />
        </g>
        {/* chili accent */}
        <path d="M84 26 Q92 22 96 30 Q98 36 92 40 Q100 44 102 52" stroke="#d71920" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <path d="M86 24 Q88 18 94 18" stroke="#2e8b3d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </>
    ),
  });
}

export function Grid({ size = 24, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </g>
    ),
  });
}

export function Search({ size = 22, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </g>
    ),
  });
}

export function Cart({ size = 22, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h2l2.2 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 8H6" />
        <circle cx="10" cy="21" r="1.4" />
        <circle cx="18" cy="21" r="1.4" />
      </g>
    ),
  });
}

export function Star({ size = 14, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: <path d="M12 2l2.9 6.3 6.9.6-5.2 4.5 1.6 6.7L12 17l-6.2 3.6 1.6-6.7L2.2 9l6.9-.6z" fill="currentColor" />,
  });
}

export function Menu({ size = 24, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M4 7h16M4 12h16M4 17h16" />
      </g>
    ),
  });
}

export function MapPin({ size = 16, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </g>
    ),
  });
}

export function Clock({ size = 16, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </g>
    ),
  });
}

export function Scooter({ size = 48, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 64 64',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="48" r="7" />
        <circle cx="50" cy="48" r="7" />
        <path d="M14 48h10l6-16h14l6 16" />
        <path d="M30 32l-3-9h-5" />
        <path d="M44 32l5-8h6" />
      </g>
    ),
  });
}

export function Phone({ size = 16, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A14 14 0 0 1 4 7a2 2 0 0 1 1-3z" />
      </g>
    ),
  });
}

export function Instagram({ size = 18, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </g>
    ),
  });
}

export function Whatsapp({ size = 18, className = '' }) {
  return base({
    size,
    className,
    viewBox: '0 0 24 24',
    children: (
      <path
        fill="currentColor"
        d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A8 8 0 1 1 12 20zm4.6-5.9c-.3-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.5 6.5 0 0 1-1.9-1.2 7.2 7.2 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3.2-.5s0-.4 0-.5-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5.1 5.1 0 0 0 1 2.7 11.6 11.6 0 0 0 4.5 4 5.3 5.3 0 0 0 2.7.6 2.6 2.6 0 0 0 1.8-1.2 2.1 2.1 0 0 0 .2-1.2c0-.1-.2-.2-.5-.3z"
      />
    ),
  });
}

export const iconMap = {
  drumstick: Drumstick,
  bucket: Bucket,
  rice: RiceBowl,
  fries: Fries,
  drink: Drink,
  spicy: Spicy,
  grid: Grid,
};

export function FoodIcon({ name, size = 64, className = '' }) {
  const Cmp = iconMap[name] || Drumstick;
  return <Cmp size={size} className={className} />;
}

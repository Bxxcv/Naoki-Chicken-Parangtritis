// Ilustrasi hero: paha bawah ayam goreng "jatuh" ke piring, dengan uap panas
// dan remah renyah saat mendarat. Semua gerak dikontrol lewat CSS keyframes
// di styles.css (chicken-fall, basket-squash, crumb-burst, steam-rise) supaya
// mudah di-tuning dan otomatis nonaktif saat prefers-reduced-motion.
export default function FallingChicken() {
  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Ilustrasi paha ayam goreng jatuh ke piring">
      <defs>
        <linearGradient id="chickenGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6bf3a" />
          <stop offset="55%" stopColor="#d9860f" />
          <stop offset="100%" stopColor="#8a4a12" />
        </linearGradient>
      </defs>

      {/* Piring */}
      <g className="basket">
        <ellipse cx="200" cy="336" rx="128" ry="18" fill="rgba(58,36,22,.18)" />
        <ellipse cx="200" cy="320" rx="140" ry="34" fill="#fffaf2" stroke="#f0e6d8" strokeWidth="2" />
        <ellipse cx="200" cy="318" rx="110" ry="22" fill="#fff4e3" />
      </g>

      {/* Remah renyah saat mendarat */}
      <g>
        <circle className="crumb" style={{ '--tx': '-34px', '--ty': '-8px' }} cx="150" cy="300" r="4" fill="#c9720f" />
        <circle className="crumb" style={{ '--tx': '32px', '--ty': '-10px' }} cx="252" cy="298" r="4" fill="#c9720f" />
        <circle className="crumb" style={{ '--tx': '-16px', '--ty': '-30px' }} cx="178" cy="292" r="3" fill="#f6bf3a" />
        <circle className="crumb" style={{ '--tx': '20px', '--ty': '-26px' }} cx="222" cy="290" r="3" fill="#f6bf3a" />
        <circle className="crumb" style={{ '--tx': '2px', '--ty': '-36px' }} cx="200" cy="286" r="3.5" fill="#8a4a12" />
      </g>

      {/* Uap panas */}
      <g>
        <path className="steam" style={{ animationDelay: '1.5s' }} d="M172 150 C160 128 182 116 170 92" stroke="rgba(255,255,255,.85)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path className="steam" style={{ animationDelay: '2.1s' }} d="M200 142 C188 120 210 108 198 82" stroke="rgba(255,255,255,.85)" strokeWidth="6" strokeLinecap="round" fill="none" />
        <path className="steam" style={{ animationDelay: '1.8s' }} d="M228 150 C216 128 238 116 226 92" stroke="rgba(255,255,255,.75)" strokeWidth="5" strokeLinecap="round" fill="none" />
      </g>

      {/* Paha ayam goreng */}
      <g className="chicken-piece" transform="translate(0,68)">
        <path d="M188 18 C182 8 198 4 204 14 L208 46 L182 46 Z" fill="#fdf6ec" />
        <ellipse cx="195" cy="14" rx="10" ry="7" fill="#fdf6ec" />
        <path
          d="M150 40 C120 55 108 100 118 140 C126 178 150 206 190 210 C230 206 254 178 262 140
             C272 100 260 55 230 40 C214 28 166 28 150 40 Z"
          fill="url(#chickenGradient)"
          stroke="#7a3e10"
          strokeWidth="2"
        />
        <path d="M142 72 C152 60 176 52 196 55" stroke="#ffd980" strokeWidth="10" strokeLinecap="round" fill="none" opacity=".5" />
        <circle cx="150" cy="92" r="4" fill="#7a3e10" />
        <circle cx="206" cy="70" r="3" fill="#7a3e10" />
        <circle cx="232" cy="122" r="4" fill="#7a3e10" />
        <circle cx="170" cy="162" r="3" fill="#7a3e10" />
        <circle cx="216" cy="176" r="3.5" fill="#7a3e10" />
        <circle cx="140" cy="132" r="3" fill="#7a3e10" />
      </g>
    </svg>
  );
}

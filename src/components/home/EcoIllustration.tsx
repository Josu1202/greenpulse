interface EcoIllustrationProps {
  className?: string;
}
 
/**
 * Ilustración ambiental de la portada, dibujada como SVG propio.
 * No usa imágenes externas ni librerías: es liviana, escalable y nítida
 * en cualquier pantalla. La línea de pulso sobre el globo retoma la
 * identidad de la marca (GreenPulse).
 */
export function EcoIllustration({ className }: EcoIllustrationProps) {
  return (
    <svg
      viewBox="0 0 480 440"
      role="img"
      aria-label="Ilustración de un planeta verde monitoreado, con energía limpia y naturaleza"
      className={className}
    >
      <defs>
        <linearGradient id="gp-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ecfdf5" />
          <stop offset="1" stopColor="#d1fae5" />
        </linearGradient>
        <linearGradient id="gp-globe" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="gp-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#86efac" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
        <clipPath id="gp-round">
          <rect x="0" y="0" width="480" height="440" rx="32" />
        </clipPath>
      </defs>
 
      <g clipPath="url(#gp-round)">
        <rect x="0" y="0" width="480" height="440" fill="url(#gp-panel)" />
 
        <circle cx="70" cy="80" r="90" fill="#bbf7d0" opacity="0.45" />
        <circle cx="430" cy="360" r="110" fill="#a7f3d0" opacity="0.4" />
 
        <circle cx="398" cy="86" r="30" fill="#fcd34d" />
        <circle cx="398" cy="86" r="44" fill="#fcd34d" opacity="0.25" />
 
        <g transform="translate(116 196)">
          <rect x="-3" y="0" width="6" height="150" rx="3" fill="#e2e8f0" />
          <g fill="#94a3b8">
            <path d="M0 0 L-7 -54 L4 -2 Z" />
            <path d="M0 0 L50 -22 L4 4 Z" />
            <path d="M0 0 L-44 30 L-3 3 Z" />
          </g>
          <circle cx="0" cy="0" r="6" fill="#64748b" />
        </g>
 
        <path
          d="M-20 360 Q150 300 260 350 T520 348 L520 460 L-20 460 Z"
          fill="#86efac"
        />
        <path
          d="M-20 392 Q180 348 340 388 T520 386 L520 460 L-20 460 Z"
          fill="#4ade80"
        />
 
        <g transform="translate(268 196)">
          <circle r="112" fill="url(#gp-globe)" />
          <ellipse
            rx="112"
            ry="44"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.25"
          />
          <ellipse
            rx="44"
            ry="112"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.25"
          />
          <circle
            r="112"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            opacity="0.3"
          />
          <g fill="#15803d" opacity="0.85">
            <path d="M-78 -42 q22 -18 44 -6 q14 8 4 26 q-10 16 -30 14 q-26 -2 -18 -34 Z" />
            <path d="M-8 -2 q30 -12 50 8 q14 16 -2 34 q-20 20 -44 8 q-22 -12 -4 -58 Z" />
            <path d="M-50 44 q18 -8 30 8 q8 14 -8 26 q-20 12 -30 -6 q-8 -18 8 -28 Z" />
          </g>
          <polyline
            points="-104,6 -64,6 -46,-30 -22,44 2,-18 18,6 104,6"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
 
        <g transform="translate(150 250) rotate(-18)">
          <path
            d="M0 0 C 6 -42 44 -58 70 -56 C 66 -22 40 6 0 0 Z"
            fill="url(#gp-leaf)"
          />
          <path
            d="M6 -6 C 26 -22 48 -34 64 -46"
            fill="none"
            stroke="#15803d"
            strokeWidth="2"
            opacity="0.6"
          />
        </g>
 
        <g transform="translate(352 120)">
          <path
            d="M0 0 C 16 0 24 12 24 24 C 24 40 0 58 0 58 C 0 58 -24 40 -24 24 C -24 12 -16 0 0 0 Z"
            fill="#16a34a"
          />
          <circle cy="22" r="9" fill="#ffffff" />
        </g>
 
        <g transform="translate(70 372)">
          <rect x="-3" y="0" width="6" height="22" fill="#92400e" />
          <circle cy="-6" r="20" fill="#16a34a" />
          <circle cx="-12" cy="2" r="13" fill="#22c55e" />
          <circle cx="12" cy="2" r="13" fill="#22c55e" />
        </g>
        <g transform="translate(412 392)">
          <rect x="-2.5" y="0" width="5" height="18" fill="#92400e" />
          <circle cy="-4" r="16" fill="#16a34a" />
          <circle cx="-10" cy="2" r="10" fill="#22c55e" />
          <circle cx="10" cy="2" r="10" fill="#22c55e" />
        </g>
      </g>
    </svg>
  );
}
export const InkEye = ({ size = 64 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 100 60" fill="none">
    <path d="M4 30 Q 50 -6 96 30 Q 50 66 4 30 Z" stroke="var(--ink)" strokeWidth="1.4" fill="oklch(0.92 0.02 80)" />
    <circle cx="50" cy="30" r="13" fill="oklch(0.45 0.06 135)" stroke="var(--ink)" strokeWidth="1" />
    <circle cx="50" cy="30" r="5" fill="var(--ink)" />
    <circle cx="46" cy="26" r="1.6" fill="var(--paper-cream)" />
    <path d="M4 30 Q 50 -6 96 30" stroke="var(--ink)" strokeWidth="1.4" fill="none" />
    <path d="M8 32 Q 12 22 18 22 M82 22 Q 88 22 92 32" stroke="var(--ink)" strokeWidth="0.8" fill="none" />
  </svg>
)

export const SunDial = ({ size = 80 }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <circle cx="40" cy="40" r="20" fill="oklch(0.94 0.05 85)" stroke="var(--ink)" strokeWidth="0.8" />
    {Array.from({ length: 24 }).map((_, i) => {
      const a = (i / 24) * Math.PI * 2
      const r1 = 22, r2 = i % 6 === 0 ? 36 : 30
      return <line key={i} x1={40 + r1 * Math.cos(a)} y1={40 + r1 * Math.sin(a)} x2={40 + r2 * Math.cos(a)} y2={40 + r2 * Math.sin(a)} stroke="var(--ink)" strokeWidth="0.7" />
    })}
    <circle cx="40" cy="40" r="3" fill="var(--ink)" />
  </svg>
)

export const Ornament = ({ size = 100 }) => (
  <svg width={size} height={size * 0.3} viewBox="0 0 200 60" fill="none">
    <path d="M0 30 L80 30 M120 30 L200 30" stroke="var(--ink)" strokeWidth="0.8" />
    <circle cx="100" cy="30" r="6" fill="none" stroke="var(--ink)" strokeWidth="0.8" />
    <path d="M80 30 Q 90 22 100 30 Q 110 38 120 30" stroke="var(--ink)" strokeWidth="0.8" fill="none" />
    <circle cx="78" cy="30" r="1.5" fill="var(--ink)" />
    <circle cx="122" cy="30" r="1.5" fill="var(--ink)" />
  </svg>
)

export const PlantSprig = ({ size = 200, hue = 135, flip = false }) => (
  <svg width={size} height={size * 1.5} viewBox="0 0 200 300" fill="none"
       style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
    <path d="M100 290 C 102 240, 88 200, 100 160 C 112 130, 90 90, 110 40"
      stroke={`oklch(0.32 0.06 ${hue})`} strokeWidth="1.5" fill="none" />
    {[[50,250,-35],[150,230,35],[60,195,-20],[148,175,24],[70,145,-28],[142,130,28],[78,100,-18],[130,80,26]].map(([x,y,r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <path d="M0 0 C -10 6, -14 22, 0 36 C 14 22, 10 6, 0 0 Z"
          fill={`oklch(0.5 0.08 ${hue} / 0.7)`} stroke={`oklch(0.32 0.06 ${hue})`} strokeWidth="0.7" />
        <line x1="0" y1="2" x2="0" y2="34" stroke={`oklch(0.32 0.06 ${hue})`} strokeWidth="0.5" />
      </g>
    ))}
    <g transform="translate(110 40)">
      <circle r="6" fill={`oklch(0.55 0.12 ${hue + 20})`} stroke="var(--ink)" strokeWidth="0.6" />
      {[0,60,120,180,240,300].map((a, i) => (
        <ellipse key={i} cx={Math.cos(a*Math.PI/180)*8} cy={Math.sin(a*Math.PI/180)*8}
          rx="5" ry="3" transform={`rotate(${a})`}
          fill={`oklch(0.78 0.08 ${hue + 30} / 0.85)`} stroke="var(--ink)" strokeWidth="0.5" />
      ))}
      <circle r="2.5" fill="oklch(0.85 0.12 80)" />
    </g>
  </svg>
)

export const Leaf = ({ size = 60, hue = 135 }) => (
  <svg width={size} height={size * 1.35} viewBox="0 0 60 80" fill="none">
    <path d="M30 4 C 15 18, 7 44, 13 62 C 17 72, 24 78, 30 78 C 36 78, 43 72, 47 62 C 53 44, 45 18, 30 4 Z"
      fill={`oklch(0.47 0.09 ${hue} / 0.65)`} stroke={`oklch(0.28 0.07 ${hue})`} strokeWidth="0.8" />
    <path d="M30 5 C 29 30, 30 55, 30 76" stroke={`oklch(0.26 0.07 ${hue})`} strokeWidth="0.9" fill="none" />
    <path d="M30 22 C 22 26, 18 34, 16 42 M30 22 C 38 26, 42 34, 44 42 M30 42 C 20 48, 16 56, 15 64 M30 42 C 40 48, 44 56, 45 64"
      stroke={`oklch(0.27 0.07 ${hue} / 0.65)`} strokeWidth="0.55" fill="none" />
    <path d="M29 32 C 25 33, 22 38, 20 42 M31 32 C 35 33, 38 38, 40 42"
      stroke={`oklch(0.27 0.07 ${hue} / 0.38)`} strokeWidth="0.4" fill="none" />
  </svg>
)

export const LeafC = ({ size = 60, hue = 135 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 60 72" fill="none">
    <path d="M30 68 C 30 52, 20 46, 14 36 C 8 26, 10 12, 18 8 C 22 7, 26 12, 30 14 C 34 12, 38 7, 42 8 C 50 12, 52 26, 46 36 C 40 46, 30 52, 30 68 Z"
      fill={`oklch(0.44 0.10 ${hue} / 0.62)`} stroke={`oklch(0.28 0.07 ${hue})`} strokeWidth="0.8" />
    <path d="M30 14 L 30 66" stroke={`oklch(0.26 0.07 ${hue})`} strokeWidth="0.9" fill="none" />
    <path d="M30 32 C 22 28, 16 20, 16 12 M30 32 C 38 28, 44 20, 44 12"
      stroke={`oklch(0.27 0.07 ${hue} / 0.6)`} strokeWidth="0.55" fill="none" />
    <path d="M30 50 C 24 46, 20 40, 18 34 M30 50 C 36 46, 40 40, 42 34"
      stroke={`oklch(0.27 0.07 ${hue} / 0.45)`} strokeWidth="0.45" fill="none" />
  </svg>
)

export const LeafB = ({ size = 60, hue = 135 }) => (
  <svg width={size} height={size * 1.1} viewBox="0 0 60 66" fill="none">
    <path d="M30 6 C 8 10, 4 28, 8 44 C 12 58, 22 64, 30 64 C 38 64, 48 58, 52 44 C 56 28, 52 10, 30 6 Z"
      fill={`oklch(0.50 0.08 ${hue} / 0.60)`} stroke={`oklch(0.28 0.07 ${hue})`} strokeWidth="0.8" />
    <path d="M30 8 L 30 62" stroke={`oklch(0.26 0.07 ${hue})`} strokeWidth="0.9" fill="none" />
    <path d="M30 26 C 18 24, 10 32, 8 42 M30 26 C 42 24, 50 32, 52 42 M30 44 C 20 42, 14 50, 12 58 M30 44 C 40 42, 46 50, 48 58"
      stroke={`oklch(0.27 0.07 ${hue} / 0.55)`} strokeWidth="0.5" fill="none" />
  </svg>
)

export const Butterfly = ({ size = 44 }) => (
  <svg width={size} height={size * 0.9} viewBox="0 0 54 48" fill="none">
    <path d="M27 24 C 14 6, 2 10, 4 22 C 6 34, 20 32, 27 24 Z"
      fill="oklch(0.52 0.12 38 / 0.72)" stroke="oklch(0.28 0.06 40)" strokeWidth="0.7" />
    <path d="M27 24 C 40 6, 52 10, 50 22 C 48 34, 34 32, 27 24 Z"
      fill="oklch(0.52 0.12 38 / 0.72)" stroke="oklch(0.28 0.06 40)" strokeWidth="0.7" />
    <path d="M27 24 C 14 30, 8 38, 12 44 C 16 48, 22 44, 27 24 Z"
      fill="oklch(0.58 0.10 42 / 0.62)" stroke="oklch(0.28 0.06 40)" strokeWidth="0.6" />
    <path d="M27 24 C 40 30, 46 38, 42 44 C 38 48, 32 44, 27 24 Z"
      fill="oklch(0.58 0.10 42 / 0.62)" stroke="oklch(0.28 0.06 40)" strokeWidth="0.6" />
    <path d="M27 24 C 18 16, 10 18, 7 24 M27 24 C 36 16, 44 18, 47 24"
      stroke="oklch(0.28 0.06 40 / 0.28)" strokeWidth="0.5" fill="none" />
    <ellipse cx="27" cy="24" rx="1.8" ry="11" fill="oklch(0.22 0.03 40)" />
    <circle cx="27" cy="13" r="2" fill="oklch(0.22 0.03 40)" />
    <path d="M26 13 C 23 9, 20 5, 18 2 M28 13 C 31 9, 34 5, 36 2"
      stroke="oklch(0.22 0.03 40)" strokeWidth="0.7" fill="none" />
    <circle cx="18" cy="2" r="1.2" fill="oklch(0.22 0.03 40)" />
    <circle cx="36" cy="2" r="1.2" fill="oklch(0.22 0.03 40)" />
  </svg>
)

export const ButterflyC = ({ size = 44 }) => (
  <svg width={size * 1.1} height={size} viewBox="0 0 60 54" fill="none">
    <path d="M30 26 C 20 10, 4 12, 4 22 C 4 30, 16 34, 30 26 Z"
      fill="oklch(0.46 0.14 55 / 0.68)" stroke="oklch(0.28 0.06 55)" strokeWidth="0.7" />
    <path d="M30 26 C 40 10, 56 12, 56 22 C 56 30, 44 34, 30 26 Z"
      fill="oklch(0.46 0.14 55 / 0.68)" stroke="oklch(0.28 0.06 55)" strokeWidth="0.7" />
    <path d="M30 26 C 18 34, 10 40, 12 46 C 13 50, 18 50, 20 46 L 16 54"
      fill="oklch(0.52 0.12 55 / 0.58)" stroke="oklch(0.28 0.06 55)" strokeWidth="0.65" />
    <path d="M30 26 C 42 34, 50 40, 48 46 C 47 50, 42 50, 40 46 L 44 54"
      fill="oklch(0.52 0.12 55 / 0.58)" stroke="oklch(0.28 0.06 55)" strokeWidth="0.65" />
    <circle cx="11" cy="21" r="2.5" fill="oklch(0.82 0.08 80 / 0.55)" />
    <circle cx="49" cy="21" r="2.5" fill="oklch(0.82 0.08 80 / 0.55)" />
    <ellipse cx="30" cy="26" rx="1.5" ry="10" fill="oklch(0.22 0.03 55)" />
    <circle cx="30" cy="16" r="1.8" fill="oklch(0.22 0.03 55)" />
    <path d="M29 16 C 26 12, 22 8, 20 5 M31 16 C 34 12, 38 8, 40 5"
      stroke="oklch(0.22 0.03 55)" strokeWidth="0.7" fill="none" />
  </svg>
)

export const ButterflyB = ({ size = 44 }) => (
  <svg width={size * 1.2} height={size * 0.75} viewBox="0 0 65 40" fill="none">
    <path d="M32 22 C 24 8, 6 6, 3 16 C 1 24, 10 32, 32 22 Z"
      fill="oklch(0.50 0.09 220 / 0.62)" stroke="oklch(0.28 0.06 220)" strokeWidth="0.7" />
    <path d="M32 22 C 40 8, 58 6, 61 16 C 63 24, 54 32, 32 22 Z"
      fill="oklch(0.50 0.09 220 / 0.62)" stroke="oklch(0.28 0.06 220)" strokeWidth="0.7" />
    <path d="M32 22 C 20 28, 12 34, 15 38 C 18 40, 26 36, 32 22 Z"
      fill="oklch(0.56 0.07 220 / 0.52)" stroke="oklch(0.28 0.06 220)" strokeWidth="0.6" />
    <path d="M32 22 C 44 28, 52 34, 49 38 C 46 40, 38 36, 32 22 Z"
      fill="oklch(0.56 0.07 220 / 0.52)" stroke="oklch(0.28 0.06 220)" strokeWidth="0.6" />
    <path d="M30 14 C 26 10, 22 6, 20 3 M34 14 C 38 10, 42 6, 44 3"
      stroke="oklch(0.22 0.03 220)" strokeWidth="0.7" fill="none" />
    <circle cx="20" cy="3" r="1.2" fill="oklch(0.22 0.03 220)" />
    <circle cx="44" cy="3" r="1.2" fill="oklch(0.22 0.03 220)" />
    <ellipse cx="32" cy="22" rx="1.5" ry="9" fill="oklch(0.22 0.03 220)" />
    <circle cx="32" cy="13" r="1.8" fill="oklch(0.22 0.03 220)" />
  </svg>
)

export const BrushStroke = ({ size = 100, hue = 135, revealed = false }) => (
  <svg width={size} height={size * 0.22} viewBox="0 0 140 30" fill="none" style={{ overflow: 'visible' }}>
    <path
      d="M5 22 C 22 12, 56 7, 90 10 C 120 13, 135 19, 136 22"
      stroke={`oklch(0.40 0.10 ${hue} / 0.44)`}
      strokeWidth="11" strokeLinecap="round"
      style={{ strokeDasharray: 210, strokeDashoffset: revealed ? 0 : 210, transition: revealed ? 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1)' : 'none' }}
    />
    <path
      d="M8 19 C 28 10, 60 6, 92 8 C 122 10, 135 16, 136 19"
      stroke={`oklch(0.62 0.05 ${hue} / 0.18)`}
      strokeWidth="3" strokeLinecap="round"
      style={{ strokeDasharray: 210, strokeDashoffset: revealed ? 0 : 210, transition: revealed ? 'stroke-dashoffset 2s cubic-bezier(.4,0,.2,1) 0.1s' : 'none' }}
    />
  </svg>
)

export const PaintDab = ({ size = 36, hue = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <path d="M20 4 C 30 3, 38 11, 37 21 C 36 31, 28 37, 19 36 C 10 35, 3 27, 4 17 C 5 8, 12 5, 20 4 Z"
      fill={`oklch(0.52 0.13 ${hue} / 0.52)`} />
    <path d="M13 12 C 17 9, 26 11, 28 18"
      stroke={`oklch(0.70 0.08 ${hue} / 0.42)`} strokeWidth="2.2" strokeLinecap="round" fill="none" />
  </svg>
)

export const InkDrip = ({ size = 28, hue = 60 }) => (
  <svg width={size} height={size * 1.7} viewBox="0 0 28 48" fill="none">
    <path d="M14 3 C 22 3, 26 9, 26 17 C 26 28, 18 41, 14 46 C 10 41, 2 28, 2 17 C 2 9, 6 3, 14 3 Z"
      fill={`oklch(0.30 0.04 ${hue} / 0.45)`} />
    <ellipse cx="13" cy="13" rx="5" ry="3.5" transform="rotate(-15 13 13)"
      fill={`oklch(0.55 0.03 ${hue} / 0.28)`} />
  </svg>
)

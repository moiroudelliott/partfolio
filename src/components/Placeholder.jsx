import { useState, useEffect } from 'react'

const TONES = {
  warm:  { bg: 'oklch(0.86 0.04 75)',  stripe: 'oklch(0.78 0.05 70)',  ink: 'oklch(0.32 0.04 60)' },
  cool:  { bg: 'oklch(0.82 0.04 230)', stripe: 'oklch(0.7 0.06 230)',  ink: 'oklch(0.28 0.05 235)' },
  moss:  { bg: 'oklch(0.78 0.06 135)', stripe: 'oklch(0.68 0.07 135)', ink: 'oklch(0.28 0.05 135)' },
  rust:  { bg: 'oklch(0.78 0.08 40)',  stripe: 'oklch(0.68 0.1 38)',   ink: 'oklch(0.3 0.06 40)' },
  paper: { bg: 'oklch(0.92 0.025 80)', stripe: 'oklch(0.83 0.035 75)', ink: 'oklch(0.32 0.04 60)' },
  ink:   { bg: 'oklch(0.32 0.02 65)',  stripe: 'oklch(0.22 0.02 60)',  ink: 'oklch(0.85 0.02 75)' },
}

// tape par défaut : toujours affiché, angle aléatoire selon seed
function defaultTape(seed = 0) {
  const angles = [-8, 6, -5, 9, -7, 5, -10, 4]
  const lefts  = ['30%', '50%', '40%', '60%', '35%', '55%', '45%', '50%']
  return { rotate: angles[seed % angles.length], left: lefts[seed % lefts.length] }
}

export default function Placeholder({
  label = 'image', code, ratio = '4 / 5', tone = 'warm',
  rotate = 0, hoverRot = -2,
  tape,          // objet { rotate, left } | false pour désactiver
  tapeSeed = 0,  // index pour varier le scotch automatiquement
  stripes = true,
  style = {}, className = '',
  caption = null, deckle = false, image = null,
  onClick = null,
}) {
  const [imgLoaded, setImgLoaded] = useState(false)
  useEffect(() => { setImgLoaded(false) }, [image])

  const t = TONES[tone] ?? TONES.warm
  const bgImage = stripes
    ? `repeating-linear-gradient(135deg, ${t.bg} 0 9px, ${t.stripe} 9px 10px)`
    : t.bg

  // Si tape === false → pas de scotch. Sinon on merge avec le défaut
  const tapeProps = tape === false ? null : { ...defaultTape(tapeSeed), ...(tape || {}) }

  const isClickable = !!onClick

  return (
    <div
      className={'hoverable ' + className}
      data-cursor="hover"
      onClick={onClick ?? undefined}
      style={{
        position: 'relative',
        transform: `rotate(${rotate}deg)`,
        '--hover-rot': `${hoverRot}deg`,
        cursor: isClickable ? 'none' : undefined,
        ...style,
      }}
    >
      {tapeProps && (
        <span className="tape" style={{
          left: tapeProps.left ?? '50%',
          top: tapeProps.top ?? -10,
          transform: `translateX(-50%) rotate(${tapeProps.rotate ?? -4}deg)`,
        }} />
      )}

      <div className={'ph' + (deckle ? ' deckle' : '')}
           style={{ aspectRatio: ratio, background: image ? 'var(--paper-warm)' : bgImage, color: t.ink }}>
        {image ? (
          <>
            {!imgLoaded && <div className="img-shimmer" />}
            <img
              src={image} alt={label}
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.5s ease', zIndex: 2 }}
            />
          </>
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: t.ink, opacity: 0.7 }}>
            <span style={{ border: `1px dashed ${t.ink}`, padding: '6px 10px', background: 'oklch(0.95 0.02 80 / 0.35)' }}>{label}</span>
          </div>
        )}
        <div className="ph-label"><span>{code || label}</span><span>·</span></div>
      </div>

      {caption && (
        <div className="hand" style={{ fontSize: 16, marginTop: 8, textAlign: 'center', transform: 'rotate(-1deg)' }}>{caption}</div>
      )}
    </div>
  )
}
